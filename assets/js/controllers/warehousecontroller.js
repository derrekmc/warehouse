Vue.http.options.emulateJSON = true; // send as

let warehouseController = new Vue({
  el: '#warehouseController',
  data: {
    debug: false,
    name: '',
    processing: false,
    items: [],
    status: "",
    id: null,
    error: null,
    warehouse: null,
    order: {},
    quantity: 0,
    upc: null,
    detail: null,
    inventory: [],
    response: {body:{}}
    
  },
  methods: {
    create: function (event) {
     
      this.processing = true;
     
      this.$http
        .post('/api/warehouse', {
          name: this.name
        })
        .then(function (data) {
          this.status = data.statusText;
          
          //this.items = data.body;
          this.processing = false;
          this.id = data.body.id;
          console.log("data.body.id", data.body.id)
        })
        .catch(function(data){
          this.id = 1;
          this.processing = false;
          console.error(data);
          if(data.body['code'] === "E_VALIDATION"){
            this.error = data.body.invalidAttributes['name'][0]['message'];
          }
        })
    },
    list: function (event) {

      this.processing = true;
      let url = '/api/warehouse/';
                 
      this.$http.get(url)
        .then(function (data) {
          console.log(data);
          this.status = data.statusText;
          this.items = data.body;
          this.processing = false;
        });
    },
  
    findOne: function (event) {
      this.warehouse = event.detail.warehouse;
      console.log("warehouseId",this.warehouse);
      this.processing = true;
      
      let url = '/api/warehouse/';
      if(this.warehouse) url += this.warehouse;
    
      this.$http.get(url)
        .then(function (data) {
          console.log(data);
          this.status = data.statusText;
          this.items = data.body.products;
          this.name = data.body.name;
          this.processing = false;
        });
    },
  
    getInventory: function (event) {
      this.warehouse = event.detail.warehouse;
      console.log("warehouseId",this.warehouse);
      this.processing = true;
      let url = '/api/warehouse/' + this.warehouse + '/quantity';
          
      this.$http.get(url)
        .then(function (data) {
          console.log(data);
          
          this.inventory = data.body;
          
          this.processing = false;
        });
    },
  
    addInventory: function (event) {
      
      console.log("warehouseId",this.warehouse);
      this.processing = true;
      let url = '/api/addInventory';
    
      this.$http.post(url,{
          upc: this.upc,
          warehouse: this.warehouse,
          quantity: this.quantity
        })
        .then(function (data) {
          console.log(data);
          this.status = data.statusText;
          this.items = data.body.products;
          this.name = data.body.name;
          this.processing = false;
        });
    },
  
    placeOrder: function (event) {
      var id = event.detail.id;
      
      this.processing = true;
      let url = '/api/placeOrder';
      
      this.$http.post(url,{
          products: this.items,
          warehouse: this.warehouse
        })
        .then(function (data) {
          console.log(data);
          this.status = data.statusText;
          this.items = data.body.products;
          this.name = data.body.name;
          this.processing = false;
          this.response = data;
          this.items = [{upc: null, quantity: 0},{upc: null, quantity: 0},{upc: null, quantity: 0}];
        })
        .catch(function(data){
          this.processing = false;
          console.error(data);
          this.error = data.body;
        })
    },
  
    openOrders: function (event) {
      this.warehouse = event.detail.warehouse;
      console.log("warehouseId",this.warehouse);
      this.processing = true;
      let url = '/api/order/?status=open';
      
      this.$http.get(url)
        .then(function (data) {
          console.log(data);
          this.status = data.statusText;
          this.items = data.body;
          this.name = data.body.name;
          this.processing = false;
        });
    },
  
    viewOrder: function (event) {
      this.warehouse = event.detail.warehouse;
      this.order = {
        id: event.detail.order
      }
      this.detail = event.detail;
      console.log("warehouseId",this.warehouse);
      this.processing = true;
      let url = '/api/order/';
      if(this.order) url += this.order.id;
      
      this.$http.get(url)
        .then(function (data) {
          console.log(data);
          this.order = data.body;
          this.status = data.statusText;
          this.items = data.body.products;
          this.name = data.body.name;
          this.processing = false;
        });
    },
  
    shipOrder: function (event) {
      //this.warehouse = event.detail.warehouse;
      // this.order = {
      //   id: event.detail.order
      // }
      //this.detail = event.detail;
      console.log("warehouseId",this.warehouse);
      this.processing = true;
      let url = '/api/order/' + this.order.id + '/shipOrder/';
      
    
      this.$http.post(url, {
          warehouse: this.warehouse
        })
        .then(function (data) {
          console.log(data);
          this.order = data.body;
          this.status = data.statusText;
          this.items = data.body.products;
          
          this.processing = false;
        });
    },
  
    params: function (event) {
      this.detail = event.detail;
      this.warehouse = event.detail.warehouse;
      this.items = event.detail.items;
      console.log("warehouseId",this.warehouse);
    }
    
  }
});

window.addEventListener('warehouse_list', warehouseController.list);
window.addEventListener('warehouse_findOne', warehouseController.findOne);
window.addEventListener('warehouse_params', warehouseController.params);
window.addEventListener('warehouse_viewOrder', warehouseController.viewOrder);
window.addEventListener('warehouse_openOrders', warehouseController.openOrders);
window.addEventListener('warehouse_getInventory', warehouseController.getInventory);
window.addEventListener('warehouse_addInventory', warehouseController.addInventory);
window.addEventListener('warehouse_placeOrder', warehouseController.placeOrder);
window.addEventListener('warehouse_create', warehouseController.create);
