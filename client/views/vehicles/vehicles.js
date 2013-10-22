Template.vehicles.helpers({
	categories : function(){
		return VehiclesCategory.find();
	}
});

Template.vehicles.sizes = function() {
	return Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}).size : [];
}

Template.vehicles.events({
	'change #categories' : function(event, element){
		var id = event.target.selectedOptions[0].id;
		Session.set('categoryId', id);
	},

});

