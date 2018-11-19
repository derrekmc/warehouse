/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    status:{
      type:"string",
      enum:['open', 'shipped'],
      defaultsTo: "open"
    },
    
    products:{
      collection: "product",
      via: "order"
    },
    
    warehouse: {
      model: "warehouse"
    }
    
  }
};

