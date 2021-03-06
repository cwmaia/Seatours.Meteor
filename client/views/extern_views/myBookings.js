Template.myBookings.rendered = function(){
	$('#allBookings').dataTable({
		"iDisplayLength": 50
	});
}

Template.myBookings.bookings = function(){
	return Orders.find();
}

Template.myBookings.name = function(){
	return Meteor.user().profile.name;
}

Template.myBookings.date = function(dateTime){
	return new Date(dateTime).toLocaleDateString();
}

Template.myBookings.events({
	'click .payOrder' : function(event){
		var a = event.currentTarget;
		event.preventDefault();
		cleanExternView();
		Session.set("checkOrder", null);
		Session.set("orderId", a.rel);
		Session.set("paymentStep", true);
		Template.externView.rendered();
	},

	'click .details' : function(event){
		var a = event.currentTarget;
		event.preventDefault();
		cleanExternView();
		Session.set("orderId", a.rel);
		Session.set("myBookingsDetail", true);
		Template.externView.rendered();
	}
})
