CBasket = new Meteor.Collection('cbasket');

CBasket.allow({
	insert : function(){
		return false;
	}
})