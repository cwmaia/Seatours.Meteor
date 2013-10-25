total = 0;

Template.bookingVehicles.helpers({
	"vehicles" : function(){
		return Vehicles.find();
	}
})

Template.bookOperator.helpers({
	"prices" : function(){
		return Products.findOne({_id: Session.get("productId")}).prices;
	}
})

Template.bookingVehicles.rendered = function(){
	$("#listvehicles").chosen();
}

Template.bookOperator.total = function(){
	return Session.get("totalCar");
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
		Session.set("totalCar", category.basePrice);
	}
})


