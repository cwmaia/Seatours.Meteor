$(function(){
	$('.logo-account').click(function(){
		sessionStorage.removeItem('create');
		location.reload();
	})
})

Template.createAccount.events({
	'submit #people_form' : function(event){

		var user = {
			firstname : $(event.target).find('[name=firstName]').val(),
			lastname : $(event.target).find('[name=lastName]').val(),
			email : $(event.target).find('[name=email]').val(),
			birthdate : $(event.target).find('[name=birthDate]').val(),
			username : $(event.target).find('[name=username]').val(),
			authKey : $(event.target).find('[name=authKey]').val()
		}

		Users.insert(user);
		
		sessionStorage.removeItem('create');
		location.reload();
	},

	'submit #travel_form' : function(event){

		var agency = {

		}

		Agencies.insert(agency);
		sessionStorage.removeItem('create');
		location.reload();
	}
})