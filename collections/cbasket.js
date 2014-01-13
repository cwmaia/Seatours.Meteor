CBasket = new Meteor.Collection('cbasket');

CBasket.allow({
	insert : function(){
		return true;
	},

	update : function(){
		return true;
	},

	remove : function(){
		return true;
	}
})