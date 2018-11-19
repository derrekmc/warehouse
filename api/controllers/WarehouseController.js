/**
 * WarehouseController
 *
 * @description :: Server-side logic for managing warehouses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	quantity: function (req, res) {
  
    // ES6 =/ -- Heroku production server needs an upgrade to ES6 falling back to es5 for now
    // let availableProducts = await Product.find(req.body.products);
    
    // Warehouse
    //   .findOne(req.params.warehouseId)
    //
    //   /**
    //    * Find the warehouse by id
    //    */
    //   .then(function(warehouse) {
    //     if (!warehouse) throw "Warehouse id not found: " + warehouse.id;
    //     sails.log.verbose("Warehouse:", warehouse);
    //     return warehouse;
    //   })
    //
    //   /**
    //    * Loop through products and check if the quantity is available
    //    */
    //   .then(function(warehouse) {
    //
    //     sails.log.verbose("warehouse:", warehouse.products);
    //     return Product
    //       .find({
    //         warehouse: warehouse.id,
    //       })
    //       .then(function (inventory) {
    //         // todo map products by upc then run reduce
    //
    //         function available(count, product, i){
    //           if(typeof count == "object") count = 0;
    //           return count + (product.status == "available" ? 1 : 0);
    //         }
    //
    //         function reserved(count, product, i){
    //           if(typeof count == "object") count = 0;
    //           return count + (product.status == "reserved" ? 1 : 0);
    //         }
    //
    //         var available = inventory.reduce(available);
    //         var reserved = inventory.reduce(reserved);
    //
    //
    //         return {
    //           available: available,
    //           reserved: reserved
    //         };
    //       })
    //   })
    //
    //   /**
    //    * Respond to request
    //    */
    //   .then(function(response){
    //     res.ok(response);
    //   })
    //
    //   /**
    //    * Catch any errors and respond with a bad request
    //    */
    //   .catch(res.badRequest);
    
    /**
     * Aggregate data based on upcs and status
     * Decided to go the simple route. The above code would be what we would use for production because its faster but more work.
     */
    const payload = {
      warehouseId: req.param("warehouse")
    };
    
    sails.request('get /api/warehouse/' + payload.warehouseId, function (err, warehouseData) {
      if(err) {
        return res.badRequest("Warehouse Error: " + err.message);
      }
      
      sails.request('get /api/product/count?where={"warehouse":"' + payload.warehouseId + '"}&groupBy=["upc", "status"]', function (err, data) {
        if(err) {
          return res.badRequest("Warehouse Error: " + err.message);
        }
        
        let result = [];
        for(let item in data.body[0]){
          let items = item.split(",");
          result.push({
            upc: items[0],
            status: items[1],
            count: data.body[0][item]
          });
      
        }
        result.warehouse = warehouseData
        
        res.ok(result);
      });
    });
    
    
    
  }
};

