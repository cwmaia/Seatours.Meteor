Template.creditCardInfo.rendered = function(){
  $("#expirationDate").mask("99/99");
};

Template.creditCardInfoShow.isPaid = function(){
  var book = Books.findOne($("#bookIdHidden").val());
  if(book){
    if(book.confirmationFeePaid)
      return true;
    else
      return false;
  }else{
    return false;
  }
};

Template.creditCardInfo.events({
  'submit form' : function(event){
    event.preventDefault();
    var form = event.target;
    values = $(form).serializeObject();
    BookOperator.proccedToBooking('/cart', values);
    $("#creditCardModal").hide();
  },

  'click .cancel, click .close' : function(event){
    event.preventDefault();
    $("#creditCardModal").hide();
  },
});

Template.creditCardInfoShow.events({
  'click .cancel, click .close' : function(event){
    event.preventDefault();
    $("#creditCardShowInfoModal").hide();
  },

  'change #confirmationFeePaidInput' : function(event){
    var book = Books.findOne($("#bookIdHidden").val());
    Session.set("confirmBook", book);
    loadTypeAheadInitialsCC();
    $("#creditCardShowInfoModal").hide();
    $("#confirmActionModalCC").show();
  },

  'submit form' : function(event){
    event.preventDefault();
    changeConfirmationFee($("#initialsResultCC").val());
  },

  'click .cancel, click .close' : function(){
    $("#creditCardShowInfoModal").hide();
    $("#confirmActionModalCC").hide();
  },
});

var loadTypeAheadInitialsCC = function(){

  var initials = [],
  finalInitials,
  postTags = Initials.find({}, {fields: {initial: 1, fullName: 1}});

  postTags.forEach(function(tag){
    var datum = {
      'value' : tag.initial,
      'id' : tag._id,
      'fullName' : tag.fullName
    };
    initials.push(datum);
  });

  finalInitials = _.uniq(initials);

  $('#initialsCC').typeahead({
    local : finalInitials
  }).bind('typeahead:selected', function (obj, datum) {
    $('#initialsResultCC').val(datum.fullName);
  });

}

var changeConfirmationFee = function(operatorName){

  var book = Session.get("confirmBook");
  var action = "";

  if(book.confirmationFeePaid){
    Books.update(book._id, {$set : {confirmationFeePaid : false}});
    action = "Undo Confirmation Fee paid";
  }else{
    Books.update(book._id, {$set : {confirmationFeePaid : true}});
    action = "Confirmation Fee paid";
  }

  saveHistoryAction(book, action, operatorName);

  $("#confirmActionModalCC").hide();
};
