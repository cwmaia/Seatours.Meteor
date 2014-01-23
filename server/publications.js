Meteor.Router.add("/ReturnPageSuccess", "POST", function(){
  orderId = this.request.body.orderid;

  books = Books.find({orderId : orderId}).fetch();
  order = Orders.findOne({refNumber : orderId});

  Orders.update(order._id, {$set: {paid : true}});

  for (var i = 0; i < books.length; i++) {
    Books.update(books[i]._id, {$set : {paid : true, bookStatus : "Created"}});
    var transaction = {
      'bookId' : books[i]._id,
      'date' : new Date(),
      'status' : 'Borgun Completed',
      'amount' : books[i].totalISK,
      'detail' : 10+"% as discount",
      'vendor' : "Borgun",
      'type' : 'Credit Card'
    }
    Transactions.insert(transaction);
  };

  //do something with this
  return [204, "No Content"];
})

Meteor.Router.add("/ReturnPageError", "POST", function(){
  console.log(this.request.body);
})

Meteor.publish("directory", function () {
  if(this.userId)
      return Meteor.users.find({}, {fields: {emails: 1, username: 1, 'profile' : 1}});
  else
     return null; 
});

Meteor.publish('cbasket', function(){
    return CBasket.find();
})

Meteor.publish("inquiries", function () {
  if(this.userId)
      return Inquiries.find();
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
	   return Products.find();
});

Meteor.publish('books', function() { 
  if(this.userId){
     user = Meteor.users.findOne({_id : this.userId});
     group = Groups.findOne({name : 'Customers'});
     if(user.profile.groupID == group._id){
        if(user.profile.customerId){
          return Books.find({buyerId : customerId});
        }else{
          return null;
        }
     }else{
        return Books.find();
     }
  }else{
    return Books.find({}, {fields: {dateOfBooking: 1, 'trip._id': 1, 'bookStatus' : 1, 'vehicle.extraSlot' : 1, 'product._id' : 1, 'vehicle.size' : 1}});
  }
});


Meteor.publish('orders', function() { 
  if(this.userId){
     user = Meteor.users.findOne({_id : this.userId});
     group = Groups.findOne({name : 'Customers'});
     if(user.profile.groupID == group._id){
        if(user.profile.customerId){
          return Orders.find({customerId : user.profile.customerId});
        }else{
          return null;
        }
     }else{
        return Books.find();
     }
  }else{
    return null;
  }
});

Meteor.publish('vehicles_category', function() { 
	   return VehiclesCategory.find();
});

Meteor.publish('boats', function() {
  if(this.userId)
    return Boats.find();
  else
     return null; 
});

Meteor.publish('trips', function() {
    return Trips.find();
});

Meteor.publish('vehicles', function() {
	   return Vehicles.find();
});

Meteor.publish('loggedUsers', function() {
  if(this.userId)
    return LoggedUsers.find();
  else
     return null; 
});

Meteor.publish('customers', function(){
    return Customers.find();
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

Meteor.publish('postcodes', function() {
      return PostCodes.find();
});

Meteor.publish('prices', function() {
      return Prices.find();
});

Meteor.publish('blockingDates', function() {
  return BlockingDates.find();
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
});

Meteor.publish("settings", function () {
    return Settings.find();
});

var isCustomer = function(userId){
  if(Meteor.users.findOne({'_id' : userId}).profile.customerId){
    return true;
  }
  return false;
}

var getCustomerId = function(userId){
  return Meteor.users.findOne({'_id' : userId}).profile.customerId;
}

var saveQRCode = function(blob, name) {
    var fs = Npm.require('fs'), encoding ='binary';
    var nameAndPath = '../../../../../public/images/qrcodes/' + name + '.gif' ;
    var base64 = blob;
   // fs.writeFile(nameAndPath, base64, 'base64', function(err) {
    //  if (err) {
     //     console.log(err);  
      //  } 
    //});
    return false;
}

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

  createAccount: function(user){
    Accounts.createUser(user);
  },

  createExternalAccount: function(user, userData){
    group = Groups.findOne({"name": "Customers"});
    
    user.profile = {'groupID': group._id, 'name' : userData.fullName};
    var userId = Accounts.createUser(user);

    var customerId = Customers.insert(userData);
    
    Meteor.users.update(userId, {$set :{ "profile.customerId" : customerId}})

    return customerId;
  },

  createGroup : function(group){
    Groups.insert(group);
  },

  saveCustomerBooks : function(books){
    for (var i = 0; i < books.length; i++) {
        books.temp = true;
        Book.insert(books[i]);
    };

  },

  insertBook : function(book){
    return Books.insert(book);
  },

  insertOnCBasket : function(book){
    return CBasket.insert(book);
  },

  insertInquiries : function(book){
    return Inquiries.insert(book);
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
    saveQRCode(gif,""+id)
  },

  getBookById: function(bookId){
    return Books.findOne(bookId);
  },

  getCustomerById: function(customerId){
    return Customers.findOne(customerId);
  },
  
  getAllCars : function(){
    return Cars.find().fetch();
  }

});