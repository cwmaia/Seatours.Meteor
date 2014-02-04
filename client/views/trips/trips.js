Template.trips.trips = function(){ 
	return Products.find();
}

Template.trips.events({
	'click li' :function(event) {
		Meteor.Router.to("/trips/" + event.currentTarget.id);
	}
});

Template.editTrip.groups = function(){
	return Groups.find({type : 'external'});
}

Template.editTrip.boatFind = function(id){
	product = Session.get('_product') ? Session.get('_product') : Products.findOne(Session.get('tripId'));
	if(product){
		return product.boatId == id;
	}else{
		return false;
	}
}

Template.editTrip.groupProduct = function(id){
	product = Session.get('_product') ? Session.get('_product') : Products.findOne(Session.get('tripId'));
	if(product){
		return product.availableFor == id;
	}else{
		return false;
	}
}

Template.editTrip.groupName = function(id){
	group =  Groups.findOne({_id : id});
	if(group){
		return group.name;
	}
	return "";
}

Template.editTrip.seasonName = function(season){
	if(season == 'noSeason'){
		return "Available on Dates";
	}else{
		return season;
	}
}

Template.editTrip.datesBegin = function(season){
	if(season == 'noSeason'){
		return this.availableDays.start;
	}else if(season == 'summer'){
		return Settings.findOne({_id: 'summer'}).summerStartDate;
	}else{
		return Settings.findOne({_id: 'winter'}).winterStartDate;
	}
}

Template.editTrip.datesEnd = function(season){
	if(season == 'noSeason'){
		return this.availableDays.end;
	}else if(season == 'summer'){
		return Settings.findOne({_id: 'winter'}).winterStartDate;
	}else{
		return Settings.findOne({_id: 'summer'}).summerStartDate;
	}
}



/* 
	Edit Trip
*/

Template.editTrip.rendered = function() {
	$('#hour').timepicker({
		minuteStep: 1,
		showMeridian: false
	});
	$("#dateRangeSelect").hide();
	$(".datepicker").datepicker();
	if(Products.findOne(Session.get('tripId'))){
		$("#productTabs").show();
	}else{
		$("#productTabs").hide();
	} 
}

Template.editTrip.boats = function() {
	return Boats.find();
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
	},

	isNew : function(){
		return Session.get('tripId') == 'new';
	}
});


Template.editTrip.events({
	'submit #productForm' : function(event) {
		event.preventDefault();
		var form = event.currentTarget;

		if(form.checkValidity()){

			
			_product = Products.findOne(Session.get('tripId'));
			if(_product){

				var reader = new FileReader();

				fileInput = form.productImage;
				file = fileInput.files[0];

				reader.onload = function(e){
					_product.name = form.name.value;
					_product.boatId = form.boat.selectedOptions[0].value;
					_product.availableFor = $('#groupTrip').val();
					_product.imageName = file.name;

					
					Products.update(_product._id, {$set : {
						name : _product.name, 
						boatId: _product.boatId, 
						availableFor: $('#groupTrip').val(), 
						imageName: file.name, 
						active : $("#activeProduct").is(":checked"), 
						featured : $('#featuredProduct').is(':checked')
					}});

					throwSuccess(_product.name + ' edited');
					Meteor.call('saveFile', e.target.result, file.name);
					Meteor.Router.to('/trips')
				}
				if(file){
					reader.readAsBinaryString(file);
				}else{
					_product.name = form.name.value;
					_product.boatId = form.boat.selectedOptions[0].value;
					_product.availableFor = $('#groupTrip').val();
					
					Products.update(_product._id, {$set : {
						name : _product.name, 
						boatId: _product.boatId, 
						availableFor: $('#groupTrip').val(), 
						active : $("#activeProduct").is(":checked"), 
						featured : $('#featuredProduct').is(':checked')
					}});

					throwSuccess(_product.name + ' edited');
					Meteor.Router.to('/trips')
				}
				
				
			}else{
				var reader = new FileReader();

				fileInput = form.productImage;
				file = fileInput.files[0];

				reader.onload = function(e){
					product = {
						name : form.name.value,
						boatId : form.boat.selectedOptions[0].value,
						availableFor : $('#groupTrip').val(),
						imageName : file.name,
						active : $("#activeProduct").is(":checked"), 
						featured : $('#featuredProduct').is(':checked')
					}
					
					Products.insert(product);
					Meteor.Router.to('/trips')
					throwSuccess(product.name + ' saved');
					Meteor.call('saveFile', e.target.result, file.name);
				}
				
				reader.readAsBinaryString(file);
			}
			
				
			
		}
	},

	'submit #tripForm' : function(event) {
		event.preventDefault();
		var form = event.currentTarget;

		if(form.checkValidity()){
			product = Session.get('_product') ? Session.get('_product') : Products.findOne(Session.get('tripId'));

			var season = '';
			if(!form.season.value){
				season = 'noSeason';
			}else{
				season = form.season.value;
			}

			if(product){
				var trip = {
				from 	: form.from.value,
				to		: form.to.value,
				hour 	: $('#hour')[0].value,
				season  : season,
				active  : true,
				productId : product._id,
			}

			if(season == 'noSeason'){
				trip.availableDays = {
					start: $("#dateStart").val(), 
					end: $("#dateEnd").val()
				}
			}

			if(product){
				Trips.insert(trip);
				form.reset();
				throwInfo('Trip added');
			}else{
				throwError('An error has ocurred, please refresh your browser and try again');
			}
			
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

	'change #seasonsCheckbox' : function(){
		if($("#seasonsCheckbox").is(':checked')){
			$("#SeasonSelect").show('slide');
			$("#season").attr('required', true);
			$("#dateStart").removeAttr('required');
			$("#dateEnd").removeAttr('required');
			$("#dateRangeSelect").hide('slide');
		}else{
			$('#dateRangeSelect').show('slide');
			$("#dateStart").attr('required', true);
			$("#dateEnd").attr('required', true);
			$("#season").removeAttr('required');
			$("#SeasonSelect").hide('slide');
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