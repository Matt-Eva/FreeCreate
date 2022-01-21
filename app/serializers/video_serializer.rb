class VideoSerializer < ActiveModel::Serializer
  attributes :id, :thumbnail, :content, :title
  has_one :creator
  has_many :vid_taglinks
end
