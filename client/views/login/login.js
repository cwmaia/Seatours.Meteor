Template.login.events({
	'submit form' : function(event){
		event.preventDefault();
		
		var user = {
			username : $(event.target).find('[name=username]').val(),
			authKey : $(event.target).find('[name=password]').val()
		}

		try{
			var userId = Users.findOne({username : user.username, authKey : user.authKey})._id;
			localStorage.userId = userId;
			Meteor.Router.to("/");
		}catch(err){
			console.log('fail');
		}
	}




})