///////////////////////////////////////////
//Template Book Operator
Template.bookOperator.rendered = function() {
	$('.calendar').datepicker({
		minDate: 0,
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
	return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).name : "" ;
}

Template.createBook.helpers({
	"prices" : function(){
		return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).prices : [] ;
	},
	'destination' : function(){
		return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).trips : [] ;
	}
})

Template.productPrices.events({
	"change input" : function(event){
		var totalParcial = event.currentTarget.value * this.unit;

		$('#'+this.price).val(totalParcial).text(totalParcial);

		calcTotal();
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

Template.generalPassagerInfo.rendered = function() {
	$('.datepicker').datepicker();

	$('#telephone').mask('(99) 9999-9999');
	$('#birthDate').mask('99/99/9999');
}

Template.bookingVehicles.events({
	'change #listvehicle' : function(event){
		var id = event.target.selectedOptions[0].id;

		if(id != ""){
			var category = Vehicles.findOne({_id: id}).category;

			$("#categories option").filter(function(){
				return $(this).text() == category.category;
			}).attr('selected', true);

			$("#size option:first").text(category.size+"m").attr("selected", true);
			$("#size").val(category.size);
			
			$("#categories").attr("disabled", true);
			$("#size").attr("disabled", true);

			$("#baseVehicle").val(category.basePrice);

			var totalVehiclePrice = category.basePrice;
			if(category.size > 10){
				var mult = category.size - 10;
				totalVehiclePrice += mult * 1625;
			}

			console.log(totalVehiclePrice);
			console.log($("#totalVehicle"));
			$("#totalVehicle").text(totalVehiclePrice);
			calcTotal();
		}else{
			$("#categories").removeAttr("disabled");
			$("#size").removeAttr("disabled");
			$("#categories option:first").attr("selected", true);
			$("#size option:first").text("").attr("selected", true);
			$("#size option:first").attr("selected", true);
			$('#vehiclesField input[type=text]').val('');
			calcTotal();
		}
	}
})

Template.categoryVehicleBook.helpers({
	categories : function(){
		return VehiclesCategory.find();
	}
});

Template.categoryVehicleBook.sizes = function() {
	return Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}).size : [];
}

Template.categoryVehicleBook.events({
	'change #categories' : function(event){
		var id = event.target.selectedOptions[0].id;
		var category = VehiclesCategory.findOne({_id: id});
		$("#baseVehicle").val(category.basePrice);
		Session.set('categoryId', id);
	},

	'change #size' : function(event){
		var base = parseInt($("#baseVehicle").val());
		var value = event.target.selectedOptions[0].value;
		if(value > 10){
			var mult = value - 10;
			base += mult * 1625;
		}
		$("#totalVehicle").text(base);
		calcTotal();
	}
})

calcTotal = function(){
		var total = 0;
		$('.calcTotal').filter(function(){
			if($(this).text() != "")
			total += parseInt($(this).text());
		})

		$('#totalISK').text(total);
}