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
	product = Session.get('_product') ? Session.get('_product') : Products.findOne(Session.get('tripId'));
	if(product)
		return product.boatId == id;
	else
		return false;
}

Template.editTrip.helpers({
	product : function(){
		return Session.get('_product') ? Session.get('_product') : Products.findOne(Session.get('tripId'));
	},

	trips : function() {
		product = Session.get('_product') ? Session.get('_product') : Products.findOne(Session.get('tripId'));
		if(product)
			return Trips.find({productId : product._id});
		else
			return [];
	},
	prices : function(){
		product = Session.get('_product') ? Session.get('_product') : Products.findOne(Session.get('tripId'));
		if(product)
			return Prices.find({productId : product._id});
		else
			return [];
	}
});

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
			product = Session.get('_product') ? Session.get('_product') : Products.findOne(Session.get('tripId'));
			if(product){
				var trip = {
				from 	: form.from.value,
				to		: form.to.value,
				hour 	: $('#hour')[0].value,
				season  : form.season.value,
				active  : true,
				productId : product._id
			}

			Trips.insert(trip);

			form.reset();

			throwInfo('Trip added');
		}else{
			throwInfo('Please Save the Product Before Add Trips!');
		}
			

		}
	},

	'submit #priceForm' : function(event) {
		event.preventDefault();
		var form = event.currentTarget;

		if(form.checkValidity()){
			product = Session.get('_product') ? Session.get('_product') : Products.findOne(Session.get('tripId'));
			if(product){
				var price = {
					price 	: form.price.value,
					unit	: form.unit.value,
					season  : form.season.value,
					productId : product._id,
					active : true
				};

				Prices.insert(price);

				form.reset();

				throwInfo('Price added');
			}else{
				throwInfo('Please Save the Product Before Add Trips!');

			}	
		}
	},

	'click .removeTrip' :function(event) {
		event.preventDefault();
		var id = event.currentTarget.id;
		trip = Trips.findOne({_id : id});
		if(trip.active){
			Trips.update(id, {$set : {active : false}});
			throwInfo('Trip Deactivated!');
		}else{
			Trips.update(id, {$set : {active : true}});
			throwInfo('Trip Activated');
		}
	},

	'click .removePrice' :function(event) {
		event.preventDefault();
		var id = event.currentTarget.id;
		trip = Prices.findOne({_id : id});
		if(trip.active){
			Prices.update(id, {$set : {active : false}});
			throwInfo('Price Deactivated!');
		}else{
			Prices.update(id, {$set : {active : true}});
			throwInfo('Price Activated');
		}
	}
});