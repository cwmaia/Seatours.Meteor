Template.seasonControl.rendered = function(){
	$('.datePickerWYear').datepicker({
		changeMonth : true,
      	changeYear 	: true,
      	dateFormat: 'mm/dd'
	});
}

Template.seasonControl.currentSummer = function(){
	return Settings.findOne({'_id' : 'summer'}).summerStartDate;
}

Template.seasonControl.currentWinter = function(){
	return Settings.findOne({'_id' : 'winter'}).winterStartDate;
}

Template.seasonControl.events({
	'click .saveSettings' : function(event){
		var summer = Settings.findOne({'_id' : 'summer'});
		Settings.update(summer._id, {$set : {'summerStartDate' : $('#summerStart').val()}});
		var winter = Settings.findOne({'_id' : 'winter'});
		Settings.update(winter._id, {$set : {'winterStartDate' : $('#winterStart').val()}});
		throwSuccess("Settings updated!");
	}
});

