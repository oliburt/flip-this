class FlipbooksController < ApplicationController

    def create
        flipbook = Flipbook.new(user_id: params[:user_id], flipbook_object: params[:flipbook_object])
        if flipbook.save
            render json: flipbook
        end
    end

end
