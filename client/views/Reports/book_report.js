Template.bookReport.helpers({
	books : function(){
		return Session.get('Books') ? Session.get('Books') : [];
	},

	products : function(){
		Meteor.call('getProducts', function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("allProducts", result);
		}	
	});
	return Session.get("allProducts");
	}
})

Template.bookReport.rendered = function(){
	$('.calendar').datepicker();
	$('#filterResult').dataTable();
}

Template.bookReport.fullname = function(id){
	try{
	_customer = Session.get('_customer') ? Session.get('_customer') : Meteor.call('getCustomerById', id, function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("_customer", result);
    		return result;
		}	
	});
	_customer = Session.get("_customer");
	return _customer.fullName;}
	catch(err){
		return;
	}
}

Template.bookReport.birth = function(id){
	try{
	_customer = Session.get('_customer') ? Session.get('_customer') : Meteor.call('getCustomerById', id, function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("_customer", result);
    		return result;
		}	
	});
	_customer = Session.get("_customer");
	return _customer.birthDate;}
	catch(err){
		return;
	}
}

Template.bookReport.email = function(id){
	try{
	_customer = Session.get('_customer') ? Session.get('_customer') : Meteor.call('getCustomerById', id, function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("_customer", result);
    		return result;
		}	
	});
	_customer = Session.get("_customer");
	return _customer.email;}
	catch(err){
		return;
	}
}

Template.bookReport.telephone = function(id){
	try{
	_customer = Session.get('_customer') ? Session.get('_customer') : Meteor.call('getCustomerById', id, function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("_customer", result);
		}	
	});
	return _customer.telephone;}
	catch(err){
		return;
	}
}

Template.bookReport.adress = function(id){
	try{
	_customer = Session.get('_customer') ? Session.get('_customer') : Meteor.call('getCustomerById', id, function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("selectedCustomer", result);
    		return result
		}	
	});
	customer = Session.get("selectedCustomer");
	var adress = customer.adress + ' - ' + customer.city + ' - ' + customer.state + ' - ' + customer.postcode + ' - ' + customer.country;
	return adress;}
	catch(err){
		return;
	}
}

Template.bookReport.events({
	'click .filter' : function(event){

		var product = $('#product').val(); 
		var from = $('#from').val();
		var to = $('#to').val();
		var bookStatus = $('#bookStatus').val();
		var paymentStatus = $('#paymentStatus').val();

		if(!from || !to){
			throwError('Dates are Needed!');
			return;
		}

		var dateFrom = new Date(from);
		var dateTo = new Date(to);
		with(dateTo){
			setDate(getDate() + 1);
		}
		
		Meteor.call('getBookByDateRange', dateFrom, dateTo, product, paymentStatus, bookStatus, function(error, result){
			if(error){
        		console.log(error.reason);
    		}else{
				Session.set('Books', result);
			}
		});

	}
})