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

		if(!_product){
			_product = {
				trips : [],
				prices: []
			};
		}
		
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
			Meteor.Router.to('/trips')
			throwSuccess(_product.name + ' changed');
		}
	},

	'submit #tripForm' : function(event) {
		event.preventDefault();
		var form = event.currentTarget;

		if(form.checkValidity()){
			var trip = {
				from 	: form.from.value,
				to		: form.to.value,
				hour 	: $('#hour')[0].value
			};

			_product.trips.push(trip);
			Session.set('_product', _product);

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
			Session.set('_product', _product);

			form.reset();

			throwSuccess('Price added');
		}
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
	}
});

function saveProduct() {
	Session.set('_product', _product);

	if(!_product._id)
		Products.insert(_product);
	else
		Products.update(_product._id, _product);
}

Template.editTrip.rendered = function(argument) {
	$('#hour').timepicker({
		minuteStep: 1,
		showMeridian: false
	});
}