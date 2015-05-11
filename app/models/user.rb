require 'bcrypt'

class User < ActiveRecord::Base
  has_many :todos

  validates_presence_of :user_name, :password_hash

  def password
    @password ||= BCrypt::Password.new(password_hash) if password_hash
  end

  def password=(new_password)
    @password = BCrypt::Password.create(new_password)
    self.password_hash = @password
  end

end
