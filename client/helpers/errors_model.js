Errors = new Meteor.Collection(null);

throwError = function(message) { 
	Errors.insert({message: message, seen: 'f'})
}

clearErrors = function() { 
	Errors.remove({seen: 't'});
}

