class Result < ActiveRecord::Base
  # Remember to create a migration!

  belongs_to :user
  belongs_to :estimate

  validates_presence_of :user_id
end
