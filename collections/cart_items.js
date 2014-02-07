CartItems = new Meteor.Collection('CartItems');

CartItems.allow({
	insert : function(){
		if(CheckUser())
			return true;
		else
			return false;
	},

	update : function(){
		if(CheckUser())
			return true;
		else
			return false;
	},

	remove : function(){
		return true;
	}
})