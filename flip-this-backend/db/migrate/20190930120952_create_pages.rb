class CreatePages < ActiveRecord::Migration[6.0]
  def change
    create_table :pages do |t|
      t.references :flipbook, null: false, foreign_key: true
      t.integer :page_num

      t.timestamps
    end
  end
end
