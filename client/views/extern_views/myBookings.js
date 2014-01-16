Template.myBookings.rendered = function(){
	$('#allBookings').dataTable();
}

Template.myBookings.bookings = function(){
	return Books.find().fetch();
}

Template.myBookings.name = function(){
	return Meteor.user().profile.name;
}