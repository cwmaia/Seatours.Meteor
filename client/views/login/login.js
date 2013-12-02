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
        	console.log(err);
        	spinner.stop();
          	throwError("User not Found!") 
      	}else{
          Session.set('showOverview', true);
      }
      });
	}
});