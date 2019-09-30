class CreateFlipbooks < ActiveRecord::Migration[6.0]
  def change
    create_table :flipbooks do |t|
      t.references :user, null: false, foreign_key: true
      t.string :title

      t.timestamps
    end
  end
end
