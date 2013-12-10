Template.categoryVehicle.categories = function(){
	return VehiclesCategory.find();
};

Template.categoryVehicle.sizes = function() {
	return Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}).size : [];
}

Template.categoryVehicle.events({
	'change #categories' : function(event){
		var id = event.target.selectedOptions[0].id;
		Session.set('categoryId', id);
	}
})


Template.vehicles.events({
	'submit form' : function(event) {
		event.preventDefault();
		
		var form = event.currentTarget;
		
		var category = VehiclesCategory.findOne({_id: Session.get('categoryId')});

		if($("#categories").val() != "" && $("#size").val() == ""){
			throwError('Please Inform the size of vehicle');
		}else{
			if(form.checkValidity()){
				vehicle = {
					'vehicleName'		: $('#model').val(),
					'category'  : $('#categories').val(),
					'size'    : $('#size').val(),
					'basePrice' : category.basePrice     
				};
				Vehicles.insert(vehicle);
				throwSuccess("Vehicle Created");

				form.reset();
			}
		}	
	}
});