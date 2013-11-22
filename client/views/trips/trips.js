var _product = {};

Template.trips.trips = function(){ 
	Meteor.call('getProducts', function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("allProducts", result);
		}	
	});
	return Session.get("allProducts");
}

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
		_product = Session.get('_product') ? Session.get('_product') :  Meteor.call('getProductById',Session.get('tripId'), function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set('_product', result);
    		return result;
		}	
	});

		if(!_product){
			_product = {
				trips : [],
				prices: []
			};
		}
		
		return _product;
	},

	trips : function() {
		var trips = [];

		for (var i = _product.trips.length - 1; i >= 0; i--) {
			var _selectedTrip = Meteor.call('getTripById', _product.trips[i],function(error, result){
			if(error){
        		console.log(error.reason);
    		}else{
    			Session.set('selectedTrip', result);
    			return result;
			}	
			});
			_selectedTrip = Session.get('selectedTrip');
			trips.push(_selectedTrip);
		}

		return trips;
	}
});

Template.editTrip.boats = function() {
	Meteor.call('getBoats', function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("allBoats", result);
    		return result;
		}	
	});
	return Session.get("allBoats"); 
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

			_product.trips.push(Meteor.call('createTrip',trip));
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
			Session.set('_product', _product);

			form.reset();

			throwSuccess('Price added');
		}
	},

	'click .removeTrip' :function(event) {
		event.preventDefault();

		var id = event.currentTarget.id;

		Meteor.call('deleteById',id);
		_product.trips.splice(_product.trips.indexOf(id), 1);
		
		saveProduct();

		throwSuccess('Trip added');
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
		Meteor.call('createProduct',_product);
	else
		Meteor.call('updateProduct',_product._id, _product);
}

Template.editTrip.rendered = function(argument) {
	$('#hour').timepicker({
		minuteStep: 1,
		showMeridian: false
	});
}