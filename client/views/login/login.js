Template.login.events({
	'submit form' : function(event){
		event.preventDefault();

		SpinnerInit();
		
		var user = {
			username : $(event.target).find('[name=username]').val(),
			password : $(event.target).find('[name=password]').val()
		}

		Meteor.loginWithPassword(user.username, user.password, function(err){
        if (err){
        	if(err.reason == 'Incorrect password')
        		throwError("Incorrect Password!") 
        	else
        		throwError("User not Found!") 
        	SpinnerStop();
      	}else{
          Session.set('showOverview', true);
      }
      });
	}
});