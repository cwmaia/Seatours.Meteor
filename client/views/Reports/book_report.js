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
	_customer = Session.get('_customer') ? Session.get('_customer') : Meteor.call('getCustomerById', id, function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("_customer", result);
		}	
	});
	return _customer.fullName;
}

Template.bookReport.birth = function(id){
	_customer = Session.get('_customer') ? Session.get('_customer') : Meteor.call('getCustomerById', id, function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("_customer", result);
		}	
	});
	return _customer.birthDate;
}

Template.bookReport.email = function(id){
	_customer = Session.get('_customer') ? Session.get('_customer') : Meteor.call('getCustomerById', id, function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("_customer", result);
		}	
	});
	return _customer.email;
}

Template.bookReport.telephone = function(id){
	_customer = Session.get('_customer') ? Session.get('_customer') : Meteor.call('getCustomerById', id, function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("_customer", result);
		}	
	});
	return _customer.telephone;
}

Template.bookReport.adress = function(id){
	var customer = Customers.findOne({_id: id});
	var adress = customer.adress + ' - ' + customer.city + ' - ' + customer.state + ' - ' + customer.postcode + ' - ' + customer.country;
	return adress;
}

Template.bookReport.events({
	'click .filter' : function(event){

		var listOfBooks;

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
		
		var query = {dateOfBooking: {$gte: dateFrom, $lt: dateTo}};

		if(product) 
			query['product._id'] = product;

		if(paymentStatus)
			query['paid'] = (paymentStatus === '0') ? false : true;

		if(bookStatus)
			query['bookStatus'] = bookStatus;

		listOfBooks = Books.find(query).fetch();

		Session.set('Books', listOfBooks);
	}
})