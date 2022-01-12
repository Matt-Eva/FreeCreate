class CreateSingleDonations < ActiveRecord::Migration[7.0]
  def change
    create_table :single_donations do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :creator, null: false, foreign_key: true
      t.float :amount

      t.timestamps
    end
  end
end
