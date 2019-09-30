class CreateAttributes < ActiveRecord::Migration[6.0]
  def change
    create_table :attributes do |t|
      t.references :animation, null: false, foreign_key: true
      t.string :value
      t.string :type

      t.timestamps
    end
  end
end
