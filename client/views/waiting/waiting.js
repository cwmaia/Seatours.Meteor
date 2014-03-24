Template.waitingList.bookings = function(){
	
	console.log(Books.find({'pendingApproval': true}).fetch());
	return Books.find({'pendingApproval': true});
}

Template.overview.hasVehicle = function(){
	return this.vehicle.category;
}

Template.waitingList.lineColor = function(paid, bookStatus){
	if(paid && bookStatus == "Booked"){
		return 'green';
	}else if(paid && bookStatus == 'Canceled'){
		return 'orange';
	}else{
		return "red";
	}
	
}


Template.waitingList.customerName = function(customerId){
	return Customers.findOne({'_id' : customerId}).fullName;
}

Template.waitingList.totalPassagers = function(id){
	var persons = 0;
	book = Books.findOne({_id : id});
	for (var i = 0; i < book.prices.length; i++) {
		if(book.prices[i].price != "Operator Fee")
			persons = parseInt(persons + parseInt(book.prices[i].persons));
	};
	return persons;
}

Template.waitingList.telephone = function(id){
	return Customers.findOne({_id: id}).telephone;
}