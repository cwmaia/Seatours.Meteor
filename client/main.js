Meteor.subscribe('products');
Meteor.subscribe('users');
Meteor.subscribe('books');
Meteor.subscribe('vehicles_category');
Meteor.subscribe('boats');
Meteor.subscribe('vehicles');
Meteor.subscribe('customers');

Template.redirect.helpers({
  userLogged : function(){
  	if(Meteor.user()){
      	return true;
  	}
  
    return false;
  }
})