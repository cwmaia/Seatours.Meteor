Template.errors.helpers({ 
	errors: function() {
		return Errors.find(); 
	},
	successMessage: function(){
		return Success.find(); 
	}
});

Template.error.rendered = function() {
	var error = this.data; 
	Meteor.defer(function() {
		Errors.update(error._id, {$set: {seen: 't'}}); 
	});
};


Template.success.rendered = function() {
	var success = this.data; 
	Meteor.defer(function() {
		Success.update(success._id, {$set: {seen: 't'}}); 
	});
};