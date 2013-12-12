Template.groupList.groups = function(){
	return Groups.find();
}

Template.createGroups.rendered = function(){
	$('#groupsTable').dataTable();
}

Template.createGroups.events({
	'click #addGroups' : function(event){

		var name = $('#name').val();
		var description = $('#description').val();

		var group = {
			name : name,
			description : description
		}

		Groups.insert(group);
		throwSuccess('Group Created!');
	
		$('#fieldsetUser input').filter(function(){
			$(this).val('');
		})
		
	}


})