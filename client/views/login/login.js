Template.login.events({
	'submit form' : function(event){
		event.preventDefault();

		SpinnerInit();
		
		var user = {
			username : $(event.target).find('[name=username]').val(),
			password : $(event.target).find('[name=password]').val()
		}

    Meteor.call('checkVerified', user.username, function(err, result){
       if(result){
          login(user.username, user.password);
       }else{
          if(user.username.indexOf("@") === -1){
            login(user.username, user.password);
          }else{
            throwError("User not Found!");
            SpinnerStop();
          }
       } 
    })


		
	}
});

var login = function(username, password){
  Meteor.loginWithPassword(username, password, function(err){
        if (err){
          if(err.reason == 'Incorrect password')
            throwError("Incorrect Password!") 
          else
            throwError("User not Found!") 
          SpinnerStop();
        }else{
          Session.set('dateSelected', false);
          Session.set('showOverview', true);
      }
      });
}