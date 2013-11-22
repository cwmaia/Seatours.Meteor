Meteor.publish('products', function() { 
	return Products.find();
});

Meteor.publish('books', function() { 
	return Books.find();
});

Meteor.publish('vehicles_category', function() { 
	return VehiclesCategory.find();
});

Meteor.publish('boats', function() {
	return Boats.find();
});

Meteor.publish('trips', function() {
  return Trips.find();
});

Meteor.publish('vehicles', function() {
	return Vehicles.find();
});

Meteor.publish('loggedUsers', function() {
	return LoggedUsers.find();
});

Meteor.publish('customers', function(){
	return Customers.find();
});

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

Meteor.publish('saveTrip', function(trip) {
  if(trip._id)
    Trips.update(trip._id, trip);
  else
    Trips.insert(trip);
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

  getTrips: function() {
    return Trips.find();
  },

  getTripsById: function(id) {
    return Trips.findOne(id);
  },

  createTrip: function(trip) {
    Trips.insert(trip);
  },

  updateTrip: function(trip) {
    console.log(trip);
    Trips.update(trip._id, trip);
  },

  removeTrip: function(id) {
    Trips.remove(id)
  }
});