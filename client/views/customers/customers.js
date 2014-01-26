Template.customersAndExternals.customer = function(){
	customersReturn = [];
	groups = Groups.find({type : 'external'}).fetch();
	for (var i = 0; i < groups.length; i++) {
		customers = Customers.find({groupId : groups[i]._id}).fetch();

		if(customers){
			for (var j = 0; j < customers.length; j++) {
				customersReturn.push(customers[j]);
			};
		}
		
	};
	return customersReturn;
}

Template.customersAndExternals.group = function(id){
	group = Groups.findOne({_id : id});
	if(group){
		return group.name;
	}
	return "";
}

Template.customersAndExternals.externalGroup = function(){
	return Groups.find({type : 'external'});
}

Template.customersAndExternals.events({
	'click #saveDiscounts' : function(event){
		event.preventDefault();
		groups = Groups.find({type : 'external'}).fetch();
		for (var i = 0; i < groups.length; i++) {
			Groups.update(groups[i]._id, {$set : {discount : $('#onlineDiscountValue'+groups[i]._id).val()}});
		};
		throwSuccess("Updated Discounts!");
		
	},

	'click .editCustomer' : function(event){
		var a = event.currentTarget;
		Session.set('customerId', a.rel);
		Template.generalPassagerInfo.rendered();
		preLoadInfos();
		$("#editCustomerModal").show();
	},

	'click .cancel, click .close' : function(){
		$("#editCustomerModal").hide();
	},

	'click .updateCustomer' : function(event){
		var form = document.getElementById('pasagerInfo');
		if(form.checkValidity()){
			event.preventDefault();
			
			Customers.update(Session.get('customerId'), {$set : {
				socialSecurityNumber :  $('#socialSecurityNumber').val(),
				fullName :  $('#fullName').val(),
				title : $('#title').val(),
		    	birthDate: $('#birthDate').val(),
		    	email : $('#email').val(),
		    	telephoneCode : $('#telephoneCode').val(),
		    	telephone : $('#telephone').val(),
		    	address : $('#adress').val(),
		    	city : $('#city').val(),
		    	state : $('#state').val(),
		    	postcode : $('#postcode').val(),
		    	country : $('#country').val(),
		    	groupId : $('#groupCustomer').val()			
			}})

			Session.set('customerId', null);
			$("#editCustomerModal").hide();
			throwSuccess("Customer Updated!");
		}
	}
})

var preLoadInfos = function(){

	currentCustomer = Customers.findOne({_id : Session.get('customerId')});
	if(currentCustomer){
		$('#socialSecurityNumber').val(currentCustomer.socialSecurityNumber),
		$('#fullName').val(currentCustomer.fullName),
		$('#title').val(currentCustomer.title),
		$('#birthDate').val(currentCustomer.birthDate),
		$('#email').val(currentCustomer.email),
		$('#telephone').val(currentCustomer.telephone),
		$('#adress').val(currentCustomer.address),
		$('#city').val(currentCustomer.city),
		$('#state').val(currentCustomer.state),
		$('#postcode').val(currentCustomer.postcode),
		$('#country').val(currentCustomer.country),
		$("#groupCustomer option").filter(function(){
				return $(this).val() == currentCustomer.groupId;
		}).attr('selected', true);
	}
				
}

Template.customersAndExternals.rendered = function(){
	$("#editCustomerModal").hide();
	$("#customersTable").dataTable();
	var discount = Settings.findOne({_id: 'onlineDiscount'}).onlineDiscount;
	$("#onlineDiscountSlider").slider({
      range: "min",
      min: 0,
      max: 100,
      value: discount,
      slide: function( event, ui ) {
        $( "#onlineDiscountValue" ).val( ui.value );
      }
    });
    $( "#onlineDiscountValue" ).val( $( "#onlineDiscountSlider" ).slider( "value" ) );

    groups = Groups.find({type : 'external'}).fetch();
    for (var i = 0; i < groups.length; i++) {
    	var id = groups[i]._id;
    	var discount = groups[i].discount;
    	$("#onlineDiscountSlider-"+id).slider({
	      range: "min",
	      min: 0,
	      max: 100,
	      value: discount,
	      inputId : id,
	      slide: function( event, ui ) {
	      	slideId = this.id.split('-');
	      	$( "#onlineDiscountValue"+slideId[1] ).val( ui.value );
	      }
	    });
	    $( "#onlineDiscountValue"+id ).val( $( "#onlineDiscountSlider-"+id ).slider( "value" ) );
    };
}