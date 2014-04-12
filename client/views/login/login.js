Template.login.events({
	'submit form' : function(event){
		event.preventDefault();

		SpinnerInit();
		
		var user = {
			username : $(event.target).find('[name=username]').val(),
			password : $(event.target).find('[name=password]').val()
		}

    login(user.username, user.password);
      		
	}
});

var login = function(username, password){

  console.log("aqui");

  Meteor.loginWithPassword(username, password, function(err){
        if (err){
          throwError(err.reason);
          SpinnerStop();
        }else{
          Meteor.Router.to('/');
          Session.set('dateSelected', false);
          Session.set('showOverview', true);
      }
      });
}