class Api::Cipher::AffineController < ApplicationController
  def create
    unless params[:mode] == "encrypt" or params[:mode] == "decrypt"
      render json: { message: "Invalid mode" }, status: :unprocessable_entity
    end

    text = extract_text_content
    slope = params[:slope].to_i
    intercept = params[:intercept].to_i

    if slope.gcd(26) != 1
      render json: { message: "Slope is not relatively prime to the total number of alphabets" }, status: :bad_request
      return
    end

    if params[:mode] == "encrypt"
      encrypted_text = encrypt(text, slope, intercept)
      render json: { result: encrypted_text }, status: :ok
    elsif params[:mode] == "decrypt"
      decrypted_text = decrypt(text, slope, intercept)
      render json: { result: decrypted_text }, status: :ok
    end
  end

  private

  def extract_text_content
    if params[:file].present?
      File.read(params[:file].tempfile)
    else
      params[:text]
    end
  end

  def encrypt(text, slope, intercept)
    plaintext = text.delete(" ")
    ciphertext = ""
    
    plaintext.each_char do |c|
      plain_char_ascii = c.ord
  
      if "A".ord <= plain_char_ascii and plain_char_ascii <= "Z".ord
        cipher_char_ascii = (((plain_char_ascii - "A".ord) * slope) + intercept) % 26
        cipher_char_ascii += "A".ord
      elsif "a".ord <= plain_char_ascii and plain_char_ascii <= "z".ord
        cipher_char_ascii = (((plain_char_ascii - "a".ord) * slope) + intercept) % 26
        cipher_char_ascii += "a".ord
      else
        cipher_char_ascii = plain_char_ascii
      end
  
      ciphertext << cipher_char_ascii
    end
  
    return ciphertext.upcase
  end

  def find_inverse(m)
    x = 0
    while x < 26 do
      return x if (m * x) % 26 == 1
      x += 1
    end
  
    return x
  end

  def decrypt(text, slope, intercept)
    ciphertext = text.delete(" ")
    plaintext = ""

    inverse_slope = find_inverse(slope)

    ciphertext.each_char do |c|
      cipher_char_ascii = c.ord
  
      if "A".ord <= cipher_char_ascii and cipher_char_ascii <= "Z".ord
        cipher_char_ascii -= "A".ord
        cipher_char_ascii = inverse_slope * (cipher_char_ascii - intercept)
        if cipher_char_ascii < 0
          cipher_char_ascii = (26 * ((cipher_char_ascii * -1).fdiv(26)).ceil) + cipher_char_ascii
        end
        plain_char_ascii = cipher_char_ascii % 26
        plain_char_ascii += "A".ord
      elsif "a".ord <= cipher_char_ascii and cipher_char_ascii <= "z".ord
        cipher_char_ascii -= "a".ord
        cipher_char_ascii = inverse_slope * (cipher_char_ascii - intercept)
        if cipher_char_ascii < 0
          cipher_char_ascii = (26 * ((cipher_char_ascii * -1).fdiv(26)).ceil) + cipher_char_ascii
        end
        plain_char_ascii = cipher_char_ascii % 26
        plain_char_ascii += "a".ord
      else
        plain_char_ascii = cipher_char_ascii
      end
  
      plaintext << plain_char_ascii
    end
  
    return plaintext.upcase
  end

end