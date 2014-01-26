Template.generalPassagerInfo.groups = function(){
	return Groups.find({type : "external"});
}

Template.generalPassagerInfo.groupCustomer = function(id){
	customer = Customers.findOne({_id : Session.get("customerId")});
	if(customer){
		return customer.groupId == id;
	}else{
		return false;
	}
}

Template.generalPassagerInfo.isEditingCustomer = function(){
	return Session.get('customerId');
}