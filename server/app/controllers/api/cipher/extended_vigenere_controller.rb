class Api::Cipher::ExtendedVigenereController < ApplicationController
  before_action :set_key_bytes

  def create
    return render_invalid_mode unless valid_mode?
    return render_invalid_key unless key_present?

    if params[:file].present?
      process_file
    else
      set_input_bytes
      process_text
    end
  end

  private

  def valid_mode?
    %w[encrypt decrypt].include?(params[:mode])
  end

  def key_present?
    params[:key].present?
  end

  def render_invalid_mode
    render json: { message: "Invalid mode" }, status: :unprocessable_entity
  end

  def render_invalid_key
    render json: { message: "Key cannot be empty" }, status: :unprocessable_entity
  end

  def process_file
    method = "#{params[:mode]}_file"
    send(method)
  end

  def encrypt_file
    encrypted_data, filename = handle_file_encryption(params[:file])
    send_encrypted_data(encrypted_data, filename)
  end

  def decrypt_file
    decrypted_data, filename = handle_file_decryption(params[:file])
    send_decrypted_data(decrypted_data, filename)
  end

  def process_text
    method = "#{params[:mode]}_text"
    result = send(method, @input_bytes)
    if params[:mode] == "encrypt"
      render_encrypted_text(result)
    else
      render_decrypted_text(result)
    end
  end

  def set_key_bytes
    @key_bytes = params[:key].bytes
  end

  def set_input_bytes
    @input_bytes = params[:mode] == "decrypt" ? Base64.decode64(params[:text]).bytes : params[:text].bytes
  end

  def handle_file_encryption(file)
    content = File.read(file.tempfile, mode: "rb")
    encrypted_bytes = encrypt_text(content.bytes)
    metadata_encoded = encode_metadata(file.original_filename)
    [metadata_encoded + encrypted_bytes.pack("C*"), "Encrypted_#{file.original_filename}"]
  end

  def handle_file_decryption(file)
    content, filename = decrypt_file_content(File.read(file.tempfile, mode: "rb"))
    [content, filename]
  end

  def send_encrypted_data(data, filename)
    send_data data, filename: filename, type: "application/octet-stream", disposition: "attachment"
  end

  def send_decrypted_data(data, filename)
    send_data data, filename: filename, type: "application/octet-stream", disposition: "attachment"
  end

  def render_encrypted_text(encrypted_bytes)
    render json: {
      bytes: encrypted_bytes,
      result: Base64.encode64(encrypted_bytes.pack("C*"))
    }, status: :ok
  end

  def render_decrypted_text(decrypted_bytes)
    render json: { result: decrypted_bytes.pack("C*").force_encoding("UTF-8") }, status: :ok
  end

  def encode_metadata(filename)
    metadata = { filename: filename }.to_json
    metadata_encoded = Base64.strict_encode64(metadata)
    metadata_length = [metadata_encoded.bytesize].pack("N")
    "#{metadata_length}#{metadata_encoded}"
  end

  def decrypt_file_content(content)
    metadata_length = content[0...4].unpack("N").first
    metadata = JSON.parse(Base64.decode64(content[4...(4+metadata_length)]))
    original_filename = metadata["filename"]

    encrypted_content = content[(4+metadata_length)..].unpack("C*")
    decrypted_bytes = decrypt_text(encrypted_content)
    [decrypted_bytes.pack("C*"), original_filename]
  end

  def encrypt_text(text)
    encrypted_bytes = []
    key_length = @key_bytes.length

    (0..text.length - 1).each do |i|
      plain_byte = text[i]
      key_byte = @key_bytes[i % key_length]

      encrypted_byte = (plain_byte + key_byte) % 256

      encrypted_bytes.append(encrypted_byte)
    end

    encrypted_bytes
  end

  def decrypt_text(text)
    decrypted_bytes = []
    key_length = @key_bytes.length

    (0..text.length - 1).each do |i|
      encrypted_byte = text[i]
      key_byte = @key_bytes[i % key_length]

      decrypted_byte = (encrypted_byte - key_byte + 256) % 256

      decrypted_bytes.append(decrypted_byte)
    end

    decrypted_bytes
  end
end
