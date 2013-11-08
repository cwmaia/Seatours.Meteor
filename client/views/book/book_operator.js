var SaveCustomer = true;
var Product = {};
///////////////////////////////////////////
//Template Book Operator
Template.bookOperator.rendered = function() {
	$('.calendar').datepicker({
		onSelect: function() {
			var productId = $(this).parents('li')[0].id,
			select = $('#trip_' + productId);

			if(select[0].checkValidity()){
				var date = $(this).datepicker('getDate');
				
				Session.set('bookingDate', date);
				Session.set('tripId', select.val());

				Meteor.Router.to("/bookOperator/" + $(this).parents('li')[0].id);
			}
			else
				showPopover(select, 'Choose the trip');
		}
	});
}

Template.bookOperator.helpers({
	'product' : function(){
		return Products.find();
	},

	'getTripsByProduct' : function(productId) {
		var trips = [],
		product = Products.findOne(productId);

		for (var i = product.trips.length - 1; i >= 0; i--)
			trips.push(Trips.findOne(product.trips[i]));

		return trips;
	}
})

Template.bookOperator.events({
	'submit form' :function(event) {
	}
})


///////////////////////////////////////////
//Template Book Detail
Template.bookDetail.rendered = function() {
	$('#passengers').dataTable();
	$('#boatSlots').dataTable();
}

//Global Vars
var MaxCapacity = 0;

Template.bookDetail.events({
	'click #newBooking' :function(event) {
		var bookingsCreated = Books.find({dateOfBooking: Session.get('bookingDate'), 'product._id': Session.get('productId'), bookStatus: 'Created'});
		if(bookingsCreated.length >= MaxCapacity)
			throwError('Maximum capacity of passengers reached!');	
		else
			Meteor.Router.to("/bookOperator/" + Session.get('productId') + '/new');
	},

	// 'click .changeStatusBooking' : function(event) {
	// 	var id = $(event.currentTarget).closest('tr').attr('id'),
	// 	book = Books.findOne(id);

	// 	book.bookStatus == 'Canceled' ? book.bookStatus = 'Created' : book.bookStatus = 'Canceled';
	// 	Books.update(id, book);
	// }

	'click .changeStatusBooking' : function(event) {
		var id = $(event.currentTarget).closest('tr').attr('id'),
		book = Books.findOne(id);

		book.bookStatus = 'Canceled';
		Books.update(id, book);
	}
});

Template.bookDetail.helpers({
	boat: function() {
		var boatId = Products.findOne({_id: Session.get('productId')}).boatId;
		var boat = Boats.findOne({_id: boatId});
		MaxCapacity = boat.maxCapacity;
		return boat;
	},

	product: function() {
		Product = Products.findOne(Session.get('productId'));
		return Product;
	},

	date: function() {
		return Session.get('bookingDate').toLocaleDateString();
	},

	bookings : function(){
		var date = Session.get('bookingDate');
		with(date){
			setDate(getDate() + 1);
		}
		return Books.find({dateOfBooking: {$gte: Session.get('bookingDate'), $lt: date}, 'product._id': Session.get('productId')});
	},

	isBookCreated : function(status) {
		return status == 'Created';
	},
	bookingsCreated : function(){
		return Books.find({dateOfBooking: Session.get('bookingDate'), 'product._id': Session.get('productId'), bookStatus : "Created"});
	}
});

///////////////////////////////////////////
//Template Create Book
Template.createBook.productName = function(){
	return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).name : "" ;
}

Template.createBook.dateOfBooking = function(){
	return Session.get('bookingDate').toLocaleDateString();
}

Template.createBook.helpers({
	"prices" : function(){
		return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).prices : [] ;
	},
	'destination' : function(){
		return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).trips : [] ;
	},
	'slots' : function(){
		var boatId = Products.findOne({_id: Session.get('productId')}).boatId;
		return Boats.findOne({_id: boatId}).slots;
	}
})

Template.createBook.rendered = function(){
	SaveCustomer = true;
	$("#statusDialog").hide();
	loadTypeahead();
}

Template.createBook.events({
	'click #boatStatus' : function(){
		$("#statusDialog").show();
	},
	'click .cancel, click .close' : function(){
		$("#statusDialog").hide();
	}
})

Template.productPrices.events({
	"change input" : function(event){
		var totalParcial = event.currentTarget.value * this.unit;

		$('#'+this.price).val(totalParcial).text(totalParcial);
		var totalPrice = event.currentTarget.value;
		var totalParcial = totalPrice * this.unit;
		$('#'+this.price).val(totalParcial);
		$('#'+this.unit).val(this.price+"|"+this.unit+"|"+totalPrice+"|"+totalParcial);

		calcTotal();
	}
})

