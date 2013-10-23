Template.bookingVehicles.helpers({
	"vehicles" : function(){
		return Vehicles.find();
	}
})


Template.book.events({
	'click #destination' : function(){
		openSelectDialog();
	},
	'submit form' : function(event){
		event.preventDefault();

		var user = {
			"username" : $(event.target).find('[name=username]').val(),
			"authKey" : $(event.target).find('[name=authKey]').val(),
			"authLvl" : "guest"
		}

		Users.insert(user);

		var book = {
			"destination" : Session.get("destination"),
			"departure" : $(event.target).find('[name=departure]').val(),
			"adultNumber" : $(event.target).find('[name=adultNumber]').val(),
			"childNumber" : $(event.target).find('[name=childNumber]').val(),
			"infantNumber" : $(event.target).find('[name=infantNumber]').val(),
			"seniorNumber" : $(event.target).find('[name=seniorNumber]').val(),
			"schoolNumber" : $(event.target).find('[name=schoolNumber]').val(),
			"guidesNumber" : $(event.target).find('[name=guidesNumber]').val(),
			"vehiclesNumber" : $(event.target).find('[name=vehiclesNumber]').val(),
			"totalISK" : $(event.target).find('[name=totalISK]').val(),
			"title" : $(event.target).find('[name=title]').val(),
			"firstName" : $(event.target).find('[name=firstName]').val(),
			"surname" : $(event.target).find('[name=surname]').val(),
			"birthDate" : $(event.target).find('[name=birthDate]').val(),
			"email" : $(event.target).find('[name=email]').val(),
			"telephoneCode" : $(event.target).find('[name=telephoneCode]').val(),
			"telephone" : $(event.target).find('[name=telephone]').val(),
			"adress" : $(event.target).find('[name=adress]').val(),
			"city" : $(event.target).find('[name=city]').val(),
			"county" : $(event.target).find('[name=county]').val(),
			"postcode" : $(event.target).find('[name=postcode]').val(),
			"country" : $(event.target).find('[name=country]').val(),
			"user" : user,
			"paid" : "No"
		}

		Books.insert(book);
		throwSuccess("Book and Username Created");
		Meteor.Router.to("/");
		
	}
})




