class CreateAudComments < ActiveRecord::Migration[7.0]
  def change
    create_table :aud_comments do |t|
      t.belongs_to :audio, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.text :content

      t.timestamps
    end
  end
end
