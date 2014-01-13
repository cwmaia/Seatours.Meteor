Inquiries = new Meteor.Collection('inquiries');

Inquiries.allow({
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
		if(CheckUser())
			return true;
		else
			return false;
	}
})