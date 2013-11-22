var _trip = {};

Template.blockingDates.rendered = function() {
	$('.calendar').datepicker({
		onSelect: function(date, calendar) {
			_trip.blockingDates.push(new Date(date));

			setTimeout(function(){
				setBlockingDates();
			}, 10);
		},

		'onChangeMonthYear': function(year, month) {
			$(this).attr('data-month', month).attr('data-year', year);

			setTimeout(function(){
				setBlockingDates();
			}, 10);
		}
	});

	$('.calendar').attr('data-month', new Date().getMonth() + 1).attr('data-year', new Date().getFullYear());
}

Template.blockingDates.helpers({
	trips: function() {
		return Trips.find();
	}
});

Template.blockingDates.events({
	'change #trip': function(event) {
		_trip = Trips.findOne(event.currentTarget.selectedOptions[0].value);

		if(!_trip.blockingDates)
			_trip.blockingDates = [];

		setBlockingDates();
	},

	'submit #blockingDates': function(event) {
		event.preventDefault();
		Meteor.call('updateTrip', _trip, function(error) {
			console.log(error);
		});

		$('.isFull').removeClass('isFull');
		throwSuccess('Blocking dates added');
	}
});

function setBlockingDates() {
	$('.isFull').removeClass('isFull');

	var mes = $('.calendar').attr('data-month'),
	ano = $('.calendar').attr('data-year');

	for (var i = _trip.blockingDates.length - 1; i >= 0; i--) {
		if(_trip.blockingDates[i].getFullYear() == ano && _trip.blockingDates[i].getMonth() + 1 == mes)
			$('.calendar tbody a:eq(' + (_trip.blockingDates[i].getDate() - 1) + ')').addClass('isFull');
	}
}