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