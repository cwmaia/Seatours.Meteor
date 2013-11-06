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

Meteor.publish('vehicles', function() {
	return Vehicles.find();
});

Meteor.publish('loggedUsers', function() {
	return LoggedUsers.find();
});

Meteor.publish('customers', function(){
	return Customers.find();
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
  }
});