Template.redirect.helpers({
	userLogged : function(){
		console.log('aqui');
		if(localStorage.userId)
			return true;
		return false;
	}
})