class FlipbooksController < ApplicationController

    def create
        flipbook = Flipbook.new(user_id: params[:user_id], flipbook_object: params[:flipbook_object])
        if flipbook.save
            render json: flipbook
        end
    end

    def update
        flipbook = Flipbook.find(params[:id])
        if flipbook.update(flipbook_object: params[:flipbook_object])
            render json: flipbook
        end
    end

    def destroy
        flipbook = Flipbook.find(params[:id])
        if flipbook
            flipbook.destroy
            render json: flipbook
        end
    end

end
