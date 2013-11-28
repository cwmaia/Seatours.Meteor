Customers = new Meteor.Collection('customers');

Customers.allow({
	insert : function(){
		if(CheckUser())
			return true;
		else
			return false;
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