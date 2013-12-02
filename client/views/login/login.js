Template.login.events({
	'submit form' : function(event){
		event.preventDefault();

		var target = document.getElementById('spin-in');
		var spinner = new Spinner(opts).spin(target);
		
		var user = {
			username : $(event.target).find('[name=username]').val(),
			password : $(event.target).find('[name=password]').val()
		}

		Meteor.loginWithPassword(user.username, user.password, function(err){
        if (err){
        	console.log(err);
        	spinner.stop();
          	throwError("User not Found!") 
      	}else{
          Session.set('showOverview', true);
      }
      });
	}
})


var opts = {
	lines: 13, // The number of lines to draw
	length: 20, // The length of each line
	width: 10, // The line thickness
	radius: 30, // The radius of the inner circle
	corners: 1, // Corner roundness (0..1)
	rotate: 0, // The rotation offset
	direction: 1, // 1: clockwise, -1: counterclockwise
	color: '#000', // #rgb or #rrggbb or array of colors
	speed: 1, // Rounds per second
	trail: 60, // Afterglow percentage
	shadow: false, // Whether to render a shadow
	hwaccel: false, // Whether to use hardware acceleration
	className: 'spinner', // The CSS class to assign to the spinner
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	top: 'auto', // Top position relative to parent in px
	left: 'auto' // Left position relative to parent in px
};