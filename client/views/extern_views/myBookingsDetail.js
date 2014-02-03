Template.myBookingsDetail.rendered = function(){
	$('#allBookingsDetail').dataTable();
	$(".formattedAsMoney").maskMoney({thousands:'.', allowNegative:'true', precision:'0'});
  	$(".formattedAsMoney").maskMoney('mask');
}

Template.myBookingsDetail.bookings = function(){
	return Books.find({orderId : Session.get('orderId')});
}

Template.myBookingsDetail.date = function(date){
	return date.toLocaleDateString();
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