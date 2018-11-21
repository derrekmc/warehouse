/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Promise = require('bluebird').Promise;

module.exports = {
  
  /**
   * @placeOrder
   * INPUT:
   *  - [UPC,QTY]
   *  - WAREHOUSE ID
   *
   * OUTPUT:
   *  Products added to order
   *  Each Product status changed from available to reserved
   *  Order Id returned
   *  Order status is pending
   *
   * SUDO:
   * // Check if the warehouse is valid
   * // Check availability for each product
   *  count /products?where={status:available, upc}
   *  if(res.count >= qty ) {
     *  forEach upc
     *    for i < qty
     *    put /products {status: reserved}
     *  }else{
     *    res.badRequest("quantity requested unavailable")
     *  }
   * v2 --------------------------------------------------
   *
   * count /products?where={status:available}
   *  if(qty < count) {
     *
     * // Attempt to reserve
     *
     *  request /products?status=reserved&limit=qty
     *  if res >= qty
     *  res.ok()
     *  else
     *  res.forEach((product) => {
     *    request ("/product?id=" + product.id, {status: "available"})
     *    .then(res.badRequest("products quantity not available"))
     *  })
     *
     */
  placeOrder: function (req, res) {
    
    // ES6 =/ -- Heroku production server needs an upgrade to ES6 falling back to es5 for now
    // let availableProducts = await Product.find(req.body.products);
    req.body.products = req.body.products.filter(function(element){
      return element.upc
    });
    Warehouse
      .findOne(req.body.warehouse)
      
      /**
       * Check if the warehouse id is valid before doing anything else
       */
      .then(function(warehouse) {
        if (!warehouse) throw "Warehouse id not found: " + req.body.warehouse;
        sails.log.verbose("Warehouse:", warehouse);
        return warehouse;
      })
      
      /**
       * Loop through products and check if the quantity is available
       */
      .then(function(warehouse) {
        return Promise.each(req.body.products, function (product) {
            sails.log.verbose("Product:", product);
            
            return Product
              .count({
                upc: product.upc,
                status: "available",
                warehouse: req.body.warehouse
              })
              .limit(product.quantity)
              .then(function (count) {
                if (count < product.quantity) throw "Quantity of " + product.quantity + " unavailable for UPC. " + product.upc + " only " + count + " available";
                sails.log.verbose("Product Found and Available:", count, product.quantity);
                return count;
              })
          })
          
          /**
           * Loop through products and set available orders to reserved
           */
          .then(function() {
            
            return Promise.each(req.body.products, function (product) {
              sails.log.verbose("Product:", product);
              return Product
                .find({
                  upc: product.upc,
                  status: "available",
                  warehouse: req.body.warehouse
                })
                .limit(product.quantity)
                .then(function (products) {
                  return Promise.map(products, function(p) {
                    return Product
                      .update({
                          id: p.id
                        },
                        {
                          status: "reserved"
                        })
                      .then(function (p) {
                        sails.log.info(p);
                        return p[0]
                      })
                    })
  
                    /**
                     * Create an order
                     */
                    .then(function(products){
                      sails.log.info("products", products);
                      return Order.create({
                        products: products
                      })
                    })


                    /**
                     * Respond to request
                     */
                    .then(function(order){
                      sails.log.verbose("Order:", order);
                      res.ok(order);
                    })
  

                    
                  
                  
                })
            })
            
            
          })
          
          
          
          
        
        
      })
      
      /**
       * Catch any errors and respond with a bad request
       */
      .catch(res.badRequest);
    
  },
  
  shipOrder: function(req, res){
    
    const payload = {
      orderId: req.param("orderId")
    };
    
    Product
      .update(
        {order: payload.orderId},
        {status: "shipped"})
      .then(function (products) {
        sails.log.verbose("Products:", products);
        return Order.update({id: payload.orderId}, {status: "shipped"})
      })
      .then(function(result){
        return Order
          .findOne({id: payload.orderId}, {status: "shipped"})
          .populate("products")
        
      })
      .then(function(result){
        return res.ok(result);
      })
      /**
       * Catch any errors and respond with a bad request
       */
      .catch(res.badRequest);
    
    
    // sails.request('put /api/order/' + payload.orderId, {status:"shipped"}, function (err, data) {
    //   if(err) {
    //     return res.badRequest("Order shipping error: " + err.message);
    //   }
    //   sails.request('put /api/product/?where={"order":"' + payload.orderId + '"}', {status:"shipped"}, function (err, data) {
    //     if(err) {
    //       return res.badRequest("Order products shipping error: " + err.message);
    //     }
    //     sails.request('get /api/order/' + payload.orderId, function (err, data) {
    //       if(err) {
    //         return res.badRequest("Couldnt get order error: " + err.message);
    //       }
    //       res.ok(data);
    //     });
    //   });
    // });
  }
};

