Meteor.Router.add("/ReturnPageSuccess", "POST", function(){
  orderId = this.request.body.orderid;

  books = Books.find({orderId : orderId}).fetch();
  order = Orders.findOne({refNumber : orderId});

  Orders.update(order._id, {$set: {paid : true}});

  for (var i = 0; i < books.length; i++) {
    Books.update(books[i]._id, {$set : {paid : true, bookStatus : "Booked"}});
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



  //talvez escrever todo o html... eh... talve. tem que ver se funciona....

  return "<script>window.location='http://booking.seatours.is/listvouchers/"+orderId+"'</script>";

})

var removeOldBookings = function(){
  console.log("Checking Old Books...")
  var date = new Date();
  books = Books.find({pendingApproval: true}).fetch();
  for (var i = books.length - 1; i >= 0; i--) {
    var elapsedTime = date.getTime() - books[i].creationDate.getTime();
    if(elapsedTime >= 86400000){
      Books.update(books[i]._id, {$set: {bookStatus: "Canceled Due Time Limit", pendingApproval : false}});
      console.log("Change Status/Pending Approval Notifier: "+ books[i]._id)
    }
  };
}

Meteor.setInterval(function(){removeOldBookings()}, 230000)

Meteor.Router.add("/ReturnPageError", "POST", function(){
  console.log(this.request.body);
  return "<script>window.location='http://booking.seatours.is</script>";
})


Meteor.publish('boatStatus', function(){
  return BoatStatus.find();
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
    return CartItems.find();
});

Meteor.publish('products', function() {
	   return Products.find({}, { sort : {name : 1}});
});

Meteor.publish('books', function() {
  if(this.userId){
    user = Meteor.users.findOne({_id : this.userId});
    if(user.profile.groupID){
      return Books.find();
    }else{
      return Books.find();
    }
  }else{
    return Books.find({}, {fields: {
      paid : 1 ,
      refNumber : 1,
      dateOfBooking: 1,
      'trip._id': 1,
      'trip.to': 1,
      'trip.from': 1,
      'trip.hour': 1,
      'bookStatus' : 1,
      'vehicle.totalCost' : 1,
      'vehicle.category' : 1,
      'slot' : 1,
      'product._id' : 1,
      'product.name':1,
      orderId : 1,
      totalISK:1,'vehicle.size' : 1,
      prices : 1}});
  }
});

Meteor.publish('initials', function(){
  return Initials.find();
});

Meteor.publish('historyBook', function(){
  return HistoryBook.find();
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
        return Orders.find();
     }
  }else{
    return null;
  }
});

Meteor.publish('vehicles_category', function() {
	   return VehiclesCategory.find();
});

Meteor.publish('boats', function() {
    return Boats.find();
});

Meteor.publish('trips', function() {
    return Trips.find({}, { sort : {hour : -1}});
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
    return Groups.find();
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
    var nameAndPath = 'http://booking.seatours.is/images/qrcodes/' + name + '.gif' ;
    var base64 = blob;
    fs.writeFile(nameAndPath, base64, 'base64', function(err) {
      if (err) {
          console.log(err);
        }
    });
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

  checkVerified : function(email){
    user = Meteor.users.findOne({username : email});
    if(user){
       if(user.emails[0].verified){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }

  },

  createAccount: function(user){
    Accounts.createUser(user);
  },

  removeAccount: function(id){
    Meteor.users.remove(id);
  },

  createExternalAccount: function(user, userData){
    var customerId = 0;

    user.profile = {name : userData.fullName};

    var userId = Accounts.createUser(user);

    customer = Customers.findOne({socialSecurityNumber : userData.socialSecurityNumber});

    if(!customer)
      customerId = Customers.insert(userData);
    else
      customerId = customer._id;

    Meteor.users.update(userId, {$set :{ "profile.customerId" : customerId, "profile.groupID" : userData.groupId}})

    return customerId;
  },

  createGroup : function(group){
    Groups.insert(group);
  },

  checkRestrictions : function(dates, productId, tripId, bookStatus){
    books = Books.find({
      dateOfBooking   : {$gte: dates.selectedDay, $lt: dates.nextDay},
      'product._id'   : productId,
      'trip._id'  : tripId,
      'bookStatus'  : bookStatus
    }).fetch();

    return books;
  },

  getBooksToFill : function(dates, tripId, productId){
    books = Books.find({
      dateOfBooking   : {$gte: dates.selectedDay, $lt: dates.nextDay},
      'product._id'   : productId,
      'trip._id'  : tripId,
      $or: [ { bookStatus: "Booked"}, { bookStatus: "Waiting Payment (credit card)" } ]
    }).fetch();

    cartBooks = CartItems.find({
      dateOfBooking : {$gte: dates.selectedDay, $lt: dates.nextDay},
      'product._id' : productId,
      'trip._id' : tripId,
      $or: [ { bookStatus: "Booked"}, { bookStatus: "Waiting Payment (credit card)" } ]
    }).fetch();

    for (var i = cartBooks.length - 1; i >= 0; i--) {
      books.push(cartBooks[i]);
    }

    return books;
  },

  getOnlineDiscount : function(){
    return Settings.findOne("onlineDiscount").onlineDiscount;
  },

  setOnlineDiscount : function(value){
    Settings.update("onlineDiscount", {$set : {onlineDiscount : value}});
  },


  saveFile: function(blob, name, path, encoding) {
    var fs = Npm.require('fs'), encoding ='binary';
    var nameAndPath = '../../../../../public/images/' + name ;
    var base64 = blob;
    fs.writeFile(nameAndPath, base64, encoding, function(err) {
      if (err) {
          return err;
        }else{
          return true;
        }
    });
    },

  getAllBooksByOrder : function(orderId){
    var books = Books.find({orderId : orderId}).fetch();
    return books;
  },

  getCustomerById : function(customerId){
    return Customers.findOne(customerId);
  },

  insertBook : function(book){
    if(!book.refNumber){
      var refNumber = new Date().getTime().toString().substr(5);
      while(Books.findOne({refNumber : refNumber})){
          refNumber = new Date().getTime().toString().substr(5);
      }
      book.refNumber = refNumber;
    }
    bookId = Books.insert(book);
    note = Notes.findOne({bookId: bookId});
    if(note)
      Notes.update(note._id, {$set : {bookId: bookId}});

    return bookId;
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
    //saveQRCode(gif,""+id)
  },

  getBookById: function(bookId){
    return Books.findOne(bookId);
  },

  getCustomerById: function(customerId){
    return Customers.findOne(customerId);
  },

  getAllCars : function(){
    return Cars.find().fetch();
  },

  getInitials : function(){
    return Initials.find().fetch();
  },

  getSeasonDates : function(){
    var winterDate = Settings.findOne({_id : "winter"}).winterStartDate;
    var summerDate = Settings.findOne({_id : "summer"}).summerStartDate;

    return {winterDate : winterDate, summerDate : summerDate};

  }
});
