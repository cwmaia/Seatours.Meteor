Notes = new Meteor.Collection('notes');

Notes.allow({
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
		return false;
	}
});
