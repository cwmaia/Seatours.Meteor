var _product = {};

Template.trips.trips = function(){ 
	return Products.find();
}

Template.trips.events({
	'click li' :function(event) {
		Meteor.Router.to("/trips/" + event.currentTarget.id);
	}
});


/* 
	Edit Trip
*/

Template.editTrip.rendered = function() {
	$('#hour').timepicker({
		minuteStep: 1,
		showMeridian: false
	});
}

Template.editTrip.boats = function() {
	return Boats.find();
}

Template.editTrip.equalBoatId = function(id) {
	return _product.boatId == id;
}

Template.editTrip.helpers({
	product : function(){
		_product = Session.get('_product') ? Session.get('_product') : Products.findOne(Session.get('tripId'));
		return _product;
	},

	trips : function() {
		var trips = [];
 
	     for (var i = _product.trips.length - 1; i >= 0; i--) {
	       	trips.push(Trips.findOne(_product.trips[i]));
	     }
 
     	return trips;
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
			
			if(_product._id){
				Products.update(_product._id, {$set : {name : _product.name, boatId: _product.boatId}})
			}else{
				Products.insert(_product);
			}
				
			Meteor.Router.to('/trips')
			throwSuccess(_product.name + ' saved');
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
			}

			var trips = _product.trips;

			trips.push(Trips.insert(trip));

			Products.update(_product._id, {$set : {trips : trips}})

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

			var prices = _product.prices;

			prices.push(price);

			Products.update(_product._id, {$set : {prices : prices}})

			form.reset();

			throwSuccess('Price added');
		}
	},

	'click .removeTrip' :function(event) {
		event.preventDefault();

		var id = event.currentTarget.id;

		Trips.remove(id);

		var trips = _product.trips.splice(_product.trips.indexOf(id), 1);
		
		Products.update(_product._id, {$set : {trips : trips}});

		throwSuccess('Trip added');
	},

	'click .removePrice' :function(event) {
		event.preventDefault();

		var index = $(event.currentTarget).parents('tr').index();

		var prices = _product.prices.splice(_product.prices.indexOf(id), 1);
		
		Products.update(_product._id, {$set : {prices : prices}});
	}
});



Template.editTrip.rendered = function(argument) {
	$('#hour').timepicker({
		minuteStep: 1,
		showMeridian: false
	});
}