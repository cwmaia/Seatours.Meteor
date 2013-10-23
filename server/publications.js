Meteor.publish('products', function() { 
	return Products.find();
});

Meteor.publish('users', function() { 
	return SeatoursUsers.find();
});

Meteor.publish('books', function() { 
	return Books.find();
});

Meteor.publish('vehicles_category', function() { 
	return VehiclesCategory.find();
});

Meteor.publish('vehicles', function() {
	return Vehicles.find();
});