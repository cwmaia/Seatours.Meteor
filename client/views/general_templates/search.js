Template.search.events({
	'submit form' : function(event){
		event.preventDefault();

		var refNumber = $('#nav-search-input').val();

		book = Books.findOne({refNumber : refNumber});
		console.log(book);
		if(book){
			Session.set('bookId', book._id);
			Meteor.Router.to('/bookDetailResume/'+book._id);
		}else{
			throwInfo('No booking was found with this reference number')
		}
	}
})