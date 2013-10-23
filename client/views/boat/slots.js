slots = [];
cont = 0;
Template.boats.helpers({
	slots : function(){
		return Session.get("Slots");
	}
})

Template.boats.events({
	"click .addSlot" : function(event){
		event.preventDefault();

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

			slots.push(createdSlot);
			Session.set("Slots", slots);
		}
		
	},

	"submit form" : function(event){
		event.preventDefault();
		var boat = {
			"name" : $("#boat-name").val(),
			"slots" : Session.get("Slots")
		}

		Boats.insert(boat);
		throwSuccess("Boat Saved");
		Session.set("Slots", null);
		event.target.reset();

	}

})

Template.createdSlot.events({
	"click .remove_slot" : function(){
		for (var i = slots.length - 1; i >= 0; i--) {
			if(slots[i].number == this.number){
				slots.splice(i, 1);
			}
		}

		Session.set("Slots", slots);
	}
})