Template.generalPassagerInfo.events({
	'keyup #fullName' : function(event){
		if(event.keyCode != 13)
		{
			$('#title').val('')
	    	$('#birthDate').val('');
	    	$('#email').val('');
	    	$('#telephoneCode').val('');
	    	$('#telephone').val('');
	    	$('#adress').val('');
	    	$('#city').val('');
	    	$('#state').val('');
	    	$('#postcode').val('');
	    	$('#country').val('');
			SaveCustomer = true;
		}
	},
		
	'submit form' : function(event){
		event.preventDefault();

		var form = event.currentTarget;

		if($("#categories").val() != "" && $("#size").val() == "" && !$('#size').is(':disabled')){
			throwError('Please Inform the size of vehicle');
		}else{
			if(form.checkValidity()){

				var customer = {
					"title" : $('#title').val(),
					"fullName" :  $('#fullName').val(),
					"birthDate" : $('#birthDate').val(),
					'email' : $('#email').val(),
					"telephoneCode" : $('#telephoneCode').val(),
					"telephone" : $("#telephone").val(),
					"adress" : $("#adress").val(),
					"city" : $("#city").val(),
					"state" : $('#state').val(),
					"postcode" : $("#postcode").val(),
					"country" : $("#country").val()
	 			}

	 			if(SaveCustomer){
	 				console.log( 'save');
	 				var resultId = Customers.insert(customer);
	 				customer._id = resultId;
	 				book.customerId = result;
	 			}
	 				

	 			var book = {
					"destination" : $("#destination").val(),			
					"totalISK" : $("#totalISK").text(),
					'dateOfBooking' : Session.get('bookingDate'),
					'bookStatus' : 'Created',
					'product' : Product
				}
		
				book.vehicle = {
					"vehicleModel" : $("#listvehicles").val(),
					"category" : $("#categories").val(),
					"size" : $("#size").val(),
					"totalCost" : $("#totalVehicle").text()
				}
			
				var prices = [];

				$('.unitPrice').filter(function(){
					var split = $(this).val().split("|");
					if(split[2]){
						var price = {
						"prices" : split[0],
						"perUnit" : split[1],
						"persons" : split[2],
						"sum" : split[3]
						}
						
						prices.push(price);
					}
				});

				book.prices = prices;
				book.paid = false;

				var result = Books.insert(book);

				throwSuccess("Book added");

				var html = buildEmail(book, result, customer);

				Meteor.call('sendEmailHTML',
					$('#email').val(),
					'noreply@seatours.com',
					'Your Voucher at Seatours!',
					'<html><head></head><body>Thanks for Booking with us, here is your <b>voucher: </b>'+html+'<hr/>Regards! Seatours Team!<body></html>');

				Meteor.Router.to('/voucher/'+result);
			}
		}
	}
})

Template.generalPassagerInfo.helpers({
	countries : function() {
		return Countries.find();
	}
})
///////////////////////////////////////////
//Template Booking Vehicles

Template.bookingVehicles.helpers({
	"vehicles" : function(){
		return Vehicles.find();
	}
})

Template.generalPassagerInfo.rendered = function() {
	$('.datepicker').datepicker({
		changeMonth: true,
      	changeYear: true
	});

	$('#telephone').mask('(99) 9999-9999');
	$('#birthDate').mask('99/99/9999');
}

Template.bookingVehicles.rendered = function(){
	var vehicles = Vehicles.find().fetch(),
	finalItems = [];

	for (var i = vehicles.length - 1; i >= 0; i--) {
		finalItems.push({
			id 		: vehicles[i]._id,
			value	: vehicles[i].model + ' - ' + vehicles[i].brandname
		})
	}

	$('#vehicle').typeahead({
		name : 'brandname',
		local: finalItems
	}).bind('typeahead:selected', function (obj, datum) {
		var id = datum.id;

		if(id != ""){
			var category = Vehicles.findOne({_id: id}).category;

			$("#categories option").filter(function(){
				return $(this).text() == category.category;
			}).attr('selected', true);

			$("#size option:first").text(category.size+"m").val(category.size).attr("selected", true);
			
			$("#categories").attr("disabled", true);
			$("#size").attr("disabled", true);

			$("#baseVehicle").val(category.basePrice);

			var totalVehiclePrice = category.basePrice;
			if(category.size > 10){
				var mult = category.size - 10;
				totalVehiclePrice += mult * 1625;
			}

			$("#totalVehicle").text(totalVehiclePrice);
			calcTotal();
		}else{
			$("#categories").removeAttr("disabled");
			$("#size").removeAttr("disabled");
			$("#categories option:first").attr("selected", true);
			$("#size option:first").text("").attr("selected", true);
			$("#size option:first").attr("selected", true);
			$('#vehiclesField input[type=text]').val('');
			calcTotal();
		}
	});
}

