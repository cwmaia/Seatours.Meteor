Template.bookReport.helpers({
	books : function(){
		return Books.find();
	},
	products : function(){
		return Products.find();
	}
})

Template.bookReport.rendered = function(){
	$('.calendar').datepicker();
}

Template.bookReport.events({
	'form submit' : function(event){
		event.preventDefault();

		var product = $(event.target).find('[name=product]').val();
		var from = $(event.target).find('[name=from]').val();
		var to = $(event.target).find('[name=to]').val();

		// if(product && from && to){

		// }else if(){

		// }else{
			
		// }
	}
})