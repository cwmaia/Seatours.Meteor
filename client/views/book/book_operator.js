Template.bookingVehicles.helpers({
	"vehicles" : function(){
		return Vehicles.find();
	}
})

Template.bookingVehicles.rendered = function(){
	$("#listvehicles").chosen();
}


