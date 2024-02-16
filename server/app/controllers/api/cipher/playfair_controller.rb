require "matrix"
require "json"

class Api::Cipher::PlayfairController < ApplicationController
  before_action :create_matrix
  def create
    unless params[:mode] == "encrypt" || params[:mode] == "decrypt"
      render json: { message: "Invalid mode" }, status: :unprocessable_entity
    end

    text_content = extract_text_content
    pairs = prepare_text(text_content)

    if params[:mode] == "encrypt"
      encrypted_text = encrypt(pairs)
      render json: { pairs: pairs, result: encrypted_text }, status: :ok
    elsif params[:mode] == "decrypt"
      decrypted_text = decrypt(pairs)
      render json: { pairs: pairs, result: decrypted_text }, status: :ok
    end
  end

  private

  def create_matrix
    matrix_params = if params[:file].present?
      JSON.parse(params[:matrix])
    else
      params[:matrix]
    end

    @matrix = Matrix[*matrix_params]

    matrix_array = @matrix.to_a.flatten

    if matrix_array.uniq.length != matrix_array.length
      render json: { message: "Duplicate key in Playfair Grid" }, status: :bad_request
    end
  end

  def extract_text_content
    if params[:file].present?
      File.read(params[:file].tempfile)
    else
      params[:text]
    end
  end

  def prepare_text(text)
    if params[:mode] == "encrypt"
      upper_case = text.upcase
      no_j_text = upper_case.gsub('J', 'I')
      no_numbers_text = no_j_text.gsub(/[^a-zA-Z]/, '')

      no_duplicate_text = ""

      i = 0
      while i < no_numbers_text.length
        if i == no_numbers_text.length - 1
          no_duplicate_text.concat(no_numbers_text[i])
          no_duplicate_text.concat('X')
          break
        end

        current_char = no_numbers_text[i]
        next_char = no_numbers_text[i + 1]

        no_duplicate_text.concat(current_char)

        if current_char == next_char
          no_duplicate_text.concat('X')
          i += 1
        else
          no_duplicate_text.concat(next_char)
          i += 2
        end
      end

      no_duplicate_text.chars.each_slice(2).map(&:join)
    else
      upper_case = text.upcase
      upper_case.chars.each_slice(2).map(&:join)
    end
  end

  def find_element_in_matrix(matrix, element)
    matrix.each_with_index do |el, row, col|
      return [row, col] if el == element
    end
    nil
  end

  def encrypt(pairs)
    encrypted_text = ""
    pairs.each do |pair|
      new_pair = ""
      first_char = pair[0]
      second_char = pair[1]

      index_first_char = find_element_in_matrix(@matrix, first_char)
      index_second_char = find_element_in_matrix(@matrix, second_char)

      # Check if same row
      if index_first_char[0] == index_second_char[0]
        new_pair.concat(@matrix[index_first_char[0], (index_first_char[1] + 1) % 5])
        new_pair.concat(@matrix[index_second_char[0], (index_second_char[1] + 1) % 5])
      elsif index_first_char[1] == index_second_char[1]
        new_pair.concat(@matrix[(index_first_char[0] + 1) % 5, index_first_char[1]])
        new_pair.concat(@matrix[(index_second_char[0] + 1) % 5, index_second_char[1]])
      else
        new_pair.concat(@matrix[index_first_char[0], index_second_char[1]])
        new_pair.concat(@matrix[index_second_char[0], index_first_char[1]])
      end
      encrypted_text.concat(new_pair)
    end

    encrypted_text
  end

  def decrypt(pairs)
    decrypted_text = ""
    pairs.each do |pair|
      new_pair = ""
      first_char = pair[0]
      second_char = pair[1]

      index_first_char = find_element_in_matrix(@matrix, first_char)
      index_second_char = find_element_in_matrix(@matrix, second_char)

      # Check if same row
      if index_first_char[0] == index_second_char[0]
        new_pair.concat(@matrix[index_first_char[0], (index_first_char[1] - 1) % 5])
        new_pair.concat(@matrix[index_second_char[0], (index_second_char[1] - 1) % 5])
      elsif index_first_char[1] == index_second_char[1]
        new_pair.concat(@matrix[(index_first_char[0] - 1) % 5, index_first_char[1]])
        new_pair.concat(@matrix[(index_second_char[0] - 1) % 5, index_second_char[1]])
      else
        new_pair.concat(@matrix[index_first_char[0], index_second_char[1]])
        new_pair.concat(@matrix[index_second_char[0], index_first_char[1]])
      end
      decrypted_text.concat(new_pair)
    end

    decrypted_text
  end
end
