require 'bcrypt'

class User < ActiveRecord::Base
  has_many :todos

  validates_presence_of :user_name
  validates_uniqueness_of :user_name
  validates_presence_of :password_hash, :message => 'Password cannot be blank'

  def password
    @password ||= BCrypt::Password.new(password_hash) if password_hash
  end

  def password=(new_password)
    if new_password == ''
      self.password_hash = new_password
    else
      @password = BCrypt::Password.create(new_password)
      self.password_hash = @password
    end
  end

end
