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

			throwSuccess('Additional email added!');
		}

	},

	'click .sendMail' : function(event){
		sendMail(book, book._id, customer);		
	},
	'click .editMail' : function(){
		$('#editMailModal').show();
	},
	'click .saveEditMail' : function(){
		var newMail = $('#newMainMail').val();

		if(newMail){
			book = Books.findOne({_id: Session.get('bookId')});
			customer = Customers.findOne({_id: book.customerId});
			Customers.update(customer._id, {$set : {email: newMail}});
			throwSuccess('Your main email has changed!');
			$('#editMailModal').hide();
		}else{
			throwError('Please inform an email address.');
		}
	},
	'click .cancel, click .close' : function(){
		$('#editMailModal').hide();
	}
})

var sendMail = function(book, result, customer){

	var prices = '';
	for (var i = 0; i < book.prices.length; i++) {
		prices += book.prices[i].prices + " - " + book.prices[i].persons + " X " + book.prices[i].perUnit + " = " +  book.prices[i].sum + " ISK <br/>";
	};

	var vehicle = '';
	if(book.vehicle.category != ''){
		vehicle = book.vehicle.category +" - "+ book.vehicle.size+ "m = " + book.vehicle.totalCost + " ISK";
	}

	Meteor.call("generateQRCodeGIF", result);
    Session.set("book", book);

    Session.set("mailing", true);
    
    Session.set("customer", customer);
    
	var html = Template.voucher();

	Meteor.call('sendEmailHTML', customer.email, "noreply@seatours.is", "Your Voucher at Seatours!", html);
	throwSuccess('Mail Sent');

}