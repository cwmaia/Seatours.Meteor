Template.book.rendered = function() {

	$('#myWizard').easyWizard();
	$('.datepicker').datepicker();
				
  	$("#selected_product").change(function(){
  		Session.set("productChosen", $(this).val());
  	})
}

Template.book.getProductOptions = function () {
	var options = Products.find({});
	var optionsHTML = "";    

	options.forEach( function( product )
	{	
		for (var i = product.schedulesAvailable.length - 1; i >= 0; i--) {
			var newOption = "<option value='" + product._id + "' >" + product.name + " - " + product.schedulesAvailable[i] +"</option>";
	  		optionsHTML += newOption;
		};
	});

	return optionsHTML;
}

Template.book.helpers({
	'productChosen' : function(){
		return Session.get("productChosen");
	}
})

Template.productDescription.helpers({
	name : function(){
		return Products.findOne({ _id: Session.get("productChosen")}).name;
	},
	description : function(){
		return Products.findOne({ _id: Session.get("productChosen")}).description;
	}
});