Template.bookingVehicles.events({
	'keyup #vehicle' : function(event){
		if(event.keyCode != 13){
			$("#categories").removeAttr("disabled");
			$("#size").removeAttr("disabled");
			$("#categories option:first").attr("selected", true);
			$("#size option:first").text("").attr("selected", true);
			$("#size option:first").attr("selected", true);
			$('#vehiclesField input[type=text]').val('');
			calcTotal();
		}
	}
})

Template.categoryVehicleBook.helpers({
	categories : function(){
		return VehiclesCategory.find();
	}
});

Template.categoryVehicleBook.sizes = function() {
	return Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}).size : [];
}

Template.categoryVehicleBook.events({
	'change #categories' : function(event){
		var id = event.target.selectedOptions[0].id;
		var category = VehiclesCategory.findOne({_id: id});
		if(category){
			$("#baseVehicle").val(category.basePrice);
			$("#totalVehicle").val(0);
			Session.set('categoryId', id);
		}else{
			$("#baseVehicle").val(0);
			$("#totalVehicle").val(0);
			Session.set('categoryId', null);
		}
			
		calcTotal();
	},

	'change #size' : function(event){
		var base = parseInt($("#baseVehicle").val());
		var value = event.target.selectedOptions[0].value;

		if(value == ""){
			$("#totalVehicle").val(0);
			return;
		}else if(value > 10){
			var mult = value - 10;
			base += mult * 1625;
		}

		$("#totalVehicle").text(base);
		calcTotal();
	}
})

calcTotal = function(){
	var total = 0;
	$('.calcTotal').filter(function(){
		if($(this).text() != "")
		total += parseInt($(this).text());
	})

	$('#totalISK').text(total);
}

loadTypeahead = function(){
	$('#fullName').typeahead('destroy');
	var items = [],
	finalItems,
	tags = Customers.find({}, {fields: {fullName: 1}});
	tags.forEach(function(tag){
    	var datum = {
    		'value' : tag.fullName,
    		'id' : tag._id
    	}
    	items.push(datum);
	});

	finalItems = _.uniq(items);

	$('#fullName').typeahead({
		name : 'fullName',
		local : finalItems
	}).bind('typeahead:selected', function (obj, datum) {
    	var customer = Customers.findOne({_id: datum.id});

    	$('#title').val(customer.title)
    	$('#fullName').val(customer.fullName);
    	$('#birthDate').val(customer.birthDate);
    	$('#email').val(customer.email);
    	$('#telephoneCode').val(customer.telephoneCode);
    	$('#telephone').val(customer.telephone);
    	$('#adress').val(customer.adress);
    	$('#city').val(customer.city);
    	$('#state').val(customer.state);
    	$('#postcode').val(customer.postcode);
    	$('#country').val(customer.country);
    	SaveCustomer = false;
	});
}

