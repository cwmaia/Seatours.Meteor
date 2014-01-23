Template.myBookingsDetail.rendered = function(){
	$('#allBookingsDetail').dataTable();
}

Template.myBookingsDetail.bookings = function(){
	return Books.find({orderId : Session.get('orderId')});
}

Template.myBookingsDetail.events({
	'click .myVoucher' : function(event){
		var a = event.currentTarget;
		event.preventDefault();
		cleanExternView();
		Session.set("bookId", a.rel);
		Session.set("myVoucher", true);
		Template.externView.rendered();
	}
})