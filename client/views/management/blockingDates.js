var _trip = {};

Template.blockingDates.rendered = function() {
	$(".datePickerWYear").datepicker().on(
		'changeDate', function(ev){
			$("#reason").removeAttr('disabled');
			if (BlockingDates.findOne({'tripId' : $('#trip').val(), 'blockedDay' : $('#dayBlocked').val() , 'blocked' : true})){
				$('#blockButton').val('Unblock');
			}else{
				$('#blockButton').val('Block');
			}
		});
	$("#usersTable").dataTable();
}

Template.blockingDates.helpers({
	trips: function() {
		return Trips.find();
	}
});

Template.blockingDates.block = function(){
	if(Session.get("tripSelected")){
		var todayDate = new Date();
		var dateString = '0' + (todayDate.getMonth() + 1) + '/' + todayDate.getDate() + '/' + todayDate.getFullYear();
		console.log(BlockingDates.find({'blockedDay': {$gte: dateString},'tripId' : $('#trip').val(), 'blocked' : true}).fetch());
		return BlockingDates.find({'tripId' : $('#trip').val(), 'blocked' : true}).fetch();
	}
	return null;
}

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
			'blocked' : true
		}
		if (BlockingDates.findOne({'tripId' : $('#trip').val(), 'blockedDay' : $('#dayBlocked').val() , 'blocked' : true})){
				var current = BlockingDates.findOne({'tripId' : $('#trip').val(), 'blockedDay' : $('#dayBlocked').val() , 'blocked' : true});
				BlockingDates.update(current._id, {$set : {blocked : false}});
		} else if (BlockingDates.findOne({'tripId' : $('#trip').val(), 'blockedDay' : $('#dayBlocked').val() , 'blocked' : false})){
				var current = BlockingDates.findOne({'tripId' : $('#trip').val(), 'blockedDay' : $('#dayBlocked').val() , 'blocked' : false});
				BlockingDates.update(current._id, {$set : {blocked : true}});
		}else{
			BlockingDates.insert(blockDate);
		}
		$("#dayBlocked").attr('disabled','disabled');
		$("#reason").attr('disabled','disabled');
		$("#blockButton").attr('disabled','disabled');
		$("#dayBlocked").val('');
		$("#reason").val('');
		$("#blockButton").val('Save');

		Session.set("tripSelected", false);
	}

})