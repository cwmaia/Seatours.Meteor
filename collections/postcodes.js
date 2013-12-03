PostCodes = new Meteor.Collection('postCodes');

PostCodes.allow({
	insert : function(){
		return false;
	},

	update : function(){
		return false;
	},

	remove : function(){
		return false;
	}
})