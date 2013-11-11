Template.bookNotesResume.events({
	'click #addNote' : function(){
		$("#noteDialog").show();
	},
	'click .cancel, click .close' : function(){
		$("#noteDialog").hide();
	},
	'click .saveNotes' : function(event){
		
		if(!$('#typeNote').val()){
			throwError('Please inform a Type');
			return;
		}

		if(!$('#noteText').val()){
			throwError('Please inform a Note');
			return;
		}

		var note = {
			created : new Date(),
			type : $('#typeNote').val(),
			note : $('#noteText').val()
		}
		
		book = Books.findOne({_id: Session.get('bookId')});
		note.bookId = book._id;

		Notes.insert(note);

		throwSuccess('Note added!');
		$("#noteDialog").hide();
		
	},
	'click .sendMailNote' : function(event){
		var link = event.currentTarget;
		var noteId = link.rel;

		var note = Notes.findOne({_id: noteId});
		
		customerId = Books.findOne({_id: Session.get('bookId')}).customerId;
		customerMail = Customers.findOne({_id: customerId}).email;

		html = buildNoticeMail(note);

		Meteor.call('sendEmailHTML',
			customerMail,
			'noreply@seatours.com',
			'Notice from Seatours!',
			'<html><head></head><body>Seatours has a important <b>message</b> for you:<br/><br/>'+html+'<hr/>Regards! Seatours Team!<body></html>');

		throwSuccess('Mail Sended');
		
	}
})

Template.bookNotesResume.rendered = function(){
	$("#noteDialog").hide();
}

Template.bookNotesResume.notes = function(){
	return Notes.find({bookId : Session.get('bookId')});
}

Template.bookNotesResume.dateString = function(date){
	return date.toDateString();
}

buildNoticeMail = function(note){
	var html = '';
	html += '<b>This Note was Created at:</b> '+ note.created;
	html += '<br/><br/>';
	html += '<b>Subject: </b>'+ note.type;
	html += '<br/><br/>';
	html += '<b>Message:</b><br/>'+ note.note;
	return html;
}