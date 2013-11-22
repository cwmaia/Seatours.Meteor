Template.categoryVehicle.categories = function(){
	Meteor.call('getVehiclesCategories', function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("allCategories", result);
    		return result;
		}	
	});
	return Session.get("allCategories");
};

Template.categoryVehicle.sizes = function() {
	var selectedVehiclesCategory = Meteor.call('getVehiclesCategoryById', Session.get('categoryId'), function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("selectedVehiclesCategory", result);
    		return result;
		}	
	});
	selectedVehiclesCategory = Session.get('selectedVehiclesCategory');
	return Session.get('selectedVehiclesCategory') ? selectedVehiclesCategory.size : [];
}

Template.categoryVehicle.events({
	'change #categories' : function(event){
		var id = event.target.selectedOptions[0].id;
		Session.set('categoryId', id);
	}
})

Template.vehicles.rendered = function(){

}

Template.vehicles.events({
	'submit form' : function(event) {
		event.preventDefault();
		var form = event.currentTarget;
		var category = Meteor.call('getVehiclesCategoryById', Session.get('categoryId'), function(error, result){
		if(error){
       		console.log(error.reason);
    	}else{
    		Session.set("selectedVehiclesCategory", result);
    		return result;
		}	
		});
		category = Session.get("selectedVehiclesCategory");
		if($("#categories").val() != "" && $("#size").val() == ""){
			throwError('Please Inform the size of vehicle');
		}else{
			if(form.checkValidity()){
				v = {
					'brandname'	: $('#brandname').val(),
					'model'		: $('#model').val(),
					'category'  : {
				         'category'  : $('#categories').val(),
				         'size'    : $('#size').val(),
				         'basePrice' : category.basePrice
				     }
				};
			
				Meteor.call('createVehicle', v);
				throwSuccess("Vehicle Created");

				form.reset();
			}
		}	
	}
});