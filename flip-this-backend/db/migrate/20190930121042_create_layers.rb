class CreateLayers < ActiveRecord::Migration[6.0]
  def change
    create_table :layers do |t|
      t.references :page, null: false, foreign_key: true
      t.string :drawing

      t.timestamps
    end
  end
end
