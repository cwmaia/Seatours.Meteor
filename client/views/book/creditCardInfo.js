Template.creditCardInfo.rendered = function(){
  $("#expirationDate").mask("99/99");
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
});
