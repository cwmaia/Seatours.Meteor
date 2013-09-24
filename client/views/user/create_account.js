$(function(){
	//hide fieldsets
	$('#people').hide();
	$('#travel').hide();

	$('.logo-account').click(function(){
		sessionStorage.removeItem('create');
		location.reload();
	})

	//Shows fieldsets
	$('.select-user').click(function(){
		if($('#travel_nei').is(':checked')){
			$("#travel :input").each(function(){
				$(this).removeAttr('required')
			});
			$("#people :input").each(function(){
				$(this).attr('required')
			});
			$('#travel').hide('slide');
			$('#people').show('slide');
		}else if($('#travel_yal').is(':checked')){
			$("#travel :input").each(function(){
				$(this).attr('required')
			});
			$("#people :input").each(function(){
				$(this).removeAttr('required')
			});
			$('#people').hide('slide');
			$('#travel').show('slide');
		}
	})


})

Template.createAccount.events({
	'submit form' : function(event){

		if($('#travel_nei').is(':checked')){
			var user = {
				firstname : $(event.target).find('[name=firstName]').val(),
				lastname : $(event.target).find('[name=lastName]').val(),
				email : $(event.target).find('[name=email]').val(),
				birthdate : $(event.target).find('[name=birthDate]').val(),
				username : $(event.target).find('[name=username]').val(),
				authKey : $(event.target).find('[name=authKey]').val()
			}

			Users.insert(user);
		}else{
			
		}
		

		
		sessionStorage.removeItem('create');
		location.reload();
	}
})