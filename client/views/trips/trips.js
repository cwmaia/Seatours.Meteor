var _product = {};

Template.trips.helpers({
	trips : function(){
		return Products.find();
	}
});

Template.trips.events({
	'click li' :function(event) {
		Meteor.Router.to("/trips/" + event.currentTarget.id);
	}
});


/* 
	Edit Trip
*/

Template.editTrip.helpers({
	product : function(){
		_product = Session.get('_product') ? Session.get('_product') : Products.findOne(Session.get('tripId'));
		console.log(_product);
		return _product;
	}
});

Template.editTrip.boats = function() {
	return Boats.find();
}

Template.editTrip.equalBoatId = function(id) {
	return _product.boatId == id;
}

Template.editTrip.events({
	'submit #productForm' : function(event) {
		event.preventDefault();
		var form = event.currentTarget;

		if(form.checkValidity()){
			_product.name = form.name.value;
			_product.boatId = form.boat.selectedOptions[0].value;
			
			saveProduct();
			
			throwSuccess(_product.name + ' changed with success');
		}
	},

	'submit #tripForm' : function(event) {
		event.preventDefault();
		var form = event.currentTarget;

		if(form.checkValidity()){
			var trip = {
				from 	: form.from.value,
				to		: form.to.value,
				hour 	: form.hour.value
			};

			_product.trips.push(trip);

			saveProduct();

			form.reset();

			throwSuccess('Trip added');
		}
	},

	'submit #priceForm' : function(event) {
		event.preventDefault();
		var form = event.currentTarget;

		if(form.checkValidity()){
			var price = {
				price 	: form.price.value,
				unit	: form.unit.value,
			};

			_product.prices.push(price);

			saveProduct();

			form.reset();

			throwSuccess('Price added');
		}
	},

	'click .removeTrip' :function(event) {
		event.preventDefault();

		var index = $(event.currentTarget).parents('tr').index();
		_product.trips.splice(index, 1);

		saveProduct();
	},

	'click .removePrice' :function(event) {
		event.preventDefault();

		var index = $(event.currentTarget).parents('tr').index();
		_product.prices.splice(index, 1);

		saveProduct();
	}
});

function saveProduct() {
	Session.set('_product', _product);

	Products.update(_product._id, _product);
}

Template.editTrip.rendered = function(argument) {
	$('#hour').timepicker({
		minuteStep: 1,
		showMeridian: false
	});

	jQuery.validator.setDefaults({
		errorElement: 'span',
		errorClass: 'help-inline error',
		focusInvalid: false,
		rules: {
			email: {
				required: true,
				email:true
			},
			password: {
				required: true,
				minlength: 5
			},
			password2: {
				required: true,
				minlength: 5,
				equalTo: "#password"
			},
			name: {
				required: true
			},
			phone: {
				required: true,
				phone: 'required'
			},
			url: {
				required: true,
				url: true
			},
			from: {
				required: true
			},
			to: {
				required: true
			},
			hour: {
				required: true
			},
			subscription: {
				required: true
			},
			gender: 'required',
			agree: 'required'
		},

		messages: {
			email: {
				required: "Please provide a valid email.",
				email: "Please provide a valid email."
			},
			password: {
				required: "Please specify a password.",
				minlength: "Please specify a secure password."
			},
			subscription: "Please choose at least one option",
			gender: "Please choose gender",
			agree: "Please accept our policy"
		},

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