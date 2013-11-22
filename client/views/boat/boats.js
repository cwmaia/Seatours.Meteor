Template.boats.boats = function() {
	Meteor.call('getBoats', function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set("allBoats", result);
		}	
	});
	return Session.get("allBoats");
	
}

Template.boats.redered = function(){
}

Template.boats.events({
	'click li' : function() {
		Meteor.Router.to("/boats/" + event.currentTarget.id);
	}
})


////////////////////////////////////////////////////
//Variables
_boat = {};
cont = 0;

////////////////////////////////////////////////////
//Template Edit Boats
Template.editBoat.boat = function() {
	_boat = Session.get('_boat') ? Session.get('_boat') : Meteor.call('getBoatById',Session.get('boatId'), function(error, result){
		if(error){
        	console.log(error.reason);
    	}else{
    		Session.set('_boat', result);
    		return result;
		}	
	});

	if(!_boat) {
		_boat = {slots: []};
	}

	return _boat;
}

Template.editBoat.events({
	"submit #slotForm" : function(event){
		event.preventDefault();
		var form = event.currentTarget;

		if($("#height-slot").val() == ""){
			throwError("Please Inform the Height of Slot");
		}else if($("#width-slot").val() == ""){
			throwError("Please Inform the Width of Slot");
		}else{
			
			var createdSlot = {
				"number" : ++cont,
				"slot_name" : $("#slotName").val(),
				"height" : $("#height-slot").val(), 
				"width" : $("#width-slot").val(),
				"split" : $("#split").is(":checked") ? "Yes" : "No"
			}	

			_boat.slots.push(createdSlot);
			Session.set("_boat", _boat);

			form.reset();
		}
	},

	"click .remove_slot" : function(){
		var index = $(event.currentTarget).parents('tr').index();
		_boat.slots.splice(index, 1);

		Session.set('_boat', _boat);
	},

	"submit #boatForm" : function(event){
		event.preventDefault();
		var form = event.currentTarget;

		if(form.checkValidity()){
			
			_boat.name = form.name.value;
			_boat.maxCapacity = form.maxCapacity.value;

			Session.set("_boat", null);
			
			if(!_boat._id)
				Meteor.call('createBoat',_boat);
			else
				Meteor.call('updateBoat',_boat._id, _boat);

			throwSuccess("Boat Saved");
			Meteor.Router.to('/boats')
		}
	}
	
});
////////////////////////////////////////////////////
//Template Created Slot