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
          return Books.find({customerId : user.profile.customerId});
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
    var customerId = Customers.insert(userData);
    user.profile = {'groupID': group._id, 'name' : userData.fullName, 'customerId' : customerId};
    Accounts.createUser(user);
  },

  createGroup : function(group){
    Groups.insert(group);
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