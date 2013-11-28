Meteor.publish("directory", function () {
  if(this.userId)
      return Meteor.users.find({}, {fields: {emails: 1, username: 1, 'profile' : 1}});
  else
     return null; 
});

Meteor.publish("cartItems", function () {
  if(this.userId)
    return CartItems.find();
  else
     return null; 
});

Meteor.publish('products', function() { 
  if(this.userId)
	   return Products.find();
  else
     return null; 
});

Meteor.publish('books', function() { 
  if(this.userId)
	   return Books.find();
  else
     return null;  
});

Meteor.publish('vehicles_category', function() { 
  if(this.userId)
	   return VehiclesCategory.find();
  else
     return null; 
});

Meteor.publish('boats', function() {
  if(this.userId)
  return Boats.find();
else
     return null; 
});

Meteor.publish('trips', function() {
  if(this.userId)
    return Trips.find();
  else
     return null; 
});

Meteor.publish('vehicles', function() {
  if(this.userId)
	   return Vehicles.find();
  else
     return null; 
});

Meteor.publish('loggedUsers', function() {
  if(this.userId)
    return LoggedUsers.find();
  else
     return null; 
});

Meteor.publish('customers', function(){
  if(this.userId)
    return Customers.find();
  else
    return null; 
});

Meteor.publish('notes', function(){
  if(this.userId)
    return Notes.find();
  else
    return null; 
});

Meteor.publish('mails', function(){
  if(this.userId)
    return Mails.find();
  else
     return null; 
});

Meteor.publish('countries', function() {
  if(this.userId)
    return Countries.find();
  else
     return null; 
});

Meteor.publish('transactions', function() {
  if(this.userId)
    return Transactions.find();
  else
     return null; 
});

Meteor.publish('groups', function() {
  if(this.userId)
      return Groups.find();
  else
      return null; 
});

Meteor.publish('saveTrip', function(trip) {
  if(this.userId){
    if(trip._id)
      Trips.update(trip._id, trip);
    else
      Trips.insert(trip);
  }else{
    return null;
  }
})

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


  generateQRCode: function(id){
    var qr = qrcode(4, 'M');
    qr.addData(id);
    qr.make();
    var tag = qr.createImgTag(4);
    return tag ;
  },

  generateQRCodeGIF: function(id){
    var qr = qrcode(4, 'M');
    qr.addData(id);
    qr.make();
    var gif = qr.createGif(4);
    return gif ;
  },

  saveQRCode: function(blob, name) {
    var fs = __meteor_bootstrap__.require('fs'), encoding ='binary';
    // Clean up the path. Remove any initial and final '/' -we prefix them-,
    // any sort of attempt to go to the parent directory '..' and any empty directories in
    // between '/////' - which may happen after removing '..'
    name = 'public/images/qrcodes/' + name + '.gif' ;
    
    // TODO Add file existance checks, etc...
    fs.writeFile(name, blob, encoding, function(err) {
      if (err) {
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      } else {
        console.log('The file was saved to ' + name);
      }
    }); 
 
    function cleanPath(str) {
      if (str) {
        return str.replace(/\.\./g,'').replace(/\/+/g,'').
          replace(/^\/+/,'').replace(/\/+$/,'');
      }
    }
    function cleanName(str) {
      return str.replace(/\.\./g,'').replace(/\//g,'');
    }
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

  getBookByDateRange: function(dateFrom, dateTo, product, paymentStatus, bookStatus){
    var query = {dateOfBooking: {$gte: dateFrom, $lt: dateTo}};

    if(product) 
      query['product._id'] = product;

    if(paymentStatus)
      query['paid'] = (paymentStatus === '0') ? false : true;

    if(bookStatus)
      query['bookStatus'] = bookStatus;
    return Books.find(query).fetch();

  },

  //getBookByQuery: function(query){
  //  return  Books.find(query).fetch();
  //},
 

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

  updateTrip: function(trip){
    Trips.update(trip._id, trip);
  },

  deleteTripById: function(id){
    Trips.remove(id);
  },

//Mails

  getMailByCustomerId: function(_customerId){
    return Mails.find({customerId: _customerId}).fetch();
  },

  getMailByNoteId: function(noteId){
    var note = Notes.findOne({_id: noteId});
    var customerId = Books.findOne({_id: Session.get('bookId')}).customerId;
    return Customers.findOne({_id: customerId}).email;

  },

  createMail: function(mail){
    Mails.insert(mail);
  },

//Notes
  
  getNoteById: function(noteId){
    return Notes.findOne(noteId);
  },

  getNotesByBookingId: function(bookingId){
    return Notes.find({bookId : bookingId}).fetch();
  },

  createNote: function(note){
    Notes.insert(note);
  }

});