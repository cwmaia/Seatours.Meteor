Books = new Meteor.Collection('books');

Books.allow({
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
		if(CheckUser())
			return true;
		else
			return false;
	}
})