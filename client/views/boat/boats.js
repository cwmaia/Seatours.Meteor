Template.boats.boats = function() {
	return Boats.find();	
}

Template.boats.redered = function(){
}

Template.editBoat.isNew = function(){
	return Session.get('boatId') == 'new';
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

Template.editBoat.rendered = function(){
	if(Boats.findOne(Session.get('boatId'))){
		$("#boatStatusDiv").show();
		$(".removeBoat").show();
	}else{
		$("#boatStatusDiv").hide();
		$(".removeBoat").hide();
	} 
}

Template.editBoat.status = function() {
	 _boat = Session.get('_boat') ? Session.get('_boat') : Boats.findOne(Session.get('boatId'));
	 if(_boat){
	 	return BoatStatus.find({boatId : _boat._id});
	 }else{
	 	return [];
	 }
	
}

Template.editBoat.events({
	"click .removeStatus" : function(event){

		go = confirm("Please take note, remove slot can cause errors on booking, wishes to continue?")
		if(go){
			var a = event.currentTarget;
			statusId = a.rel;
			BoatStatus.remove(statusId);
			throwSuccess("Status removed");
		}else{
			throwInfo("Remove status cancelled!");
		}
		
	},

	"click .removeBoat" : function(event){
		event.preventDefault();
		if(Session.get('boatId') && Session.get('boatId') != 'new'){
			products = Products.find({active : true}).fetch();
			for (var i = 0; i < products.length; i++) {
				if(products[i].boatId == Session.get('boatId')){
					bootbox.alert("This boat is linked to "+ products[i].name +" product, please desactive the product before remove the boat");
					return;
				}
			};

			bootbox.confirm("This boat will be removed, are you sure?", function(confirm){
				if(confirm){
					Boats.remove(Session.get("boatId"));
					throwSuccess("The Boat has been removed");
					Meteor.Router.to('/boats');
				}else{
					return;
				}
			});
			
		}

		return;
		
	},

	"click .addStatus" : function(){

		if($("#max5mCars").val() == ""){
			throwError("Please Inform the Max 5m cars on the boat");
			return;
		}

		if($("#max6mCars").val() == ""){
			throwError("Please Inform the Max 6m cars on the boat");
			return;
		}

		if($("#extraSlot1m").val() == ""){
			throwError("Please Inform the Max meters on the slot 1");
			return;
		}

		if($("#extraSlot2m").val() == ""){
			throwError("Please Inform the Max meters on the slot 2");
			return;
		}

		_boat = Boats.findOne(Session.get('boatId'));

		if(_boat){
			boatStatus = {
				"boatId" : _boat._id,
				"qtdCarsUpTo_5" : $("#max5mCars").val(),
				"qtdCarsUpTo_6" : $("#max6mCars").val(),
				"bigSlotOne" : 	$("#extraSlot1m").val(),
				"bigSlotTwo" : 	$("#extraSlot2m").val(),
				"AddExtraMotos" : false
			}

			BoatStatus.insert(boatStatus); 

			throwSuccess("Status Added");

			$("#max5mCars").val('');
			$("#max6mCars").val('');
			$("#extraSlot1m").val('');
			$("#extraSlot2m").val('');
		}else{
			throwError("Something happened, please refresh your browser and try again!");
		}
		
	},

	"submit #boatForm" : function(event){
		event.preventDefault();
		var form = event.currentTarget;

		if(form.checkValidity()){
			
			_boat = Boats.findOne(Session.get('boatId'));
			if(_boat){

				var reader = new FileReader();

				fileInput = form.boatImage;
				file = fileInput.files[0];

				reader.onload = function(e){
					_boat.name = form.name.value;
					_boat.maxCapacity = form.maxCapacity.value;

					max5mDoor = $('#max5mDoor').val() ? $('#max5mDoor').val() : 0;
					max6mDoor = $('#max6mDoor').val() ? $('#max6mDoor').val() : 0;

					Boats.update(_boat._id, {$set : {
						maxCapacity: _boat.maxCapacity, 
						name: _boat.name, 
						max5mDoor : max5mDoor, 
						max6mDoor : max6mDoor,
						boatImage : file.name			
					}});

					throwSuccess("The Boat has been updated");
					Meteor.Router.to('/boats')
					Meteor.call('saveFile', e.target.result, file.name);
				}

				if(file){
					reader.readAsBinaryString(file);
				}else{

					_boat.name = form.name.value;
					_boat.maxCapacity = form.maxCapacity.value;

					max5mDoor = $('#max5mDoor').val() ? $('#max5mDoor').val() : 0;
					max6mDoor = $('#max6mDoor').val() ? $('#max6mDoor').val() : 0;

					Boats.update(_boat._id, {$set : {
						maxCapacity: _boat.maxCapacity, 
						name: _boat.name, 
						max5mDoor : max5mDoor, 
						max6mDoor : max6mDoor			
					}});

					throwSuccess("The Boat has been updated");
					Meteor.Router.to('/boats')
				}
				
			}else{
				var reader = new FileReader();

				fileInput = form.boatImage;
				file = fileInput.files[0];

				reader.onload = function(e){
					max5mDoor = $('#max5mDoor').val() ? $('#max5mDoor').val() : 0;
					max6mDoor = $('#max6mDoor').val() ? $('#max6mDoor').val() : 0;

					boat = {
						name : form.name.value,
						maxCapacity : form.maxCapacity.value,
						max5mDoor : max5mDoor,
						max6mDoor : max6mDoor,
						boatImage : file.name
					}


					Boats.insert(boat);
					throwSuccess("The Boat has been saved");
					Meteor.Router.to('/boats')
					Meteor.call('saveFile', e.target.result, file.name);
				}

				reader.readAsBinaryString(file);
				
			}
		}
	}
	
	
});
////////////////////////////////////////////////////
//Template Created Slot