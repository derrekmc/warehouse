/**
 * InventoryController
 *
 * @description :: Server-side logic for managing inventories
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  
  /**
   * @addInventory
   * INPUT:
   *  - UPC
   *  - QUANTITY
   *  - WAREHOUSE ID
   *
   * OUTPUT:
   * Products added to warehouse
   *
   * SUDO:
   * for i < qty
   * post /products {upc, warehouseId}
   *
   */
  addInventory: function (req, res) {
    
    /**
     * Strip out any unwanted data DTO - we can do this by enforcing strict schema also
     * @type {{upc: number, warehouse: *, quantity: *}}
     */
    const payload = {
      upc: req.param("upc") | "",
      warehouse: req.param("warehouse")
    };

    //const payload = req.body;
    /**
     * Check if warehouse exists
     */
    sails.request("get /api/warehouse/" + payload.warehouse, function (err, data) {
      if(err) {
        return res.badRequest("Warehouse Error: " + err.message);
      }
  
      /**
       * Loop through and add products to warehouse
       */
      for(var i=0; i < req.param("quantity"); i++) {
        sails.request("post /api/product", payload, function (err, data) {
          if(err) {
            return res.badRequest(err);
          }
        });
        res.ok();
      }
    
    });
      
  },
  
  getInventory: function (req, res) {
    /**
     * INPUT:
     *  - WAREHOUSE_ID
     *
     * OUTPUT:
     * Quantity of each product in the warehouse
     * Status of each product in the warehouse Available/Reserved
     *
     * SUDO:
     * count /product?where={status:"reserved","warehouse": WAREHOUSE_ID}
     * count /product?where={status:"available","warehouse": WAREHOUSE_ID}
     * or
     * /aggregate/count /product?where={"warehouse": WAREHOUSE_ID}, groupBy=status, sum=quantity
     */
    
  }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  // index: function findRecords (req, res) {
  //
  //   // Lookup for records that match the specified criteria
  //   var query = Product.find({});
  //
  //     query.exec(function found(err, matchingRecords) {
  //       if (err) return res.serverError(err);
  //
  //       // Only `.watch()` for new instances of the model if
  //       // `autoWatch` is enabled.
  //       if (req._sails.hooks.pubsub && req.isSocket) {
  //
  //         Model.subscribe(req, matchingRecords);
  //
  //         if (req.options.autoWatch) {
  //           Model.watch(req);
  //         }
  //         // Also subscribe to instances of all associated models
  //         _.each(matchingRecords, function (record) {
  //           actionUtil.subscribeDeep(req, record);
  //         });
  //       }
  //
  //
  //       res.view('products', {
  //         locals: matchingRecords[0]
  //       });
  //
  //     });
  //
  // },
  //
  // create: function findRecords (req, res) {
  //
  //   // Lookup for records that match the specified criteria
  //   var query = Product.find({});
  //
  //   query.exec(function found(err, matchingRecords) {
  //     if (err) return res.serverError(err);
  //
  //     // Only `.watch()` for new instances of the model if
  //     // `autoWatch` is enabled.
  //     if (req._sails.hooks.pubsub && req.isSocket) {
  //
  //       Model.subscribe(req, matchingRecords);
  //
  //       if (req.options.autoWatch) {
  //         Model.watch(req);
  //       }
  //       // Also subscribe to instances of all associated models
  //       _.each(matchingRecords, function (record) {
  //         actionUtil.subscribeDeep(req, record);
  //       });
  //     }
  //
  //
  //     res.view('inventory/create', {
  //       locals: matchingRecords[0]
  //     });
  //
  //   });
  //
  // },
};

