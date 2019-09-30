class Animation < ApplicationRecord
  belongs_to :layer
  has_many :attributes
end
