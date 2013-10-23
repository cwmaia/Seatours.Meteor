Template.trips.helpers({
	trips : function(){
		console.log(Products.find());
		return Products.find();
	}
});

Template.trips.events({
	'click li' :function(event) {
		console.log(event.currentTarget.id);
		// Meteor.Router.to("/" + event.currentTarget.id);
	}
});