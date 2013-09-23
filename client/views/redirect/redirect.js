Template.redirect.helpers({
	userLogged : function(){
		if(localStorage.userId)
			return true;
		return false;
	}
})