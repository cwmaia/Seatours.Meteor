///////////////////////////////////////////
//Template Book Operator
Template.bookOperator.rendered = function() {
	$('.calendar').datepicker({
		onSelect: function() {
			var date = $(this).datepicker('getDate');
		
			Session.set('bookingDate', date);
			Meteor.Router.to("/bookOperator/" + $(this).parents('li')[0].id);
		}
	});
}

Template.bookOperator.helpers({
	'product' : function(){
		return Products.find();
	}
})

Template.bookOperator.events({
	'click li' :function(event) {
		
	}
})


///////////////////////////////////////////
//Template Create Book
Template.createBook.productName = function(){
	console.log(Session.get('bookingDate'));
	return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).name : "" ;
}

Template.createBook.helpers({
	"prices" : function(){
		return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).prices : [] ;
	}
})

Template.productPrices.events({
	"change input" : function(event){
		var totalParcial = event.currentTarget.value * this.unit;
		$('#'+this.price).val(totalParcial);

		var total = 0;
		$('.calcTotal').filter(function(){
			if($(this).val() != "")
			total += parseInt($(this).val());
		})

		$('#totalISK').val(total);
	}
})

///////////////////////////////////////////
//Template Booking Vehicles

Template.bookingVehicles.helpers({
	"vehicles" : function(){
		return Vehicles.find();
	}
})


Template.bookingVehicles.rendered = function(){
	$("#listvehicles").chosen();
}

Template.bookingVehicles.events({
	'change #listvehicle' : function(event){
		var id = event.target.selectedOptions[0].id;
		var category = Vehicles.findOne({_id: id}).category;
		$("#categories option").filter(function(){
			return $(this).text() == category.category;
		}).attr('selected', true);

		$("#size option:first").text(category.size+"m").val(category.size).attr("selected", true);
		$("#categories").attr("disabled", true);
		$("#size").attr("disabled", true);
	},

	'change #categories' : function(){
		
	}
})


