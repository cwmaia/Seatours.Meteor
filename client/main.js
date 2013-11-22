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

Template.redirect.helpers({
  userLogged : function(){
  	if(Meteor.user()){
      	return true;
  	}
  
    return false;
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