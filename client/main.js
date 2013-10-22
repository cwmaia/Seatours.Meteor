Meteor.subscribe('products');
Meteor.subscribe('users');
Meteor.subscribe('books');
Meteor.subscribe('vehicles_category');

Template.redirect.helpers({
  userLogged : function(){
    if(Session.get('userId'))
      return true;

    return false;
  }
})