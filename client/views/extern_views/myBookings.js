Template.myBookings.rendered = function(){
	$('#allBookings').dataTable();
}

Template.myBookings.bookings = function(){
	return Orders.find();
}

Template.myBookings.name = function(){
	return Meteor.user().profile.name;
}

Template.myBookings.events({
	'click .payOrder' : function(event){
		var a = event.currentTarget;
		event.preventDefault();
		cleanExternView();
		Session.set("orderId", a.rel);
		Session.set("paymentStep", true);
		Template.externView.rendered();
	}
})