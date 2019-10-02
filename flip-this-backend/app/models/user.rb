class User < ApplicationRecord
    has_many :flipbooks
    validates :username, presence: true
    validates :username, uniqueness: true
end
