Template.categoryVehicle.categories = function(){
	return VehiclesCategory.find();
};

Template.vehiclesCategoryEdit.categories = function(){
	return VehiclesCategory.find();
};

Template.categoryVehicle.sizes = function() {
	return Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}).size : [];
}

Template.categoryVehicle.rendered = function(){
	$(".formattedAsMoney").maskMoney({thousands:'.', allowNegative:'true', precision:'0'});
	$(".formattedAsMoney").maskMoney('mask');
	$("#editPricesCategory").hide();
}

Template.vehiclesCategoryEdit.events({
	'click .editPriceCategory' : function(event){
		var a = event.currentTarget;

		category = VehiclesCategory.findOne(a.rel);

		$('input[name="basePriceCategory"]').val(category.basePrice);
		$('input[name="stepCategory"]').val(category.step);
		
		if(category.onReduce){
			$('input[name="stepOnReduce"]').attr('checked', true);
		}

		Session.set('editCategoryId', a.rel);
		$("#editPricesCategory").show();
	},

	'click .close' : function(){
		$("#editPricesCategory").hide();
	},

	'submit #formEditCategory' : function(event){
		event.preventDefault();
		var form = event.target;

		VehiclesCategory.update(Session.get('editCategoryId'), {$set : {
			basePrice : form.basePriceCategory.value,
			step : form.stepCategory.value,
			onReduce : $('input[name="stepOnReduce"]').is(":checked")
		}});

		$("#editPricesCategory").hide();
		throwSuccess("Category Edited!");

	}


})


Template.preRegisterVehicles.events({
	'change #categories' : function(event){
		var id = event.target.selectedOptions[0].id;
		Session.set('categoryId', id);
	},

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