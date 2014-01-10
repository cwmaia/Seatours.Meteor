Template.createAccount.events({
	'click #addUsers' : function(event){

		var password1 = $('#password1').val();
		var password2 = $('#password2').val();

		if(!(password1 === password2)){
			throwError('The passwords must be equals!')
			return;
		}

		var user = {
			username : $('#username').val(),
			email : $('#mail').val(),
			password : $('#password1').val(),
			profile : {'groupID': $('#group').val(), 'name' : $('#nameOfUser').val()}
		}

		if(!user.username){
			throwError('Please Inform a Username');
			return;
		}

		if(!user.email){
			throwError('Please Inform a Email');
			return;
		}

		if(!($('#group').val())){
			throwError('Please Inform a Group');
			return;
		}

		if(!($('#nameOfUser').val())){
			throwError('Please Inform the Name of User');
			return;
		}
		
		try{
			Meteor.call('createAccount', user);
			throwSuccess('User Created!');
		}catch(err){
			console.log(err);
		}

		$('#fieldsetGroup input').filter(function(){
			$(this).val('');
		})
		
	}
})

Template.usersList.users = function(){
	return Meteor.users.find().fetch();
}

Template.usersList.getGroup = function(groupID){
	return Groups.findOne({_id: groupID}) ? Groups.findOne({_id: groupID}).name : '';
}

Template.createAccount.groups = function(){
	return Groups.find();
}

Template.usersList.rendered = function(){
	$("#usersTable").dataTable();

		
}

