var SaveCustomer = true;

///////////////////////////////////////////
//Template Book Operator
Template.bookOperator.rendered = function() {
	$('.calendar').datepicker({
		minDate: 0,
		onSelect: function() {
			var date = $(this).datepicker('getDate');
			Session.set('bookingDate', date);
			Meteor.Router.to("/bookOperator/" + $(this).parents('li')[0].id);
		}
	});
}

Template.bookOperator.helpers({
	'product' : function(){
		return Products.find();
	}
})

Template.bookOperator.events({
	'click li' :function(event) {
		
	}
})


///////////////////////////////////////////
//Template Create Book
Template.createBook.productName = function(){
	return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).name : "" ;
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

///////////////////////////////////////////
//Template Product Prices
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

	 			if(SaveCustomer)
	 				Customers.insert(customer);

	 			var book = {
					"destination" : $("#destination").val(),			
					"totalISK" : $("#totalISK").text(),
					'dateOfBooking' : Session.get('bookingDate'),
					'customer' : customer
				}
		
				book.vehicle = {
					"vehicleModel" : $("#listvehicles").val() ? $("#listvehicles").val() : null,
					"category" : $("#categories").val() ? $("#categories").val() : null,
					"size" : $("#size").val() ? $("#size").val() : null,
					"totalCost" : $("#totalVehicle").text() ? $("#totalVehicle").text() : null
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
				console.log(result);

				throwSuccess("Book added");

				Meteor.call('sendEmail',
		            'jarbas.byakuya@gmail.com',
		            customer.email,
		            'Hello from Meteor!',
		            'http://localhost:3000/voucher/'+result);
				Meteor.Router.to('/voucher/'+result);
			};
		}
	}
})

///////////////////////////////////////////
//Template Booking Vehicles

Template.bookingVehicles.helpers({
	"vehicles" : function(){
		return Vehicles.find();
	}
})


Template.bookingVehicles.rendered = function(){
	$("#listvehicles").chosen();
}

Template.generalPassagerInfo.rendered = function() {
	$('.datepicker').datepicker();

	$('#telephone').mask('(99) 9999-9999');
	$('#birthDate').mask('99/99/9999');
}

Template.bookingVehicles.events({
	'change #listvehicle' : function(event){
		var id = event.target.selectedOptions[0].id;

		if(id != ""){
			var category = Vehicles.findOne({_id: id}).category;

			$("#categories option").filter(function(){
				return $(this).text() == category.category;
			}).attr('selected', true);

			$("#size option:first").text(category.size+"m").attr("selected", true);
			$("#size").val(category.size);
			
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
