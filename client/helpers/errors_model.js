Errors = new Meteor.Collection(null);

throwError = function(message) { 
	Errors.insert({message: message, seen: 'f'})
}

clearErrors = function() { 
	console.log("here 2");
	Errors.remove({seen: 't'});
}

