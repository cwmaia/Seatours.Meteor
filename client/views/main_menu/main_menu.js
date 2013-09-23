$(function(){
	$(".logout").click(function(){
		localStorage.removeItem('userId');
		Meteor.Router.to('/');
	})
})