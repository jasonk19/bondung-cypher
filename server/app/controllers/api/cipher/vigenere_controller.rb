class Api::Cipher::VigenereController < ApplicationController
  def create
    unless params[:mode] == "encrypt" or params[:mode] == "decrypt"
      render json: { message: "Invalid mode" }, status: :unprocessable_entity
    end

    text = params[:text]
    key = params[:key]

    if params[:mode] == "encrypt"
      encrypted_text = encrypt(text, key)
      render json: { result: encrypted_text }, status: :ok
    elsif params[:mode] == "decrypt"
      decrypted_text = decrypt(text, key)
      render json: { result: decrypted_text }, status: :ok
    end
  end

  private

  ALPHABETS = {
    "a" => 0,
    "b" => 1,
    "c" => 2,
    "d" => 3,
    "e" => 4,
    "f" => 5,
    "g" => 6,
    "h" => 7,
    "i" => 8,
    "j" => 9,
    "k" => 10,
    "l" => 11,
    "m" => 12,
    "n" => 13,
    "o" => 14,
    "p" => 15,
    "q" => 16,
    "r" => 17,
    "s" => 18,
    "t" => 19,
    "u" => 20,
    "v" => 21,
    "w" => 22,
    "x" => 23,
    "y" => 24,
    "z" => 25,
  }

  def encrypt(text, key)
    plaintext = text.delete(" ")
    ciphertext = ""
    key_position = 0

    plaintext.each_char.with_index do |c, i|
      plain_char_ascii = c.ord

      if "A".ord <= plain_char_ascii and plain_char_ascii <= "Z".ord
        cipher_char_ascii = (plain_char_ascii - "A".ord + ALPHABETS[key[key_position].downcase]) % 26
        cipher_char_ascii = cipher_char_ascii + "A".ord
        key_position += 1
      elsif "a".ord <= plain_char_ascii and plain_char_ascii <= "z".ord
        cipher_char_ascii = (plain_char_ascii - "a".ord + ALPHABETS[key[key_position].downcase]) % 26
        cipher_char_ascii = cipher_char_ascii + "a".ord
        key_position += 1
      else
        cipher_char_ascii = plain_char_ascii
      end

      if key_position >= key.size
        key_position = 0
      end

      ciphertext << cipher_char_ascii.chr
    end

    return ciphertext
  end

  def decrypt(text, key)
    ciphertext = text.delete(" ")
    plaintext = ""
    key_position = 0

    ciphertext.each_char.with_index do |c, i|
      cipher_char_ascii = c.ord

      if "A".ord <= cipher_char_ascii and cipher_char_ascii <= "Z".ord
        cipher_char_ascii -= "A".ord
        cipher_char_ascii -= ALPHABETS[key[key_position].downcase]
        if cipher_char_ascii < 0
          cipher_char_ascii += 26
        end
        plain_char_ascii = cipher_char_ascii % 26
        plain_char_ascii += "A".ord
        key_position += 1
      elsif "a".ord <= cipher_char_ascii and cipher_char_ascii <= "z".ord
        cipher_char_ascii -= "a".ord
        cipher_char_ascii -= ALPHABETS[key[key_position].downcase]
        if cipher_char_ascii < 0
          cipher_char_ascii += 26
        end
        plain_char_ascii = cipher_char_ascii % 26
        plain_char_ascii += "a".ord
        key_position += 1
      else
        plain_char_ascii = cipher_char_ascii
      end

      if key_position >= key.size
        key_position = 0
      end

      plaintext << plain_char_ascii.chr
    end

    return plaintext
  end

end