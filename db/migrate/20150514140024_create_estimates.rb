class CreateEstimates < ActiveRecord::Migration
  def change
    create_table :estimates do |t|
      t.text :date

      t.timestamp
    end
  end
end
