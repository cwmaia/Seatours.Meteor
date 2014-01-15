CBasket = new Meteor.Collection('cbasket');

CBasket.allow({
	insert : function(){
		return true;
	},

	remove : function(){
		return true;
	}
})
