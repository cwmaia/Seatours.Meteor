Template.redirect.helpers({
	userLogged : function(){
		if(localStorage.userId){
			return true;
		}else{
			return false
		}
	},

	isCreate : function(){
		if(sessionStorage.create){
			return true;
		}else{
			return false;
		}
	}
})