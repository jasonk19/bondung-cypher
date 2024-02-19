require "matrix"

class Api::Cipher::HillController < ApplicationController
  def create
    unless params[:mode] == "encrypt" or params[:mode] == "decrypt"
      render json: { message: "Invalid mode" }, status: :unprocessable_entity
    end

    matrix = create_matrix
    text = params[:text]

    if !is_matrix_inversible(matrix)
      render json: { message: "Matrix is not inversible" }, status: :bad_request
    end

    if params[:mode] == "encrypt"
      encrypted_text = encrypt(text, matrix)
      render json: { result: encrypted_text }, status: :ok
    elsif params[:mode] == "decrypt"
      decrypted_text = decrypt(text, matrix)
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

  REVERSE_ALPHABETS = {
    0 => "a", 
    1 => "b", 
    2 => "c", 
    3 => "d", 
    4 => "e", 
    5 => "f", 
    6 => "g", 
    7 => "h", 
    8 => "i", 
    9 => "j", 
    10 => "k",
    11 => "l", 
    12 => "m", 
    13 => "n", 
    14 => "o", 
    15 => "p", 
    16 => "q", 
    17 => "r", 
    18 => "s", 
    19 => "t", 
    20 => "u", 
    21 => "v", 
    22 => "w", 
    23 => "x", 
    24 => "y", 
    25 => "z"
  }


  def create_matrix
    matrix_params = if params[:file].present?
      JSON.parse(params[:matrix])
    else
      params[:matrix]
    end

    return Matrix[*matrix_params]
  end

  def is_matrix_inversible(matrix)
    begin
      inverse = matrix.inverse
      return true
    rescue Matrix::ErrDimensionSingular
      return false
    end
  end

  def encrypt(text, matrix)
    substring_count = matrix.row_count
    position = 0
    ciphertext = ""

    while position < text.size do
      substring = text[position, substring_count]
      substring_alphabet_numbers = []

      substring.each_char do |c|
        substring_alphabet_numbers.append([ALPHABETS[c.downcase]])
      end

      substring_matrix = Matrix[*substring_alphabet_numbers]

      matrix_mult = matrix * substring_matrix

      matrix_mult.each do |res|
        mod_res = res % 26
        ciphertext << REVERSE_ALPHABETS[mod_res]
      end

      position += substring_count
    end

    return ciphertext.upcase
  end

  def find_determinant_inverse(m)
    x = 0
    while x < 26 do
      return x if (m * x) % 26 == 1
      x += 1
    end
  
    return x
  end

  def find_inverse_matrix(matrix)
    determinant = matrix.det

    if determinant < 0
      determinant = 26 * ((determinant * -1).fdiv(26)).ceil + determinant
    end

    determinant %= 26
    
    determinant = find_determinant_inverse(determinant)

    inverse_matrix = matrix.inverse

    inverse_matrix = inverse_matrix.collect { |e| ((e * matrix.det) * determinant) % 26 }

    return inverse_matrix
  end

  def decrypt(text, matrix)
    inverse_matrix = find_inverse_matrix(matrix)

    substring_count = inverse_matrix.row_count
    position = 0
    plaintext = ""

    while position < text.size do
      substring = text[position, substring_count]
      substring_alphabet_numbers = []

      substring.each_char do |c|
        substring_alphabet_numbers.append([ALPHABETS[c.downcase]])
      end

      substring_matrix = Matrix[*substring_alphabet_numbers]

      matrix_mult = inverse_matrix * substring_matrix

      matrix_mult.each do |res|
        mod_res = res % 26
        plaintext << REVERSE_ALPHABETS[mod_res.to_i]
      end

      position += substring_count
    end

    return plaintext.upcase
  end

end