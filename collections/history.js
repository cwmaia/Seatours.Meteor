HistoryBook = new Meteor.Collection("historyBook");

HistoryBook.allow({
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
      return false;
  }
});
