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

<<<<<<< HEAD
Meteor.publish('boats', function() {
	return Boats.find();
=======
Meteor.publish('vehicles', function() {
	return Vehicles.find();
>>>>>>> 2cf6c28622de775dacfe9cfccd31e1e197d16933
});