Initials = new Meteor.Collection('initials');

Initials.allow({
  insert : function(){
    if(CheckUser())
      return true;
    else
      return false;
  },

  update : function(){
    if(CheckUser())
      return true;
    else
      return false;
  },

  remove : function(){
    if(CheckUser())
      return true;
    else
      return false;
  }
});
