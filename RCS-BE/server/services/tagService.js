const {Tag, Taglist, Restaurant} = require('../models');

class tagService{
    async createTag(tagData){
        const {name} = tagData;
        const existingTag = await Tag.findOne({ where: { name } });
        if(existingTag){
            throw new Error('Tag already exists with this name');
        }

        const tag = await Tag.create(tagData);
        return tag;
    }

    async getAllTags(){
        const tags = await Tag.findAll({
            order: [['name', 'ASC']]
        });
        return tags;
    }
    
    async getTagById(tagId){
        const tag = await Tag.findByPk(tagId);
        if (!tag){
            throw new Error('Tag not found');
        }
        return tag;
    }

    async updateTag(tagId, updateData){
        const tag = await Tag.findByPk(tagId);
        if (!tag){
            throw new Error('Tag not found');
        }
        await tag.update(updateData);
        return tag;
    }

    async deleteTag(tagID){
        const tag=await Tag.findByPk(tagID);
        if (!tag){
            throw new Error('Tag not found');
        }
        await Taglist.destroy({
            where: { tag_id: tagID }
        });
        
        await tag.destroy();
        return { message: 'Tag deleted successfully' };
    }

    async assignTagToRestaurant(restaurantId, tagId, weight = 1.0){
        const restaurant = await Restaurant.findByPk(restaurantId);
        if (!restaurant){
            throw new Error('Restaurant not found');
        }
        const tag = await Tag.findByPk(tagId);
        if (!tag){
            throw new Error('Tag not found');
        }

        // Validate weight
        const parsedWeight = Number(weight);
        if (!Number.isFinite(parsedWeight) || parsedWeight < 0) {
            throw new Error('Weight must be a non-negative number');
        }

        const existingAssignment = await Taglist.findOne({
            where: { restaurant_id: restaurantId, tag_id: tagId }
        });
        if (existingAssignment){
            // Update weight instead of throwing error
            await existingAssignment.update({ weight: parsedWeight });
            return existingAssignment;
        }
        
        const taglist = await Taglist.create({
            restaurant_id: restaurantId,
            tag_id: tagId,
            weight: parsedWeight
        });
        return taglist;
    }

    async updateTagWeight(restaurantId, tagId, weight){
        // Validate weight
        const parsedWeight = Number(weight);
        if (!Number.isFinite(parsedWeight) || parsedWeight < 0) {
            throw new Error('Weight must be a non-negative number');
        }

        const taglist = await Taglist.findOne({
            where: { restaurant_id: restaurantId, tag_id: tagId }
        });
        if (!taglist){
            throw new Error('Tag is not assigned to this restaurant');
        }

        await taglist.update({ weight: parsedWeight });
        return taglist;
    }

    async getTagWeightForRestaurant(restaurantId, tagId){
    const taglist = await Taglist.findOne({
        where: { restaurant_id: restaurantId, tag_id: tagId },
        include: [
            {
                model: Tag,
                attributes: ['tag_id', 'name']
            },
            {
                model: Restaurant,
                attributes: ['restaurant_id', 'r_name']
            }
        ]
    });

    if (!taglist){
        throw new Error('Tag is not assigned to this restaurant');
    }

    return {
        restaurantId: taglist.restaurant_id,
        restaurant: taglist.Restaurant?.r_name,
        tagId: taglist.tag_id,
        tagName: taglist.Tag?.name,
        weight: taglist.weight
    };
}

    async removeTagFromRestaurant(restaurantId, tagId){
        const taglist = await Taglist.findOne({
            where:{restaurant_id: restaurantId, tag_id: tagId}
        });
        if (!taglist){
            throw new Error('Tag is not assigned to this restaurant');
        }
        await taglist.destroy();
        return { message: 'Tag removed from restaurant'};
    }

    async getRestaurantTags(restaurantId){
        const restaurant = await Restaurant.findByPk(restaurantId,{
            include:[{
                model: Tag,
                through: { attributes: ['weight'] }  // Include weight in response
            }]
        });

        if (!restaurant){
            throw new Error('Restaurant not found');
        }
        return restaurant.Tags;
    }

    async getRestaurantByTag(tagId){
        const tag = await Tag.findByPk(tagId,{
            include:[{
                model: Restaurant,
                through: { attributes: ['weight'] }  // Include weight in response
            }]
        });
        if (!tag){
            throw new Error('Tag not found');
        }
        return tag.Restaurants;
    }
}

module.exports = new tagService();