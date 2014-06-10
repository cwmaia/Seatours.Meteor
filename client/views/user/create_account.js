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


		Meteor.call('createAccount', user, function(err){
			if(err){
				throwError(err.reason);
			}else{
				throwSuccess('User Created!');
			}
		});


		$('#fieldsetGroup input').filter(function(){
			$(this).val('');
		})

	},

	'click .forgotPassword' : function(event){

		var a = event.currentTarget;

		var options = {
			email : $("#"+a.rel).children('td').eq(1).text()
		}

		$.blockUI({message : 'Please Wait'});
		Accounts.forgotPassword(options, function(err){
			if(err){
				if(err.reason == 'User not found'){
					throwError(err.reason);
				}else{
					throwError('Looks like our server is busy, try again in a few moments');
				}
				$.unblockUI();
			}else{
				$.unblockUI({
					onUnblock : function(){ bootbox.alert("An email has been sent with instructions to reset your password")}
				});
			}
		});
	},

	'click .removeAccount' : function(event){

		var a = event.currentTarget;

		bootbox.confirm("Are you sure?", function(confirm){
			if(confirm){
				Meteor.call('removeAccount', a.rel, function(err, result){
					if(err){
						console.log(err.reason);
						throwError('Looks like our server is busy, try again in a few moments');
					}else{
						throwSuccess("User removed");
					}
				})
			}
		})
	}
})

Template.usersList.users = function(){
	return Meteor.users.find({'profile.groupID' : {$exists : true}}).fetch();
};

Template.usersList.getGroup = function(groupID){
	return Groups.findOne({_id: groupID}) ? Groups.findOne({_id: groupID}).name : '';
};

Template.createAccount.groups = function(){
	return Groups.find({
		type : 'internal',
		description : {$not : "Seatours Super Admin Group"}
		});
};

Template.usersList.isNotAdmGroup = function(groupID){
	group = Groups.findOne({_id: groupID});

	admGroup = Groups.findOne({_id: Meteor.user().profile.groupID});

	if(group){
		return !(group.description == "Seatours Super Admin Group") && admGroup.description == "Seatours Super Admin Group";
	}else{
		return false;
	}
};
