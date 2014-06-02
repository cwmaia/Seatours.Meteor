GeneralReport = {

  init : function(){
    Meteor.Router.to("/generalReport");
  }
};

Template.generalReport.books = function(){
  return Session.get("books");
};

Template.generalReport.fullname = function(id){
  return Customers.findOne({_id: id}).fullName;
};

Template.generalReport.telephone = function(id){
  customer = Customers.findOne({_id: id});
  if(customer)
    return "( "+customer.telephoneCode +" ) "+ customer.telephone;
  else
    return "";
};

Template.generalReport.trip = function(){
  return  Trips.findOne(Session.get('tripId'));
};

Template.generalReport.totalPassagers = function(id){
  var persons = 0;
  book = Books.findOne({_id : id});
  for (var i = 0; i < book.prices.length; i++) {
    if(book.prices[i].price != "Operator Fee")
      persons = parseInt(persons + parseInt(book.prices[i].persons));
  }
  return persons;
};

Template.generalReport.rendered = function(){
  returnPersons();
  PieChart.drawPieChartBoatSlots();

  $("rect").filter(function(){
    var id = $(this).attr("id");
    document.getElementById(id).setAttribute("stroke", "#000000");
  });
};
