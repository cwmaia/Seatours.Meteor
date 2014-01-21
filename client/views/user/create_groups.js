var groupId = null;

Template.groupList.groups = function(){
	return Groups.find();
}

Template.createGroups.rendered = function(){
	$('#groupsTable').dataTable();
	$('#permissionModal').hide();
}

Template.groupList.isNotAdmGroup = function (name) {
	return !(name === 'Administrators');
}

Template.createGroups.events({
	'click #addGroups' : function(event){

		var name = $('#groupName').val();
		var description = $('#description').val();

		var group = {
			name : name,
			description : description,
			permissions: []
		}

		try{
			Meteor.call('createGroup', group);
			throwSuccess('Group Created!');
		}catch(err){
			console.log(err);
		}

		$('#fieldsetUser input').filter(function(){
			$(this).val('');
		})
		
	},

	'click .cancel, click .close' : function(){
		$('#permissionModal').hide();
	},

	'click .editPermissions' : function(event){
		var a = event.currentTarget;
		groupId = a.rel;
		group = Groups.findOne({_id : groupId});

		$("#sales_permission").removeAttr('checked');
		$("#overview_permission").removeAttr('checked');
		$("#reports_permission").removeAttr('checked');

		for (var i = 0; i < group.permissions.length; i++) {
			if(group.permissions[i] == 'bookOperator'){
				$("#sales_permission").attr('checked', true);
			}

			if(group.permissions[i] == 'overview'){
				$("#overview_permission").attr('checked', true);
			}

			if(group.permissions[i] == 'bookReport'){
				$("#reports_permission").attr('checked', true);
			}
		};

		$("#permissionModal").show();
	},

	'click .savePermissions' : function(){
		var listPermissions = [];
		if($("#sales_permission").is(':checked')){
			listPermissions.push('bookOperator')
			listPermissions.push('bookDetail')
			listPermissions.push('createBook')
			listPermissions.push('cart')
			listPermissions.push('finishBooking')			
		}

		if($("#edit_permission").is(':checked')){
			listPermissions.push('bookOperator')
			listPermissions.push('bookDetail')
			listPermissions.push('createBook')
			listPermissions.push('cart')
			listPermissions.push('finishBooking')			
		}


		if($("#overview_permission").is(':checked')){
			listPermissions.push('overview');		
		}

		if($("#reports_permission").is(':checked')){
			listPermissions.push('bookReport');
			listPermissions.push('bookDetailResume');		
		}

		try{
			Groups.update(groupId, {$set : {permissions : listPermissions}});
			throwInfo('Permissions Changed!');
			$('#permissionModal').hide();
		}catch(err){
			console.log(err);
			throwError("An Error ocurred, please try refreshing your browser and try again");
			$('#permissionModal').hide();
		}
		
	}





})