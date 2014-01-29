Template.boats.boats = function() {
	return Boats.find();	
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
	 _boat = Session.get('_boat') ? Session.get('_boat') : Boats.findOne(Session.get('boatId'));
	return _boat;
}

Template.editBoat.status = function() {
	 _boat = Session.get('_boat') ? Session.get('_boat') : Boats.findOne(Session.get('boatId'));
	return BoatStatus.find({boatId : _boat._id});
}

Template.editBoat.events({
	"submit #slotForm" : function(event){
		event.preventDefault();
		var form = event.currentTarget;

		if($("#height-slot").val() == ""){
			throwError("Please Inform the Height of the Slot");
		}else if($("#width-slot").val() == ""){
			throwError("Please Inform the Width of the Slot");
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
			
			_boat = Boats.findOne(Session.get('boatId'));
			if(_boat){
				_boat.name = form.name.value;
				_boat.maxCapacity = form.maxCapacity.value;
				Boats.update(_boat._id, {$set : {maxCapacity: _boat.maxCapacity, name: _boat.name}});
				throwSuccess("The Boat has been updated");
				Meteor.Router.to('/boats')
			}else{
				boat = {
					name : form.name.value,
					maxCapacity : form.maxCapacity.value
				}
				Boats.insert(boat);
				throwSuccess("The Boat has been saved");
				Meteor.Router.to('/boats')
			}
		}
	}
	
	
});
////////////////////////////////////////////////////
//Template Created Slot