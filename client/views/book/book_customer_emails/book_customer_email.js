var customer = {};
var book = {};

Template.bookCustomerEmailResume.rendered = function(){
	book = Books.findOne({_id: Session.get('bookId')});
	customer = Customers.findOne({_id: book.customerId});
	$('#editMailModal').hide();
}

Template.bookCustomerEmailResume.aditionalEmails = function(){
	book = Books.findOne({_id: Session.get('bookId')});
	customer = Customers.findOne({_id: book.customerId});
	return Mails.find({customerId: customer._id});
}

Template.bookCustomerEmailResume.events({
	'submit form' : function(event){
		event.preventDefault();
		var form = event.currentTarget;
		
		if(form.checkValidity()){
			var mailValue = $(form).find('[name=email]').val();
			
			mail = {
				mail : mailValue,
				customerId : customer._id
			}

			Mails.insert(mail);

			throwSuccess('Aditional mail added!');
		}

	},

	'click .sendMail' : function(event){
		var a = event.target;

		html = buildEmail(book, book._id, customer);

		Meteor.call('sendEmailHTML',
			a.rel,
			'noreply@seatours.com',
			'Your Voucher at Seatours!',
			'<html><head></head><body>Thanks for Booking with us, here is your <b>voucher: </b>'+html+'<hr/>Regards! Seatours Team!<body></html>');

		throwSuccess('Mail Sended');
	},
	'click .editMail' : function(){
		$('#editMailModal').show();
	},
	'click .saveEditMail' : function(){
		var newMail = $('#newMainMail').val();

		if(newMail){
			book = Books.findOne({_id: Session.get('bookId')});
			customer = Customers.findOne({_id: book.customerId});

			customer.email = newMail;
			Customers.update(customer._id, customer);
			throwSuccess('Main Email Changed!');
			$('#editMailModal').hide();
		}else{
			throwError('Please inform a email');
		}
	},
	'click .cancel, click .close' : function(){
		$('#editMailModal').hide();
	}
})