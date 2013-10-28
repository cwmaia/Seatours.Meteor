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

Template.vehicles.rendered = function(){

	jQuery.validator.setDefaults({
		errorElement: 'span',
		errorClass: 'help-inline error',
		focusInvalid: false,
		
		invalidHandler: function (event, validator) { //display error alert on form submit   
			$('.alert-error', $('.login-form')).show();
		},

		highlight: function (e) {
			$(e).closest('.control-group').removeClass('info').addClass('error');
		},

		success: function (e) {
			$(e).closest('.control-group').removeClass('error').addClass('info');
			$(e).remove();
		},

		errorPlacement: function (error, element) {
			if(element.is(':checkbox') || element.is(':radio')) {
				var controls = element.closest('.controls');
				if(controls.find(':checkbox,:radio').length > 1) controls.append(error);
				else error.insertAfter(element.nextAll('.lbl').eq(0));
			} 
			else if(element.is('.chzn-select')) {
				error.insertAfter(element.nextAll('[class*="chzn-container"]').eq(0));
			}
			else error.insertAfter(element);
		},

		submitHandler: function (form) {
		},
		invalidHandler: function (form) {
		}
	});

	$('form').bind('submit', function() {
		$(this).valid();
	});
}

Template.vehicles.events({
	'submit form' : function(event) {
		event.preventDefault();
		var form = event.currentTarget;
		var category = VehiclesCategory.findOne({_id: Session.get("categoryId")});
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
			
				Vehicles.insert(v);
				throwSuccess("Vehicle Created");

				form.reset();
			}
		}	
	}
});