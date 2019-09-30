class Page < ApplicationRecord
  belongs_to :flipbook
  has_many :layers
end
