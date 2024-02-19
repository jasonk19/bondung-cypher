require "matrix"

class Api::Cipher::HillController < ApplicationController
  def create
    unless params[:mode] == "encrypt" or params[:mode] == "decrypt"
      render json: { message: "Invalid mode" }, status: :unprocessable_entity
    end

    matrix = params[:matrix]

    if params[:mode] == "encrypt"
      encrypted_text = encrypt(text, matrix)
      render json: { result: encrypted_text }, status: :ok
    elsif params[:mode] == "decrypt"
      decrypted_text = decrypt(text, matrix)
      render json: { result: decrypted_text }, status: :ok
    end
  end

  private

  def encrypt(text, matrix)
    return "Hello"
  end

  def decrypt(text, matrix)
    return "hello"
  end

end