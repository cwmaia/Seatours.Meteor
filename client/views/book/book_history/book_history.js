Template.bookHistory.history = function(){
  return HistoryBook.find({bookId : Session.get('bookId')}).fetch();
};

Template.bookHistory.formatDate = function(date){
  return date.toLocaleString();
};
