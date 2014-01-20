Meteor.subscribe('products');
Meteor.subscribe('users');
Meteor.subscribe('books');
Meteor.subscribe('vehicles_category');
Meteor.subscribe('boats');
Meteor.subscribe('trips');
Meteor.subscribe('vehicles');
Meteor.subscribe('customers');
Meteor.subscribe('notes');
Meteor.subscribe('mails');
Meteor.subscribe('transactions');
Meteor.subscribe("directory");
Meteor.subscribe("groups");
Meteor.subscribe("cartItems");
Meteor.subscribe("postcodes");
Meteor.subscribe('prices');
Meteor.subscribe('settings');
Meteor.subscribe('cbasket');
Meteor.subscribe('blockingDates');


Template.redirect.helpers({
  userLogged : function(){
  	return !isCustomer();
  }
})


Template.redirect.rendered = function(){	
	$('input[attr=required]').popover({
		trigger: 'manual',
		placement: 'top'
	});

	jQuery.validator.setDefaults({
		errorElement: 'span',
		errorClass: 'help-inline error',
		focusInvalid: true,
		rules: {
			email: {
				required: true,
				email:true
			},
			password: {
				required: true
			},
			password2: {
				required: true,
				minlength: 5,
				equalTo: "#password"
			},
			firstPasswordToEnter:{
				required: true,
				minlength: 6
			},
			confirmPassword:{
				required: true,
				minlength: 6,
				equalTo: "#firstPasswordToEnter"
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
				required: "Please provide a valid email address.",
				email: "Please provide a valid email address."
			},
			password: {
				required: "Please specify a password.",
				minlength: "Please specify a secure password."
			},
			firstPasswordToEnter: {
				required: "Please specify a password.",
				minlength: "Please specify a secure password, it must contains at least 6 characters."
			},
			confirmPassword:{
				equalTo: "Passwords must match"
			},
			subscription: "Please choose at least one option",
			gender: "Please choose a gender",
			agree: "Please read and accept our policy"
		},

		invalidHandler: function (event, validator) { //display error alert on form submit   
			$('.alert-error', $('.login-form')).show();
		},

		highlight: function (e) {
			$(e).closest('.control-group').removeClass('info').addClass('error');
		},

		success: function (e, element) {
			$(element).removeClass('tooltip-error error');
			$(element).popover('hide');
		},

		errorPlacement: function (error, element) {
			element.addClass('tooltip-error error');
			element.popover({
				placement: 'top',
				// title: 'Error',
				content: error.text()
			});

			element.popover('show');
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