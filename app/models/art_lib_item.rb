class ArtLibItem < ApplicationRecord
  belongs_to :art
  belongs_to :user
end
