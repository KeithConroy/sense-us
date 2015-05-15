class CreateResults < ActiveRecord::Migration
  def change
    create_table :results do |t|
      t.integer :user_id
      t.integer :estimate_id
      t.string :state
      t.string :births
      t.string :deaths
      t.string :pop

      t.timestamp
    end
  end
end
