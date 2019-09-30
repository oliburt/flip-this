class Layer < ApplicationRecord
  belongs_to :page
  has_one :animation
end
