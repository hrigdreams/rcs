const User = require('./User');
const Restaurant = require('./Restaurant');
const Like = require('./Like');
const Favourite = require('./Favourite');
const Tag = require('./Tag');
const Taglist = require('./Taglist');
const Booking = require('./Booking');
const Coldstart = require('./Coldstart');

//associations defined here in index.js

User.belongsToMany(Restaurant, { through: Like, foreignKey: 'user_id' });
Restaurant.belongsToMany(User, { through: Like, foreignKey: 'restaurant_id' });

User.belongsToMany(Restaurant, { through: Favourite, foreignKey: 'user_id', as: 'FavouriteRestaurants' });
Restaurant.belongsToMany(User, { through: Favourite, foreignKey: 'restaurant_id', as: 'FavouritedBy' });

Restaurant.belongsToMany(Tag, { through: Taglist, foreignKey: 'restaurant_id' });
Tag.belongsToMany(Restaurant, { through: Taglist, foreignKey: 'tag_id' });

User.hasMany(Booking,{foreignKey:'user_id'});
Booking.belongsTo(User,{foreignKey:'user_id'});

Restaurant.hasMany(Booking,{foreignKey:'restaurant_id'});
Booking.belongsTo(Restaurant,{foreignKey:'restaurant_id'});

User.belongsToMany(Tag, { through: Coldstart, foreignKey: 'user_id' });
Tag.belongsToMany(User, { through: Coldstart, foreignKey: 'tag_id' });

module.exports = {
  User,
  Restaurant,
  Like,
  Favourite,
  Tag,
  Taglist,
  Booking,
  Coldstart
};