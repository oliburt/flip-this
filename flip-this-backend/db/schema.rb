# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_09_30_121208) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "animations", force: :cascade do |t|
    t.bigint "layer_id", null: false
    t.string "type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["layer_id"], name: "index_animations_on_layer_id"
  end

  create_table "attributes", force: :cascade do |t|
    t.bigint "animation_id", null: false
    t.string "value"
    t.string "type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["animation_id"], name: "index_attributes_on_animation_id"
  end

  create_table "flipbooks", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "title"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_flipbooks_on_user_id"
  end

  create_table "layers", force: :cascade do |t|
    t.bigint "page_id", null: false
    t.string "drawing"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["page_id"], name: "index_layers_on_page_id"
  end

  create_table "pages", force: :cascade do |t|
    t.bigint "flipbook_id", null: false
    t.integer "page_num"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["flipbook_id"], name: "index_pages_on_flipbook_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "animations", "layers"
  add_foreign_key "attributes", "animations"
  add_foreign_key "flipbooks", "users"
  add_foreign_key "layers", "pages"
  add_foreign_key "pages", "flipbooks"
end