buildEmail = function(book, result, customer){
	var prices = '';
	for (var i = 0; i < book.prices.length; i++) {
		prices += book.prices[i].prices + " - " + book.prices[i].persons + " X " + book.prices[i].perUnit + " = " +  book.prices[i].sum + " ISK <br/>";
	};

	var vehicle = '';
	if(book.vehicle.category != ''){
		vehicle = book.vehicle.category +" - "+ book.vehicle.size+ "m = " + book.vehicle.totalCost + " ISK";
	}

	var html = '';
	html += '<div class="page-header">';
	html += '<h1>Voucher</h1>';
	html += '</div>';
	html += '<div class="alert alert-warning" style="font-size: 14px;';
	html += 'border-radius: 0;';
	html += 'adding: 8px 35px 8px 14px;';
	html += 'margin-bottom: 20px;';
	html += 'text-shadow: 0 1px 0 rgba(255, 255, 255, 0.5);';
	html += 'background-color: #fcf8e3;';
	html += 'border: 1px solid #fbeed5;';
	html += '-webkit-border-radius: 4px;';
	html += '-moz-border-radius: 4px;';
	html += 'border-radius: 4px;">';
	html += '<b>ATTENTION, PLEASE NOTE:</b>';
	html += 'You need to pick up your ticket from Seatours office (harbour front) at ';
	html += 'least 30 minutes before departure.';
	html += '</div>';
	html += '<div id="voucher" class="line-3" style="float: left; width: 100%; margin: 2% 0;">';
	html += '<section style="float: left; margin-right: 1%; width: 30%;">';
	html += '<h3 style="margin-bottom: 1%; font-style: italic; font-weight: lighter; text-shadow: 2px 1px 1px white;">Address</h3>';
	html += '<p style="font-size: 130%; margin: 0 0 10px;">Smidjustigur 3 - 340 Stykkisholmur</p>';
	html += '</section>';
	html += '</div>';
	html += '<table class="table table-striped table-bordered trable-hover" style="border: 1px solid #dddddd;';
	html += 'border-collapse: separate;';
	html += 'border-left: 0;';
	html += '-webkit-border-radius: 4px;';
	html += '-moz-border-radius: 4px;';
	html += 'border-radius: 4px;';
	html += 'width: 100%;';
	html += 'margin-bottom: 20px;';
	html += 'max-width: 100%;';
	html += 'background-color: transparent;';
	html += 'border-collapse: collapse;';
	html += 'border-spacing: 0;">';
	html += '<thead>';
	html += '<tr style="color: #707070;';
	html += 'font-weight: normal;';
	html += 'background: #F2F2F2;';
	html += 'background-color: #f3f3f3;';
	html += 'background-image: -moz-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#f8f8f8), to(#ececec));';
	html += 'background-image: -webkit-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -o-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: linear-gradient(to bottom, #f8f8f8, #ececec);';
	html += 'background-repeat: repeat-x;">';
	html += '<th>Booking ID</th>';
	html += '<th>Booking Date</th>';
	html += '<th>Booking Status</th>';
	html += '</tr>';
	html += '</thead>';
	html += '<tbody>';
	html += '<tr>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+result+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+book.dateOfBooking.toLocaleDateString()+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">Waiting Payment</td>';
	html += '</tr>';
	html += '</tbody>';
	html += '</table>';
	html += '<table class="table table-striped table-bordered trable-hover" style="border: 1px solid #dddddd;';
	html += 'border-collapse: separate;';
	html += 'border-left: 0;';
	html += '-webkit-border-radius: 4px;';
	html += '-moz-border-radius: 4px;';
	html += 'border-radius: 4px;';
	html += 'width: 100%;';
	html += 'margin-bottom: 20px;';
	html += 'max-width: 100%;';
	html += 'background-color: transparent;';
	html += 'border-collapse: collapse;';
	html += 'border-spacing: 0;">';
	html += '<thead>';
	html += '<tr style="color: #707070;';
	html += 'font-weight: normal;';
	html += 'background: #F2F2F2;';
	html += 'background-color: #f3f3f3;';
	html += 'background-image: -moz-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#f8f8f8), to(#ececec));';
	html += 'background-image: -webkit-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -o-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: linear-gradient(to bottom, #f8f8f8, #ececec);';
	html += 'background-repeat: repeat-x;">';
	html += '<th>Full Name</th>';
	html += '<th>Full Address</th>';
	html += '<th>Contact Number</th>';
	html += '<th>Email Address</th>';
	html += '</tr>';
	html += '</thead>';
	html += '<tbody>';
	html += '<tr>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+customer.fullName+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+customer.adress+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+customer.telephone+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+customer.email+'</td>';
	html += '</tr>';
	html += '</tbody>';
	html += '</table>';
	html += '<table class="table table-striped table-bordered trable-hover" style="border: 1px solid #dddddd;';
	html += 'border-collapse: separate;';
	html += 'border-left: 0;';
	html += '-webkit-border-radius: 4px;';
	html += '-moz-border-radius: 4px;';
	html += 'border-radius: 4px;';
	html += 'width: 100%;';
	html += 'margin-bottom: 20px;';
	html += 'max-width: 100%;';
	html += 'background-color: transparent;';
	html += 'border-collapse: collapse;';
	html += 'border-spacing: 0;">';
	html += '<thead>';
	html += '<tr style="color: #707070;';
	html += 'font-weight: normal;';
	html += 'background: #F2F2F2;';
	html += 'background-color: #f3f3f3;';
	html += 'background-image: -moz-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#f8f8f8), to(#ececec));';
	html += 'background-image: -webkit-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: -o-linear-gradient(top, #f8f8f8, #ececec);';
	html += 'background-image: linear-gradient(to bottom, #f8f8f8, #ececec);';
	html += 'background-repeat: repeat-x;">';
	html += '<th>Items</th>';
	html += '<th>Total</th>';
	html += '</tr>';
	html += '</thead>';
	html += '<tbody>';
	html += '<tr>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+prices+'<br/>'+vehicle+'</td>';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += '<td style="padding: 8px;';
	html += 'line-height: 20px;';
	html += 'text-align: left;';
	html += 'vertical-align: top;';
	html += 'border-top: 1px solid #dddddd;">'+book.totalISK+' ISK</td>';
	html += '</tr>';
	html += '</tbody>';
	html += '</table>';

	return html;
}
