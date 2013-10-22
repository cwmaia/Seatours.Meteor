Template.login.events({
	'submit form' : function(event){
		event.preventDefault();
		
		var user = {
			username : $(event.target).find('[name=username]').val(),
			authKey : $(event.target).find('[name=password]').val()
		}

		try{
			var seatoursUser = SeatoursUsers.findOne({username : user.username, authKey : user.authKey});
			localStorage.userId = seatoursUser._id;

			if(seatoursUser.authLvl == 'admin'){
				Session.set('showOverview', true);
				Session.set('userId', seatoursUser._id);
			}else{
				Meteor.Router.to('/guest');
			}
		}catch(err){
			throwError("Username or Password is incorrect");
		}
	},

	'click .create-button' : function(event){
		event.preventDefault();
		Meteor.Router.to('/createAccount');
	}
})