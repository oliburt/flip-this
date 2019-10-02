class FlipbooksController < ApplicationController


    # def index
    #     render json: 
    # end

    def create
        flipbook = Flipbook.new(user_id: params[:user_id], flipbook_object: params[:flipbook_object])
        if flipbook.save
            render json: flipbook
        end
    end

end
