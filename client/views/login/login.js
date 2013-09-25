Template.login.events({
	'submit form' : function(event){
		event.preventDefault();
		
		var user = {
			username : $(event.target).find('[name=username]').val(),
			authKey : $(event.target).find('[name=password]').val()
		}

		try{
			var seatoursUser = Users.findOne({username : user.username, authKey : user.authKey});
			localStorage.userId = seatoursUser._id;
			if(seatoursUser.authLvl == 'admin'){
				Meteor.Router.to('/adm');
			}else{
				Meteor.Router.to('/guest');
			}
		}catch(err){
			Alert(err);
		}
	},

	'click .create-button' : function(event){
		event.preventDefault();
		Meteor.Router.to('/createAccount');

	}
})


