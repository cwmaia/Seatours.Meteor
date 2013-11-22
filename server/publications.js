//Meteor.publish('products', function() { 
//	return Products.find();
//});

Meteor.publish('books', function() { 
	return Books.find();
});

//Meteor.publish('vehicles_category', function() { 
//	return VehiclesCategory.find();
//});

//Meteor.publish('boats', function() {
//  return Boats.find();
//});

Meteor.publish('trips', function() {
  return Trips.find();
});

//Meteor.publish('vehicles', function() {
//	return Vehicles.find();
//});

Meteor.publish('loggedUsers', function() {
	return LoggedUsers.find();
});

//Meteor.publish('customers', function(){
//	return Customers.find();
//});

Meteor.publish('notes', function(){
  return Notes.find();
});

Meteor.publish('mails', function(){
  return Mails.find();
});

Meteor.publish('countries', function() {
  return Countries.find();
});

Meteor.publish('transactions', function() {
  return Transactions.find();
});

// In your server code: define a method that the client can call
Meteor.methods({
  sendEmail: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      text: text
    });
  },

  sendEmailHTML: function (to, from, subject, text) {
    check([to, from, subject, text], [String]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    Email.send({
      to: to,
      from: from,
      subject: subject,
      html: text
    });
  },

  /////////////////////////////////////////////////////////
  //Insert and get for all collections
  //Boats
  getBoats: function(){    
    return Boats.find().fetch();
  },

  getBoatById: function(boatId){
    return Boats.findOne(boatId);
  },

  createBoat: function(boat){
    Boats.insert(boat);
  },

  updateBoat: function(boatId, boat){
    Boats.update(boatId, boat);
  },

  //Books
  getBooks: function(){    
    return Books.find().fetch();
  },

  getBookById: function(bookId){
    return Books.findOne(bookId);
  },

  createBook: function(book){
    Books.insert(book);
  },

  updateBook: function(bookId, book){
    Boats.update(bookId, book);
  },

  //Products
  getProducts: function(){    
    return Products.find().fetch();
  },

  getProductById: function(productId){
    return Products.findOne(productId);
  },

  createProduct: function(product){
    Products.insert(product);
  },

  updateProduct: function(productId, product){
    Products.update(productId, product);
  },

  //Customers
  getCustomers: function(){    
    return Customers.find().fetch();
  },

  getCustomerById: function(customerId){
    return Customers.findOne(customerId);
  },

  createCustomer: function(customer){
    Customers.insert(customer);
  },

  updateCustomer: function(customerId, customer){
    Customers.update(customerId, customer);
  },

//Vehicles
  getVehicles: function(){    
    return Vehicles.find().fetch();
  },

  getVehicleById: function(vehicleId){
    return Vehicles.findOne(vehicleId);
  },

  createVehicle: function(vehicle){
    Vehicles.insert(vehicle);
  },

  updateVehicle: function(vehicleId, vehicle){
    Vehicles.update(vehicleId, vehicle);
  },


  //VehiclesCategory
  getVehiclesCategories: function(){    
    return VehiclesCategory.find().fetch();
  },

  getVehiclesCategoryById: function(vehiclesCategoryId){
    return VehiclesCategory.findOne(vehiclesCategoryId);
  },

  createVehiclesCategory: function(vehiclesCategory){
    VehiclesCategory.insert(vehiclesCategory);
  },

  updateVehiclesCategory: function(vehiclesCategoryId, vehiclesCategory){
    VehiclesCategory.update(vehiclesCategoryId, vehiclesCategory);
  },

//Trips
  getTrips: function(){    
    return Trips.find().fetch();
  },

  getTripById: function(tripId){
    return Trips.findOne(tripId);
  },

  createTrip: function(trip){
    Trips.insert(trip);
  },

  updateTrip: function(tripId, trip){
    Trips.update(tripId, trip);
  },

  deleteTripById: function(id){
    Trips.remove(id);
  }


});