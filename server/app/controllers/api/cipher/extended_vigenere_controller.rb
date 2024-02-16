class Api::Cipher::ExtendedVigenereController < ApplicationController
  before_action :convert_to_bytes
  def create
    unless params[:mode] == "encrypt" or params[:mode] == "decrypt"
      render json: { message: "Invalid mode" }, status: :unprocessable_entity
    end

    if params[:mode] == "encrypt"
      encrypted_bytes = encrypt
      render json: {
        bytes: encrypted_bytes,
        result: Base64.encode64(encrypted_bytes.pack('C*')),
        hex: encrypted_bytes.map { |byte| format("%02x ", byte) }.join,
        binary: encrypted_bytes.map { |byte| format("%08b ", byte) }.join(' ')
      }, status: :ok
    elsif params[:mode] == "decrypt"
      decrypted_bytes = decrypt
      render json: { result: decrypted_bytes.pack('C*').force_encoding('UTF-8') }, status: :ok
    end
  end

  private

  def convert_to_bytes
    if params[:mode] == "decrypt"
      @plaintext_bytes = Base64.decode64(params[:text]).bytes
    else
      @plaintext_bytes = params[:text].bytes
    end
    @key_bytes = params[:key].bytes
  end

  def encrypt
    encrypted_bytes = []
    key_length = @key_bytes.length

    (0..@plaintext_bytes.length - 1).each do |i|
      plain_byte = @plaintext_bytes[i]
      key_byte = @key_bytes[i % key_length]

      encrypted_byte = (plain_byte + key_byte) % 256

      encrypted_bytes.append(encrypted_byte)
    end

    encrypted_bytes
  end

  def decrypt
    decrypted_bytes = []
    key_length = @key_bytes.length

    (0..@plaintext_bytes.length - 1).each do |i|
      encrypted_byte = @plaintext_bytes[i]
      key_byte = @key_bytes[i % key_length]

      decrypted_byte = (encrypted_byte - key_byte + 256) % 256

      decrypted_bytes.append(decrypted_byte)
    end

    decrypted_bytes
  end
end
