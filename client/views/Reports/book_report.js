Template.bookReport.helpers({
	books : function(){
		console.log(Books.find().count());
		return Books.find();
	}
})