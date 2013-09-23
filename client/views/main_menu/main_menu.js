$(function(){
	$(".logout").click(function(){
		localStorage.removeItem('userId');
		location.reload();
	})
})