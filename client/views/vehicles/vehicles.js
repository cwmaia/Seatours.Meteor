Template.vehicles.helpers({
	categories : function(){
		return VehiclesCategory.find();
	}
});

Template.vehicles.sizes = function() {
	return Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}).size : [];
}

Template.vehicles.events({
	'change #categories' : function(event){
		var id = event.target.selectedOptions[0].id;
		Session.set('categoryId', id);
	},

	'submit form' : function(event) {
		event.preventDefault();
		var form = event.target,
		
		v = {
			'brandname'	: $('#brandname').val(),
			'model'		: $('#model').val(),
			'category'	: {
				'category'	: $('#categories').val(),
				'size'		: $('#size').val()
			}
		};

		Vehicles.insert(v);
		throwSuccess("Vehicle Created");

		form.reset();
	}
});