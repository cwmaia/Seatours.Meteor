var _product = {};

Template.editTrip.rendered = function() {

	// $('.bootstrap-timepicker').timepicker({
	// 	minuteStep: 1,
	// 	showSeconds: true,
	// 	showMeridian: false
	// });
}

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
		return _product;
	}
});

Template.editTrip.events({
	'submit #tripForm' : function(event) {
		event.preventDefault();
		var form = event.currentTarget;

		if(form.checkValidity()){
			var trip = {
				from 	: $('#from').val(),
				to		: $('#to').val(),
				hour 	: $('#hour').val()
			};

			_product.trips.push(trip);

			Session.set('_product', _product);

			$('#tripField input[type=text]').val('');

			throwSuccess('Trip added');
		}
		else
			throwError('The trip is not valid');
	},

	'submit #priceForm' : function(event) {
		event.preventDefault();
		var form = event.currentTarget;

		if(form.checkValidity()){
			var price = {
				price 	: $('#price').val(),
				unit	: $('#unit').val(),
			};

			_product.prices.push(price);

			Session.set('_product', _product);

			$('#priceField input[type=text]').val('');

			throwSuccess('Price added');
		}
		else
			throwError('The price is not valid');
	},

	'click .removeTrip' :function(event) {
		event.preventDefault();

		var index = $(event.currentTarget).parents('tr').index();
		_product.trips.splice(index, 1);

		Session.set('_product', _product);
	},

	'click .removePrice' :function(event) {
		event.preventDefault();

		var index = $(event.currentTarget).parents('tr').index();
		_product.prices.splice(index, 1);

		Session.set('_product', _product);
	},
});