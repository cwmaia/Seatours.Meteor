Template.categoryVehicle.helpers({
	categories : function(){
		return VehiclesCategory.find();
	}
});

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
		var form = event.target;
		var category = VehiclesCategory.findOne({_id: Session.get("categoryId")});
		
		v = {
			'brandname'	: $('#brandname').val(),
			'model'		: $('#model').val(),
			'category'	: category
		};

		Vehicles.insert(v);
		throwSuccess("Vehicle Created");

		form.reset();
	}
});