class CreateAnimations < ActiveRecord::Migration[6.0]
  def change
    create_table :animations do |t|
      t.references :layer, null: false, foreign_key: true
      t.string :type

      t.timestamps
    end
  end
end
