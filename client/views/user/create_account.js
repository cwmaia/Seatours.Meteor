Template.createAccount.events({
	'submit #people_form' : function(event){

		var user = {
			firstname : $(event.target).find('[name=firstName]').val(),
			lastname : $(event.target).find('[name=lastName]').val(),
			email : $(event.target).find('[name=email]').val(),
			birthdate : $(event.target).find('[name=birthDate]').val(),
			username : $(event.target).find('[name=username]').val(),
			authKey : $(event.target).find('[name=authKey]').val(),
			authLvl : 'guest'
		}

		Users.insert(user);
		Meteor.Router.to('/');
	},

	'submit #travel_form' : function(event){

		var agency = {

		}

		Agencies.insert(agency);
		Meteor.Router.to('/');
	}
})