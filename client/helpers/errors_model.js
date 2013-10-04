Errors = new Meteor.Collection(null);
Success = new Meteor.Collection(null);

throwError = function(message) { 
	Errors.insert({message: message, seen: 'f'})
}

clearErrors = function() { 
	Errors.remove({seen: 't'});
}

throwSuccess = function(message) { 
	Success.insert({message: message, seen: 'f'})
}

clearSuccess = function() { 
	Success.remove({seen: 't'});
}


