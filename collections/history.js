HistoryBook = new Meteor.Collection("historyBook");

HistoryBook.allow({
  insert : function(){
    if(CheckUser())
      return true;
    else
      return false;
  },

  update : function(){
      return false;
  },

  remove : function(){
      return false;
  }
});
