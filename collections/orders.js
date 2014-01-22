Orders = new Meteor.Collection('orders');

Orders.allow({
	insert : function(){
		return true;
	},

	update : function(){
		return false;
			
	},

	remove : function(){
		return false;
	}
})