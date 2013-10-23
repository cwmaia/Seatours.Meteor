Template.trips.helpers({
	trips : function(){
		return Products.find();
	}
});

Template.trips.events({
	'click li' :function(event) {
		Meteor.Router.to("/trips/" + event.currentTarget.id);
	}
});


/* 
	Edit Trip
*/

Template.editTrip.helpers({
	trip : function(){
		console.log(Products.findOne(Session.get('tripId')))
		return Products.findOne(Session.get('tripId'));
	}
});