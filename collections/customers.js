Customers = new Meteor.Collection('customers');

Customers.allow({
	insert : function(){
		return true;
	},

	update : function(){
		if(CheckUser()){
			return true;
		}else{
			return false;
		}
			
	},

	remove : function(){
		if(CheckUser())
			return true;
		else
			return false;
	}
})