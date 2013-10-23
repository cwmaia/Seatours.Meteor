Meteor.subscribe('products');
Meteor.subscribe('users');
Meteor.subscribe('books');
Meteor.subscribe('vehicles_category');
Meteor.subscribe('boats');
Meteor.subscribe('vehicles');

Template.redirect.helpers({
  userLogged : function(){
    if(Session.get('userId'))
      return true;

    return false;
  }
})