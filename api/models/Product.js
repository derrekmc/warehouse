/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    upc:{
      type: "string",
      required: true
    },
  
    status: {
      type: "string",
      enum: ["available","reserved","shipped"],
      defaultsTo: "available"
    },
  
    warehouse: {
      model: "warehouse"
    },
  
    order: {
      model: "order"
    }
  }
  
};

