var _trip = {};

Template.blockDatesList.dates = function(){
	return BlockingDates.find();
}

Template.blockDatesList.trip = function(id){
	trip =  Trips.findOne({_id: id});
	return trip.from +" "+ trip.to+" "+trip.hour;
}

Template.blockingDates.rendered = function() {
	$(".datePickerWYear").datepicker();
}

Template.blockingDates.helpers({
	trips: function() {
		return Trips.find();
	}
});

Template.blockDatesList.events({
	'click .removeDate' : function(event){
		var a = event.currentTarget;
		BlockingDates.remove({_id: a.rel});
		throwSuccess('Blocked Date Removed');
	}
})

Template.blockingDates.events({
	'change #trip' : function(event){
		event.preventDefault();
		Session.set("tripSelected", true);
		$("#dayBlocked").removeAttr('disabled');
		Template.blockingDates.rendered();
	},
	'change #reason' : function(){
		$("#blockButton").removeAttr('disabled');
	},
	'click #blockButton' : function(event){
		event.preventDefault();
		var blockDate = {
			'tripId' : $('#trip').val(),
			'blockedDay' : $('#dayBlocked').val(),
			'reason' : $('#reason').val(),
			'user' : Meteor.user().profile.name
		}
		
		BlockingDates.insert(blockDate);
		
		$("#dayBlocked").attr('disabled','disabled');
		$("#reason").attr('disabled','disabled');
		$("#blockButton").attr('disabled','disabled');
		$("#dayBlocked").val('');
		$("#reason").val('');

		Session.set("tripSelected", false);
	}

})