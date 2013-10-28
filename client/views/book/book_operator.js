///////////////////////////////////////////
//Template Book Operator
Template.bookOperator.rendered = function() {
	$('.calendar').datepicker({
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
	}
})

///////////////////////////////////////////
//Template Product Prices
Template.productPrices.events({
	"change input" : function(event){
		var totalPrice = event.currentTarget.value;
		var totalParcial = totalPrice * this.unit;
		$('#'+this.price).val(totalParcial);
		$('#'+this.unit).val(this.price+"|"+this.unit+"|"+totalPrice+"|"+totalParcial);
		calcTotal();
	}
})

///////////////////////////////////////////
//Template General Passager
Template.generalPassagerInfo.rendered = function(){

	jQuery.validator.setDefaults({
		errorElement: 'span',
		errorClass: 'help-inline error',
		focusInvalid: false,
		
		invalidHandler: function (event, validator) { //display error alert on form submit   
			$('.alert-error', $('.login-form')).show();
		},

		highlight: function (e) {
			$(e).closest('.control-group').removeClass('info').addClass('error');
		},

		success: function (e) {
			$(e).closest('.control-group').removeClass('error').addClass('info');
			$(e).remove();
		},

		errorPlacement: function (error, element) {
			if(element.is(':checkbox') || element.is(':radio')) {
				var controls = element.closest('.controls');
				if(controls.find(':checkbox,:radio').length > 1) controls.append(error);
				else error.insertAfter(element.nextAll('.lbl').eq(0));
			} 
			else if(element.is('.chzn-select')) {
				error.insertAfter(element.nextAll('[class*="chzn-container"]').eq(0));
			}
			else error.insertAfter(element);
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



Template.generalPassagerInfo.events({
	'submit form' : function(event){
		event.preventDefault();
		var form = event.currentTarget;
		if($("#categories").val() != "" && $("#size").val() == ""){
			throwError('Please Inform the size of vehicle');
		}else{
			if(form.checkValidity()){
				var book = {
				"destination" : $("#destination").val(),
				"clientName" : $('#title').val() + " " + $('#firstName').val() + " " + $("#surname").val(),
				"birthDate" : $('#birthDate').val(),
				'email' : $('#email').val(),
				"telephoneCode" : $('#telephoneCode').val(),
				"adress" : $("#adress").val(),
				"city" : $("#city").val(),
				"state" : $('#state').val(),
				"postcode" : $("#postcode").val(),
				"country" : $("#country").val(),
				"totalISK" : $("#totalISK").text()
			}
		
			book.vehicle = {
				"vehicleModel" : $("#listvehicles").val() ? $("#listvehicles").val() : null,
				"category" : $("#categories").val() ? $("#categories").val() : null,
				"size" : $("#size").val() ? $("#size").val() : null
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
			})

			book.prices = prices;
			book.paid = false;

			Books.insert(book);
			throwSuccess("Book added");
			}
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

			$("#totalVehicle").val(totalVehiclePrice);
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
		$("#baseVehicle").val(category.basePrice);
		$("#totalVehicle").val(0);
		calcTotal();
		Session.set('categoryId', id);
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

		$("#totalVehicle").val(base);
		calcTotal();
	}
})

calcTotal = function(){
		var total = 0;
		$('.calcTotal').filter(function(){
			if($(this).val() != "")
			total += parseInt($(this).val());
		})

		$('#totalISK').val(total);
}

