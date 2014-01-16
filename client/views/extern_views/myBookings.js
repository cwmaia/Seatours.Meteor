Template.myBookings.rendered = function(){
	$('#allBookings').dataTable();
}

Template.myBookings.bookings = function(){
	return Books.find();
}

Template.myBookings.name = function(){
	return Meteor.user().profile.name;
}

Template.myBookings.events({
	'click .myVoucher' : function(event){
		var a = event.currentTarget;
		event.preventDefault();
		cleanExternView();
		Session.set("bookId", a.rel);
		Session.set("myVoucher", true);
		Template.externView.rendered();
	}
})