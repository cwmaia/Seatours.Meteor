Template.initialsList.initials = function(){
  return Initials.find();
};

Template.initials.events({
  'submit form' : function(event){
    event.preventDefault();

    var values = $("#initialsForm").serializeObject();

    var initials = {
      intial : values.initial.trim(),
      fullName : values.fullName
    };

    Initials.insert(values);
    throwSuccess("Initials Added!");
  }
});

Template.initialsList.events({
  'click .remove' : function(event){
    event.preventDefault();

    var id = this._id;

    bootbox.confirm("Are you sure to remove the intials: "+ this.initial +' ('+this.fullName+') ?', function(confirm){
      if(confirm){
        Initials.remove(id);
        throwSuccess("Initials Removed");
      }
    });
  }
});
