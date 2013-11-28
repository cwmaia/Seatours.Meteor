Template.cart.cartBooks = function(){
	return CartItems.find();
}

Template.cart.hasItems = function(){
	if(CartItems.find().count() > 0){
		return true;
	}
	return false;
}

Template.cart.totalValue = function(){
	var sum = 0;
	var carts = CartItems.find().fetch();
	for (var i = 0; i < carts.length; i++) {
		carts[i]
	};
}

Template.cart.total = function(){
	var carts = CartItems.find().fetch();
	var total = 0;
	for (var i = 0; i < carts.length; i++) {
		total += parseInt(carts[i].totalISK);
	};
	return total;

}

Template.cart.events({
	'click .checkout' : function(){
		var books = CartItems.find().fetch();
		for (var i = 0; i < books.length; i++) {
			Books.insert(books[i]);
			CartItems.remove({_id : books[i]._id});
		};

		throwSuccess(books.length+' Bookings Created!');
	}
})

Template.items.events({
	'change .number' : function(event){
		var totalParcial = event.currentTarget.value * this.totalISK;
		$('#'+this._id).text(totalParcial);
		calcTotalItems();
	},
	'click .remove' : function(event){
		var link = event.target;
		CartItems.remove(link.rel);
		throwSuccess('Item Removed');
	}
})

var calcTotalItems = function(){
	var total = 0;
	$(".calcTotal").filter(function(){
		total += parseInt($(this).text());
	})

	$('#total').text(total);
}