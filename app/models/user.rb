require 'bcrypt'

class User < ActiveRecord::Base
  has_many :results

  validates_presence_of :user_name, :password_hash
  validates_uniqueness_of :user_name

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
