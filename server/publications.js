Meteor.publish('products', function() { 
	return Products.find();
});

Meteor.publish('users', function() { 
	return Users.find();
});

Meteor.publish('books', function() { 
	return Books.find();
});