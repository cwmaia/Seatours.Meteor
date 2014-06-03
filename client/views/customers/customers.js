Template.customersAndExternals.customer = function(){
	customersReturn = [];
	groups = Groups.find({type : 'external'}).fetch();
	for (var i = 0; i < groups.length; i++) {
		customers = Customers.find({groupId : groups[i]._id, online: false}).fetch();

		if(customers){
			for (var j = 0; j < customers.length; j++) {
				customersReturn.push(customers[j]);
			}
		}

	}
	return customersReturn;
};

Template.customersAndExternals.group = function(id){
	group = Groups.findOne({_id : id});
	if(group){
		return group.name;
	}
	return "";
};

Template.customersAndExternals.externalGroup = function(){
	return Groups.find({type : 'external'});
};

Template.customersAndExternals.events({
	'click #saveDiscounts' : function(event){
		event.preventDefault();
		groups = Groups.find({type : 'external'}).fetch();
		for (var i = 0; i < groups.length; i++) {
			Groups.update(groups[i]._id, {$set : {discount : $('#onlineDiscountValue'+groups[i]._id).val()}});
		}

		Meteor.call("setOnlineDiscount", $("#onlineDiscountValue").val());
		throwSuccess("Updated Discounts!");

	},

	'click .editCustomer' : function(event){
		var a = event.currentTarget;
		preLoadInfos(a.rel);
		$("#editCustomerModal").show();
	},

	'click .cancel, click .close' : function(){
		$("#editCustomerModal").hide();
	},

	'click .updateCustomer' : function(event){
		var form = document.getElementById('pasagerInfo');
		if(form.checkValidity()){
			event.preventDefault();
			var birthDate;

			birthDate = $('#birthYearSelect').val();
			birthDate += "-" + $('#birthMonthSelect').val();
			birthDate += "-" + $('#birthDaySelect').val();

			var SSN = $('#socialSecurityNumber').val();

			Customers.update($("#customerId").val(), {$set : {
				socialSecurityNumber : SSN,
				fullName :  $('#fullName').val(),
				title : $('#title').val(),
				birthDate : birthDate,
				email : $('#email').val(),
				telephoneCode : $('#telephoneCode').val(),
				telephone : $('#telephone').val(),
				address : $('#adress').val(),
				city : $('#city').val(),
				state : $('#state').val(),
				postcode : $('#postcode').val(),
				country : $('#country').val(),
				groupId : $('#groupCustomer').val()
			}});

			$("#editCustomerModal").hide();
			throwSuccess("Customer Updated!");
		}
	}
});

var preLoadInfos = function(customerId){

	currentCustomer = Customers.findOne({_id : customerId});

	if(currentCustomer){
		$("#customerId").val(customerId);
		$('#socialSecurityNumber').val(currentCustomer.socialSecurityNumber);
		$('#fullName').val(currentCustomer.fullName);
		$('#title').val(currentCustomer.title);
		splitBirth = currentCustomer.birthDate.split("-");
		$('#birthDaySelect').val(Number(splitBirth[2]));
		$('#birthMonthSelect').val(Number(splitBirth[1]));
		$('#birthYearSelect').val(Number(splitBirth[0]));
		$('#birthDate').val(currentCustomer.birthDate);
		$('#email').val(currentCustomer.email);
		$('#telephoneCode').val(currentCustomer.telephoneCode);
		$('#telephone').val(currentCustomer.telephone);
		$('#adress').val(currentCustomer.address);
		$('#city').val(currentCustomer.city);
		$('#state').val(currentCustomer.state);
		$('#postcode').val(currentCustomer.postcode);
		$('#country').val(currentCustomer.country);
		$("#groupCustomer option").filter(function(){
				return $(this).val() == currentCustomer.groupId;
		}).attr('selected', true);
	}
};

var setUp = function(value){
	var discount = value;
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
			discount = groups[i].discount;
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
    }
};

Template.customersAndExternals.rendered = function(){

	$("#editCustomerModal").hide();

	$("#customersTable").dataTable({
		"iDisplayLength": 50,
		"bServerSide": false,
		"bDestroy": true
	});

	Meteor.call("getOnlineDiscount", function(err, result){
		if(err){
			console.log(err);
		}else{
			setUp(result);
		}
	});
};
