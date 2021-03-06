var _trip = {};

Template.blockDatesList.dates = function(){
	blockedDates = BlockingDates.find({'type' : "blockDate", 'tripId' : Session.get('tripId')}).fetch();
	next = 0;
	returnBlockedDates = [];
	for (var i = blockedDates.length - 1; i >= 0; i--) {
		if(new Date(blockedDates[i].blockedDay) > new Date()){
			returnBlockedDates[next] = blockedDates[i];
			next++;
		}
	};

	return returnBlockedDates;
}

Template.blockDatesList.trip = function(id){
	trip =  Trips.findOne({_id: id});
	
	return trip.from +" "+ trip.to +" "+trip.hour;
}

Template.blockingDates.rendered = function() {
	$(".datePicker").datepicker();
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
	'change #tripBlockDate' : function(event){
		event.preventDefault();
		Session.set("tripSelected", true);
		Session.set('tripId' , $('#tripBlockDate').val());
		Template.blockingDates.rendered();
	},
	'change #reason' : function(){
		$("#blockButton").removeAttr('disabled');
	},
	'click #blockButton' : function(event){

		if(!$('#tripBlockDate').val()){
			throwError('Please Inform the Trip');
			return;
		}

		if(!$('#dayBlocked').val()){
			throwError('Please Inform the Day');
			return;
		}

		if(!$('#reasonBlock').val()){
			throwError('Please Inform the Reason');
			return;
		}
		event.preventDefault();
		var blockDate = {
			'tripId' : $('#tripBlockDate').val(),
			'blockedDay' : $('#dayBlocked').val(),
			'reason' : $('#reasonBlock').val(),
			'user' : Meteor.user().profile.name,
			'type' : 'blockDate'
		}
		
		BlockingDates.insert(blockDate);
		

		$("#dayBlocked").val('');
		$("#reason").val('');

		Session.set("tripSelected", false);
	}

})