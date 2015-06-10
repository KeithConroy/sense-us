class Estimate < ActiveRecord::Base
  # Remember to create a migration!
  has_many :results
end

