Template.editTrip.rendered = function() {
	console.log('tosco');

	// $('.bootstrap-timepicker').timepicker({
	// 	minuteStep: 1,
	// 	showSeconds: true,
	// 	showMeridian: false
	// });
}

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
		return Products.findOne(Session.get('tripId'));
	}
});

Template.editTrip.events({
	'click .remove' :function(event) {
		console.log(trip);
	}
});