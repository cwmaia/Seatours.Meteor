

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
  }
});