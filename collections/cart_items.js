CartItems = new Meteor.Collection('CartItems');

CartItems.allow({
	insert : function(){
		return true;
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