Errors = new Meteor.Collection(null);
Success = new Meteor.Collection(null);

throwError = function(message) { 
	showMessage('error', message);
}

clearErrors = function() { 
	Errors.remove({seen: 't'});
}

throwSuccess = function(message) {
	showMessage('success', message);
}

clearSuccess = function() { 
	Success.remove({seen: 't'});
}

function showMessage (type, message) {
	$.gritter.add({
		// (string | mandatory) the heading of the notification
		title: type.substring(0, 1).toUpperCase() + type.substring(1, type.length),
		// (string | mandatory) the text inside the notification
		text: message,
		class_name: 'gritter-' + type,
		time: '1500'
	});
}