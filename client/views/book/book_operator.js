var SaveVehicle = false;
var CanSaveTheBook = true;
var Product = {};
var VehicleSelected = false;
var loadBirthDate = true;

var getSelectedAndNextDay = function(){
	var selectedDay = new Date(localStorage.getItem('date'));
	var nextDay = new Date(localStorage.getItem('date'));

	with(nextDay){
		setDate(getDate() +1);
	}

	var dates = {
		selectedDay : selectedDay,
		nextDay : nextDay
	};

	return dates;
};

var getFirstSlotAvailable = function(){

	var prefSlots = [1,2,3,4,5,19,20,15];
	var prefElements = [];
	var slot = "";

	for(var i = 0; i < prefSlots.length; i++){
		prefElements.push(document.getElementById("svg_"+prefSlots[i]));
	}

	for(var j = 0; j < prefElements.length; j++){
		if(prefElements[j].getAttribute("fill") == "#ffffff"){
			slot = prefElements[j].id.split("_")[1];
			return slot;
		}
	}

	$("rect").filter(function(){
		var a = document.getElementById($(this).attr('id'));
		//get only white slots
		if(a.getAttribute("fill") == "#ffffff"){
			slot = a.id.split("_")[1];
			return;
		}
	});

	return slot;

};

var resetSVG = function(){
	$("rect").filter(function(){
		if($(this).attr("class") == "orangeSlot"){
			$(this).attr("fill", "#ffb752");
		}else if($(this).attr("class") == "redSlot"){
			$(this).attr("fill", "#d15b47");
		}else if($(this).attr("class") == "blueSlot"){
			$(this).attr("fill", "#6fb3e0");
		}else if($(this).attr("class") == "greenSlot"){
			$(this).attr("fill", "#87b87f");
		}else if($(this).attr("class") == "purpleSlot"){
			$(this).attr("fill", "#bbaadd");
		}else if($(this).attr("class") == "yellowSlot"){
			$(this).attr("fill", "#e6ec8b");
		}else{
			$(this).attr("fill", "#ffffff");
		}
	});
};

var updateSVGFill = function(dates, tripId){
	if(dates == null){
		dates = getSelectedAndNextDay();
	}

	if(tripId == null){
		tripId = Trips.findOne(Session.get('tripId'))._id;
	}

	resetSVG();
	books = [];

	if(!Session.get("isEditing") && !Session.get("changeSlots")){
		books = Books.find({
			dateOfBooking : {$gte: dates.selectedDay, $lt: dates.nextDay},
			'product._id' : Session.get('productId'),
			'trip._id' : tripId,
			$or: [ { bookStatus: "Booked"}, { bookStatus: "Waiting Payment (credit card)" } ]
		}).fetch();

		cartBooks = CartItems.find({
			dateOfBooking : {$gte: dates.selectedDay, $lt: dates.nextDay},
			'product._id' : Session.get('productId'),
			'trip._id' : tripId,
			$or: [ { bookStatus: "Booked"}, { bookStatus: "Waiting Payment (credit card)" } ]
		}).fetch();
	}else{
		tripId = $("#destination").val();

		if(Session.get("changeSlots"))
			tripId = Session.get("tripId");

		books = Books.find({
			cartId : getCartIdOperator(),
			dateOfBooking : {$gte: dates.selectedDay, $lt: dates.nextDay},
			'product._id' : Session.get('productId'),
			'trip._id' : tripId,
			$or: [ { bookStatus: "Booked"}, { bookStatus: "Waiting Payment (credit card)" } ],
			_id: {$not : Session.get("bookId") }
		}).fetch();
	}

	for (var i = cartBooks.length - 1; i >= 0; i--) {
		books.push(cartBooks[i]);
	};

	//Update Boat Status SVG
	for (var i = books.length - 1; i >= 0; i--) {
		if(books[i].slot){
			var slot = books[i].slot.split("-");
			for (var j = slot.length - 1; j >= 0; j--) {
				var svgElement = document.getElementById("svg_"+slot[j]);
				if(svgElement)
					svgElement.setAttribute("fill", "#808080");
			}
		}
	}

	if(Session.get("bookId")){
		//Update Boat Status SVG - Change Slots
		var book = Books.findOne(Session.get("bookId"));

		var slotEdit = book.slot.split("-");
		for(i = 0; i < slotEdit.length; i++){
			var svgElementEdit = document.getElementById("svg_"+slotEdit[i]);
			if(svgElementEdit)
				svgElementEdit.setAttribute("fill", "#c7c7c7");
		}
	}

	//on Some cases the find do not work on client side and this is sad.
	//so try to get the books on server side
	if(books.length == 0){
		Meteor.call("getBooksToFill", dates, tripId, Session.get("productId"), function(err, result){
			if(err){
				console.log(err);
			}else{
				fillWithServer(result);
			}
		});
	}
};

var fillWithServer = function(books){
	resetSVG();
	for (var i = books.length - 1; i >= 0; i--) {
		if(books[i].slot){
			var slot = books[i].slot.split("-");
			for (var j = slot.length - 1; j >= 0; j--) {
				var svgElement = document.getElementById("svg_"+slot[j]);
				if(svgElement)
					svgElement.setAttribute("fill", "#808080");
			}
		}
	}

	if(Session.get("bookId")){
		//Update Boat Status SVG - Change Slots
		var book = Books.findOne(Session.get("bookId"));

		var slotEdit = book.slot.split("-");
		for(i = 0; i < slotEdit.length; i++){
			var svgElementEdit = document.getElementById("svg_"+slotEdit[i]);
			if(svgElementEdit)
				svgElementEdit.setAttribute("fill", "#c7c7c7");
		}
	}
};

var updateDataPieChart = function(){
	totalSpace = 0;
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));

	updateSVGFill(dates, trip._id);

	books = Books.find({
		dateOfBooking : {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' : Session.get('productId'),
		'trip._id' : trip._id,
		$or: [ { bookStatus: "Booked"}, { bookStatus: "Waiting Payment (credit card)" } ]
	}).fetch();

	var regularSlots = 0;
	var qtdRegular = 0;
	var extraSlots = 0;
	var qtdExtra = 0;
	var doorSlots = 0;
	var qtdDoor = 0;
	var unallocated = 43;

	for (var i = 0; i < books.length; i++) {
		//count cars
		if(books[i].slot.indexOf("X") != -1){
			qtdExtra++;
		}else if(books[i].slot.indexOf("D") != -1){
			qtdDoor++;
		}else if(books[i].slot){
			qtdRegular++;
		}

		//count metters
		slotArray = books[i].slot.split("-");
		for (var j = slotArray.length - 1; j >= 0; j--) {
			if(slotArray[j].indexOf("X") != -1){
				extraSlots++;
				unallocated--;
			}else if(slotArray[j].indexOf("D") != -1){
				doorSlots++;
				unallocated--;
			}else if(slotArray[j] != ""){
				regularSlots++;
				unallocated--;
			}
		}
	}

	$("#regularSlotsAlocated").text(regularSlots*5);
	$("#doorSlotsAlocated").text(doorSlots*5);
	$("#spaceAlocatedSlot").text(extraSlots*5);
	Session.set("regularCars", qtdRegular);
	Session.set("doorCars", qtdDoor);
	Session.set("extraCars", qtdExtra);


	percentages = {
		regularSlots : regularSlots,
		extraSlots : extraSlots,
		doorSlots : doorSlots,
		unallocated : unallocated
	};

	return percentages;
};

///////////////////////////////////////////
//Template Book Operator
Template.bookOperator.rendered = function() {
	var nowTemp = new Date();
	var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
	localStorage.setItem('date', now);
	$('#currentSeason').text(currentSeason());
};

Template.productItem.featured = function(id){
	return Products.findOne({'_id' : id}).featured;
};

Template.productItem.rendered = function(){
	var nowTemp = new Date();
	var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);

	$('.calendar').datepicker({
			format : "dd/mm/yyyy"
		}).on('changeDate', function(ev){
			date = new Date(ev.date);

			var timezone = date.getTimezoneOffset();

			var fixDate = new Date(date.getTime() + timezone * 60000);

			with(fixDate){
				setDate(getDate());
				setHours(0);
				setMinutes(0);
				setSeconds(0);
			}

			localStorage.setItem('date', fixDate);
			$('#currentSeason').text(currentSeason());
		});
	if(isCustomer()){
		$('.calendar').datepicker("setStartDate", now);
	}
 };


Template.productItem.events({
	'click .calendar' : function(event){
		var today = new Date(localStorage.getItem('date'));
		var appendTrips = [];
		var trips = Trips.find({productId: this._id, active : true}).fetch();

		var appendTripsHour = function(trip){
			date = new Date(localStorage.getItem('date'));
			currentDate = new Date();
			hourSplit = trip.hour.split(":");
			with(date){
				setHours(hourSplit[0] - 1);
				setMinutes(hourSplit[1]);
			}

			if(currentDate.getTime() <= date.getTime()){
				return true;
			}

			if(!isCustomer())
				return true;

			return false;

		};

		for (var i = 0; i < trips.length; i++) {
			if(trips[i].season == 'noSeason'){
				if(today >= new Date(trips[i].availableDays.start) && today <= new Date(trips[i].availableDays.end)){
					if(appendTripsHour(trips[i]))
						appendTrips.push(trips[i]);
				}
			}else if(trips[i].season == currentSeason()){
				if(appendTripsHour(trips[i]))
					appendTrips.push(trips[i]);
			}
		}


		//Remove all previous options
		$('#trip_'+this._id).find('option').remove();
		for (i = appendTrips.length - 1; i >= 0; i--) {
			//Append new options
			$('#trip_'+this._id).append("<option value="+appendTrips[i]._id+" data-from="+appendTrips[i].from+">"+appendTrips[i].from +" - "+appendTrips[i].to + " - " +appendTrips[i].hour+"</option>");
		}
		if(appendTrips.length == 0){
			$('#trip_'+this._id).append("<option disabled>No trips available for this day</option>");
			$('#button_'+this._id).attr("disabled", "disabled");
		}else{
			$('#button_'+this._id).removeAttr("disabled");
		}
	}
});

Template.bookOperator.helpers({
	'featProduct' : function(){
		var i;
		if(Meteor.user()){
			group = Groups.findOne({_id: Meteor.user().profile.groupID});
			if(group){
				if(group.type == 'internal'){
					return Products.find({active : true, featured : true});
				}
			}else{
				showProducts = [];
				products =  Products.find({active : true, featured : true}).fetch();
				for (i = 0; i < products.length; i++) {
					group = Groups.findOne({_id : products[i].availableFor});
					if(group && group.name == 'Customers'){
						showProducts.push(products[i]);
					}else if(Meteor.user()){
						if(products[i].availableFor == getGroupId(Meteor.user().profile.customerId))
						showProducts.push(products[i]);
					}
				}

				return showProducts;
			}
		}else{
			showProducts = [];

			products =  Products.find({active : true, featured : true}).fetch();
			for (i = 0; i < products.length; i++) {
				group = Groups.findOne({_id : products[i].availableFor});
					if(group && group.name == 'Customers'){
						showProducts.push(products[i]);
					}
			}

			return showProducts;
		}
	},

	'product' : function(){
		var i;
		if(Meteor.user()){
			group = Groups.findOne({_id: Meteor.user().profile.groupID});
			if(group){
				if(group.type == 'internal'){
					return Products.find({active : true, featured : false}, {sort : {order : 1}});
				}
			}else{
				showProducts = [];
				products =  Products.find({active : true, featured : false}, {sort : {order : 1}}).fetch();
				for (i = 0; i < products.length; i++) {
					group = Groups.findOne({_id : products[i].availableFor});
					if(group && group.name == 'Customers'){
						showProducts.push(products[i]);
					}else if(Meteor.user()){
						if(products[i].availableFor == getGroupId(Meteor.user().profile.customerId))
						showProducts.push(products[i]);
					}
				}

				return showProducts;
			}
		}else{
			showProducts = [];

			products =  Products.find({active : true, featured : false}, {sort : {order : 1}}).fetch();
			for (i = 0; i < products.length; i++) {
				group = Groups.findOne({_id : products[i].availableFor});
					if(group && group.name == 'Customers'){
						showProducts.push(products[i]);
					}
			}

			return showProducts;
		}
	}
});

currentSeason = function(){
	var today = localStorage.getItem('date') ? new Date(localStorage.getItem('date')) : new Date();

	settingsWinterDate = Settings.findOne("winter").winterStartDate;
	settingsSummerDate = Settings.findOne("summer").summerStartDate;

	splitWinter = settingsWinterDate.split("/");
	splitSummer = settingsSummerDate.split("/");

	winterDate = new Date(splitWinter[1]+"/"+splitWinter[0]+'/'+today.getFullYear());
	summerDate = new Date(splitSummer[1]+"/"+splitSummer[0]+'/'+today.getFullYear());

	if(today.getTime() >= summerDate.getTime() && today.getTime() < winterDate.getTime()){
		return 'summer';
	}else{
		return 'winter';
	}
};

getGroupId = function(customerId){
	customer = Customers.findOne({_id : customerId});
	if(customerId){
		group = Groups.findOne({_id : customer.groupId});
		if(group)
			return group._id;
		else
			return 0;
	}else{
		return 0;
	}
};

Template.bookOperator.bookingDate = function(){
	var date = (localStorage.getItem('date') ? new Date(localStorage.getItem('date')) : new Date()).toLocaleDateString();
	return date;
};

Template.bookOperator.currentSeason = function(){
	return currentSeason();
};


Template.bookOperator.events({
	'change .trip': function(event) {
		setCalendarCapacity($(event.currentTarget).closest('li').find('.calendar'));
	},
	'click .proceed': function(event){
		var productId = $(event.currentTarget).parents('li')[0].id,
        select = $('#trip_' + productId);

  var blocking = BlockingDates.findOne({'type' : 'blockDate' ,'blockedDay': '0'+(new Date(localStorage.getItem('date'))).toLocaleDateString() ,'tripId' : select.val()});
	if(blocking){
		bootbox.alert("Trips not available for this route on this day. Please Select Another Day");
		return;
	}

  var bwday = BlockingDates.findOne({'type' : 'blockWeekDay', 'tripId' : select.val()});
  if(bwday){
	var blockWeekDayTable = bwday.availableWeekDays.split(",");
		if (blockWeekDayTable[new Date(localStorage.getItem('date')).getDay()] == "false"){
			bootbox.alert("Trips not available for this route on this day. Please Select Another Day");
		return;
		}
	}

		var persons = 0;
		book = Books.find({'trip._id' : select.val()}).fetch();
		for (var j = 0; j < book.length; j++){
			for (var i = 0; i < book[j].prices.length; i++) {
				if(book[j].prices[i].price != "Operator Fee")
					persons = parseInt(persons + parseInt(book[j].prices[i].persons));
		}}
		var pAvailability = BlockingDates.findOne({'type' : 'passagersAvailability', 'tripId' : select.val()});
		if(pAvailability){
			if(persons == pAvailability.passagersAvailability){
			bootbox.alert("Trips no longer available for this route we're already full. Please Select Another Day");
			return;
			}
		}

    if(select[0].checkValidity()){
			Session.set('tripId',select.val());
			if(!isCustomer()){
				Session.set("isEditing", false);
				Meteor.Router.to("/bookOperator/" + $(event.currentTarget).parents('li')[0].id);
			}
			else{
				Session.set('productId', productId);
				Session.set('dateSelected', true);
				Session.set('SaveCustomer', true);
				formBook();
			}
		}else{
      showPopover(select, 'Choose the trip');
    }
  }
});

function setCalendarCapacity (calendar) {
	var date = new Date(),
	days = $('.ui-datepicker-calendar:first a').length,
	from = calendar.closest('li').find('select')[0].selectedOptions[0].getAttribute('data-from'),
	product = Products.findOne(calendar.closest('li')[0].id),
	maxCapacity = Boats.findOne(product.boatId).maxCapacity,
	bookings = [];

	date.setMonth(calendar.attr('data-month') - 1);
	date.setYear(calendar.attr('data-year'));
	date.setHours(0, 0, 0);

	$('.isFull').removeClass('isFull');

	for (var j = 1; j <= days; j++) {
		date.setDate(j + 1);
		bookings = Books.find({dateOfBooking: {$gte: new Date(date.getFullYear(), date.getMonth(), j), $lt:date}, 'product._id': product._id, 'trip.from': from});

		if(bookings.count() >= maxCapacity)
			$(calendar).find('tbody a:eq(' + (j - 1) + ')').addClass('isFull');
	}
}

///////////////////////////////////////////
//Template Book Detail
Template.bookDetail.rendered = function() {
	Session.set("bookId", null);
	loadTypeAheadInitials();
	var oTable = $('#passengers').dataTable({
		"iDisplayLength": 50,
		"bServerSide": false,
		"bDestroy": true
	});
	oTable.fnSort( [ [1,'asc'], [6,'desc'] ] );

	var otherTable = $("#waitingListTable").dataTable({
		"iDisplayLength": 50,
		"bServerSide": false,
		"bDestroy": true
	});

	otherTable.fnSort( [ [1,'asc'], [6,'desc'] ] );

	var anotherTable = $("#canceledListTable").dataTable({
		"iDisplayLength": 50,
		"bServerSide": false,
		"bDestroy": true
	});

	anotherTable.fnSort( [ [1,'asc'], [6,'desc'] ] );

	$('#boatSlots').dataTable();
	product = Products.findOne(Session.get('productId'));
	if(BoatStatus.findOne({boatId : product.boatId})){
		drawPieChartBoatSlots();
		Session.set("haveStatus", true);
	}else{
		Session.set("haveStatus", false);
		$(".noStatus").hide();
	}
	$("#confirmActionModal").hide();
	$("#svgBoatDialog").hide();
	returnPersons();
};

Template.bookDetail.ticketNotPrinted = function(id){
	return !Books.findOne({_id : id}).ticketPrinted;
};

Template.bookDetail.notes = function(bookId){
	var notes =  Notes.find({
		bookId: bookId,
		$or: [ { type: "Customer Note"}, { type: "Stop at flatey" } ]
	}).fetch();

	return  (notes.length > 0);
};

Template.bookDetail.fullname = function(id){
	return Customers.findOne({_id: id}).fullName;
};

Template.bookDetail.telephone = function(id){
	var customer = Customers.findOne({_id: id});
	if(customer)
		return "("+customer.telephoneCode+") "+customer.telephone;
	else
			return "";
};

Template.bookDetail.trip = function(){
	return  Trips.findOne(Session.get('tripId'));
};

Template.bookDetail.totalPassagers = function(id){
	var persons = 0;
	book = Books.findOne({_id : id});
	for (var i = 0; i < book.prices.length; i++) {
		if(book.prices[i].price != "Operator Fee")
			persons = parseInt(persons + parseInt(book.prices[i].persons));
	}
	return persons;
};

Template.bookDetail.totalPersons = function(){
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));

	var persons = 0;

	books = Books.find({
		dateOfBooking : {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' : Session.get('productId'),
		'trip._id' : trip._id,
		$or: [ { bookStatus: "Booked"}, { bookStatus: "Waiting Payment (credit card)" } ]
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		for (var j = 0; j < books[i].prices.length; j++) {
			if(books[i].prices[j].price != "Operator Fee")
				persons = parseInt(persons + parseInt(books[i].prices[j].persons));
		}
	}

	return persons;
};

Template.bookDetail.totalPersonsWaiting = function(){
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));

	var persons = 0;

	books = Books.find({
		dateOfBooking : {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' : Session.get('productId'),
		'trip._id' : trip._id,
		'slot' : /.*W.*/
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		for (var j = 0; j < books[i].prices.length; j++) {
			if(books[i].prices[j].price != "Operator Fee")
				persons = parseInt(persons + parseInt(books[i].prices[j].persons));
		}
	}

	return persons;
};


Template.bookDetail.totalPersonsCanceled = function(){
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));

	var persons = 0;

	books = Books.find({
		dateOfBooking : {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' : Session.get('productId'),
		'trip._id' : trip._id,
		bookStatus : "Canceled"
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		for (var j = 0; j < books[i].prices.length; j++) {
			if(books[i].prices[j].price != "Operator Fee")
				persons = parseInt(persons + parseInt(books[i].prices[j].persons));
		}
	}

	return persons;
};


Template.createBook.dateSelected = function(){
	return !Session.get('dateSelected');
};

Template.createBook.isSummer = function(){
	if(currentSeason() == "summer"){
		return true;
	}
	return false;
};

Template.createBook.isWinter = function(){
	if(currentSeason() == "winter"){
		return true;
	}
	return false;
};

Template.generalPassagerInfo.dateSelected = function(){
	return !Session.get('dateSelected') && !Session.get('creatingUser') && !Session.get("finishBooking");
};

Template.generalPassagerInfo.groups = function(){
	return Groups.find({type : "external"});
};

Template.generalPassagerInfo.groupCustomer = function(id){
	customer = Customers.findOne({_id : Session.get("customerId")});
	if(customer){
		return customer.groupId == id;
	}else{
		return false;
	}
};

Template.generalPassagerInfo.isEditingCustomer = function(){
	return Session.get('editingCustomer');
};

Template.generalPassagerInfo.isCustomer = function(){
	return isCustomer();
};

returnPersons = function(){
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));

	var adults = 0;
	var childrens = 0;
	var infants = 0;
	var seniors = 0;
	var schoolDiscount = 0;
	var guidesAndDrivers = 0;

	books = Books.find({
		dateOfBooking : {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' : Session.get('productId'),
		'trip._id' : trip._id,
		$or: [ { bookStatus: "Booked"}, { bookStatus: "Waiting Payment (credit card)" } ]
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		for (var j = 0; j < books[i].prices.length; j++) {
			if(books[i].prices[j].price == 'Adult'){
				adults = parseInt(adults + parseInt(books[i].prices[j].persons));
			}
			if(books[i].prices[j].price == 'Child'){
				childrens = parseInt(childrens + parseInt(books[i].prices[j].persons));
			}
			if(books[i].prices[j].price == 'Infant'){
				infants = parseInt(infants + parseInt(books[i].prices[j].persons));
			}
			if(books[i].prices[j].price == 'Senior'){
				seniors = parseInt(seniors + parseInt(books[i].prices[j].persons));
			}
			if(books[i].prices[j].price == 'School Discount'){
				schoolDiscount = parseInt(schoolDiscount + parseInt(books[i].prices[j].persons));
			}
			if(books[i].prices[j].price == 'Guides and Drivers'){
				guidesAndDrivers = parseInt(guidesAndDrivers + parseInt(books[i].prices[j].persons));
			}
		}
	}

	$('#numberOfAdults').text(adults);
	$('#numberOfChildrens').text(childrens);
	$('#numberOfInfants').text(infants);
	$('#numberOfSeniors').text(seniors);
	$('#numberOfSchoolDiscount').text(schoolDiscount);
	$('#numberOfGuideAndDrivers').text(guidesAndDrivers);

};

var formBook = function(){
	Session.set("isEditing", false);
	Session.set("firstTime", false);
	Session.set("categoryId", null);

	var bookingsCreated = Books.find({
		dateOfBooking: new Date(localStorage.getItem('date')),
		'product._id': Session.get('productId'),
		$or: [ { bookStatus: "Booked"}, { bookStatus: "Waiting Payment (credit card)" } ]
	});

	if(bookingsCreated.length >= MaxCapacity){
		throwError('Maximum capacity of passengers reached!');
	}
	else if(!isCustomer()){
		Session.set('SaveCustomer', true);
		Meteor.Router.to("/bookOperator/" + Session.get('productId') + '/new');
	}

};

//Global Vars
var MaxCapacity = 0;

Template.bookDetail.events({
	'click #newBooking' :function(event) {
		formBook();
	},

	'click .seeHistory' : function(event){
		event.preventDefault();

		rel = event.currentTarget.rel;

		Session.set("goToHistory", true);

		Meteor.Router.to("/bookDetailResume/"+rel);
	},

	'click .goToNotes' : function(event){
		event.preventDefault();

		rel = event.currentTarget.rel;

		Session.set("goToNotes", true);

		Meteor.Router.to("/bookDetailResume/"+rel);
	},

	'click #printResume' : function(event){
		event.preventDefault();
		$('#pageHeader').printElement();
	},

	'click #seeBoatStatusSVG' : function(event){
		$("rect").filter(function(){
			var id = $(this).attr("id");
			document.getElementById(id).setAttribute("stroke", "#000000");
		});
		updateSVGFill();
		$("#svgBoatDialog").show();
	},

	'submit #confirmActionForm' : function(event){
		event.preventDefault();
		Session.set("operatorName", $("#initialsResultConfirm").val());
		if(Session.get("callbackAction") == 'confirmBook'){
			confirmBook($("#initialsResult").val());
		}else if(Session.get("callbackAction") == 'invoicesSent'){
			invoicesSent($("#initialsResult").val());
		}else if(Session.get("callbackAction") == 'printTicket'){
			ticketsPrinted($("#initialsResult").val());
		}else if(Session.get("callbackAction") == 'quickPay'){
			quickPay($("#initialsResult").val());
		}else if(Session.get("callbackAction") == 'cancelBook'){
			cancelBook($("#initialsResult").val());
		}else if(Session.get("callbackAction") == 'changeSlot'){
			changeSlot($("#initialsResult").val());
		}else if(Session.get("callbackAction") == 'removeBooking'){
			removeBooking($("#initialsResult").val());
		}
	},

	'click .editSlot' : function(event){
		event.preventDefault();
		$("rect").filter(function(){
			var id = $(this).attr("id");
			document.getElementById(id).setAttribute("stroke", "#000000");
		});

		var a = event.currentTarget;
		$("#slotsToUpdate").val("");
		Session.set("changeSlots", true);
		Session.set("bookId", a.rel);
		updateSVGFill();
		$("#headerDialog").text("Change Slots");
		$(".svgDialog").append('<a href="#" class="btn btn-success confirmChangeSlot" style="float: right">Change Slots</a>');
		$("#svgBoatDialog").show();
	},

	'click .close, click .cancel' : function(event){
		$("#confirmActionModal").hide();
		$("#headerDialog").text("Current Boat Status");
		$("#svgBoatDialog").hide();
		Session.set("bookId", null);
		Session.set("changeSlots", null);
		$('.confirmChangeSlot').remove();
		$("#slotsToUpdate").val("");
	},

	'click .confirmChangeSlot' : function(event){
		event.preventDefault();
		Session.set("callbackAction", "changeSlot");
		$("#confirmActionModal").show();
		$("#svgBoatDialog").hide();
	},

	'click .removeBook' : function(event){
			event.preventDefault();
			var a = event.currentTarget;
			bootbox.confirm("Are you sure? Clicking this will remove the Booking!!!", function(result){
				if(result){
					var book = Books.findOne({'_id' : a.rel});
					Session.set("confirmBook", book);
					Session.set("callbackAction", "removeBooking");
					$("#confirmActionModal").show();
				}
			});
	},

	'click rect' : function(event){
		event.preventDefault();

		if(Session.get("changeSlots")){
			var id = event.target.id;
			svgElement = document.getElementById(id);
			var stroke = svgElement.getAttribute("stroke");
			var fill = svgElement.getAttribute("fill");
			var text;
			if(stroke == "#000000" && fill != "#808080"){
				text = $("#slotsToUpdate").val();
				if(text == ""){
					text+=id.split("_")[1];
				}else{
					text+="-"+id.split("_")[1];
				}
				$("#slotsToUpdate").val(text);
				svgElement.setAttribute("stroke","#00d2ff");
			}else{
				text = "";
				var textSplit = $("#slotsToUpdate").val().split("-");
				for (var i = 0; i < textSplit.length; i++) {
					if(textSplit[i] != id.split("_")[1]){
						if(text == ""){
							text += textSplit[i];
						}else{
							text += "-"+textSplit[i];
						}
					}
				}
				$("#slotsToUpdate").val(text);
				svgElement.setAttribute("stroke","#000000");
			}
		}
	},

	'click .editBookOperator' : function(event){

		var a = event.currentTarget;

		Session.set('isEditing', true);
		Session.set("firstTime", true);
		Session.set("firstTimePrice", true);
		Session.set("bookId", a.rel);
		book = Books.findOne({_id: a.rel});
		product = Products.findOne({_id: book.product._id});
		Session.set("customerId", book.customerId);
		Session.set("productId", product._id);
		Session.set("bookingDate", book.dateOfBooking);
		Session.set('tripId', book.trip._id);
		Meteor.Router.to('/bookEdit');
	},

	'click .quickPay' : function(event){
		event.preventDefault();
		var a = event.currentTarget;
		bootbox.confirm("Are you sure? Clicking this will make the Booking Paid", function(result){
			if(result){
				var book = Books.findOne({'_id' : a.rel});
				Session.set("confirmBook", book);
				Session.set("callbackAction", "quickPay");
				$("#confirmActionModal").show();
			}
		});
	},

	'click .printTicket' : function(event){
		event.preventDefault();
		var id = event.currentTarget.rel;
		var book = Books.findOne({'_id' : id});
		Session.set("confirmBook", book);
		Session.set("callbackAction", "printTicket");
		$("#confirmActionModal").show();
	},

	'click .changeStatusBooking' : function(event) {
		event.preventDefault();
		var a = event.currentTarget;
		bootbox.confirm('Are you sure? Clicking this will make the Booking Canceled', function(result){
			if(result){
				var book = Books.findOne(a.rel);
				Session.set("confirmBook", book);
				Session.set("callbackAction", "cancelBook");
				$("#confirmActionModal").show();
			}
		});
	},

	'click .confirmBook' :function(event) {
		event.preventDefault();
		var id = event.currentTarget.rel;
		book = Books.findOne({_id : id});
		Session.set("confirmBook", book);
		Session.set("callbackAction", "confirmBook");
		$("#confirmActionModal").show();
	},


	'click .invoicesSent' :function(event) {
		event.preventDefault();
		var id = event.currentTarget.rel;
		book = Books.findOne({_id : id});
		Session.set("confirmBook", book);
		Session.set("callbackAction", "invoicesSent");
		$("#confirmActionModal").show();
	}
});

var removeBooking = function(operatorName){
	var book = Session.get("confirmBook");

	Books.update(book._id, {$set : {bookStatus : "REMOVED"}});

	saveHistoryAction(book, "Removed book: "+book.refNumber, operatorName);
};

var changeSlot = function(operatorName){
	var book = Books.findOne(Session.get("bookId"));
	var newSlots = $("#slotsToUpdate").val();

	Books.update(Session.get("bookId"), {$set : {slot : $("#slotsToUpdate").val()}});
	throwSuccess("Slots Changed!");
	$("#headerDialog").text("Current Boat Status");

	$('.confirmChangeSlot').remove();
	$("#slotsToUpdate").val("");

	saveHistoryAction(book, "Change Slot: FROM: "+book.slot + "--- TO: "+newSlots, operatorName);

	Session.set("bookId", null);
	Session.set("changeSlots", null);
};

var cancelBook = function(operatorName){
	book = Session.get("confirmBook");
	var vendor = Meteor.user().profile.name;

	var dateToday = new Date();
	var dateTodayFixed = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate(), 0,0,0);
	var dateOfBookingFixed = new Date(book.dateOfBooking.getFullYear(), book.dateOfBooking.getMonth(), book.dateOfBooking.getDate(),0,0,0);
	var aDayPreviousBookingDate = new Date(book.dateOfBooking.getFullYear(), book.dateOfBooking.getMonth(), (book.dateOfBooking.getDate() -1), 0,0,0);
	var totalISK = book.totalISK;

	var valueFees;
	if(dateTodayFixed >= aDayPreviousBookingDate){
		valueFees = -3000;
	}else{
		valueFees = parseInt(totalISK * 0.05);
		valueFees = 0-valueFees;
	}
	var transaction = {
			'bookId' : book._id,
			'date' : dateToday,
			'status' : 'Given',
			'amount' : valueFees,
			'detail' : "Cancelation Fee",
			'vendor' : vendor,
			'type' : 'CancelationFine'
	};
	Transactions.insert(transaction);


	var thisBookingTransactions = Transactions.find({'bookId' : book._id}).fetch();
	var totalTransactions = 0;
	for (var i = thisBookingTransactions.length - 1; i >= 0; i--) {
		totalTransactions = parseInt(totalTransactions) + parseInt(thisBookingTransactions[i].amount);
	}
	Books.update(book._id, {$set : {bookStatus: 'Canceled'}});

	var transactionRefund = {
			'bookId' : book._id,
			'date' : dateToday,
			'status' : 'Given',
			'amount' :  parseInt(book.totalISK) + valueFees,
			'detail' : "Refund provinent from a Cancelation",
			'vendor' : vendor,
			'type' : 'Refund'
	};
	Transactions.insert(transactionRefund);

	Books.update(book._id, {$set : {bookStatus: 'Canceled'}});
	saveHistoryAction(book, "Book Canceled", operatorName);
};

var quickPay = function(operatorName){
	var currentBooking = Session.get("confirmBook");
	var vendor = Meteor.user().profile.name;
	var transaction = {
			'bookId' : currentBooking._id,
			'date' : new Date(),
			'status' : 'Given',
			'amount' : parseInt(currentBooking.totalISK),
			'detail' : "Quick Paid",
			'vendor' : vendor,
			'type' : 'Office Cash'
		};
	Transactions.insert(transaction);
	Books.update(currentBooking._id, {$set : {'paid' : true}});

	saveHistoryAction(currentBooking, "Marked as Paid", operatorName);
};



var confirmBook = function(operatorName){
	book = Session.get('confirmBook');
	action = "";
	if(book.confirm){
		Books.update(book._id, {$set : {confirm : false}});
		action = 'Confirm Booking Removed';
		throwInfo('Confirm Booking Removed!');
	}else{
		Books.update(book._id, {$set : {confirm : true}});
		action = 'Booking Confirmed';
		throwInfo('Booking Confirmed!');
	}

	saveHistoryAction(book, action, operatorName);
};

var invoicesSent = function (operatorName){
	book = Session.get('confirmBook');
	action = "";
	if(book.invoicesSent){
		Books.update(book._id, {$set : {invoicesSent : false}});
		action = 'Invoices Sent Removed';
		throwInfo('Invoices Sent Removed!');
	}else{
		Books.update(book._id, {$set : {invoicesSent : true}});
		action = 'Invoices Sent';
		throwInfo('Invoices Sent');
	}

	saveHistoryAction(book, action, operatorName);
};

var ticketsPrinted = function (operatorName){
	book = Session.get('confirmBook');
	action = "";
	if(book.ticketPrinted){
		Books.update(book._id, {$set : {ticketPrinted : false}});
		action = 'Canceled Ticket Printed';
		throwInfo('Canceled Ticket Printed!');
	}else{
		Books.update(book._id, {$set : {ticketPrinted : true}});
		action = 'Ticket Printed';
		throwInfo('Ticket Printed!');
	}

	saveHistoryAction(book, action, operatorName);
};

Template.bookDetail.flatey = function(id){
	note = Notes.findOne({bookId : id, type : "Stop at flatey"});
	console.log(note);
	if(note)
		return true;
	else
		return false;
};


Template.bookDetail.helpers({
	boat: function() {
		var boatId = Products.findOne({_id: Session.get('productId')}).boatId;
		var boat = Boats.findOne({_id: boatId});
		MaxCapacity = boat.maxCapacity;
		return boat;
	},

	product: function() {
		Product = Products.findOne(Session.get('productId'));
		return Product;
	},

	date: function() {
		date = new Date(localStorage.getItem('date'));
		return date.toUTCString().slice(5,17);
	},

	bookingsWaiting : function(){

		var date = new Date(localStorage.getItem('date')),
		trip = Trips.findOne(Session.get('tripId')),
		currentDate = new Date(localStorage.getItem('date'));

		with(date){
			setDate(getDate() + 1);
		}

		return Books.find({
			dateOfBooking : {$gte: currentDate, $lt: date},
			'product._id' : Session.get('productId'),
			'trip._id' : trip._id,
			$or : [{'pendingApproval': true}, {slot : /.*W.*/}],
			$and : [{bookStatus : {$not : "Canceled"}}, {bookStatus : {$not : "REMOVED"}}]
		});
	},

	bookingsCanceled : function(){

		var date = new Date(localStorage.getItem('date')),
		trip = Trips.findOne(Session.get('tripId')),
		currentDate = new Date(localStorage.getItem('date'));

		with(date){
			setDate(getDate() + 1);
		}

		return Books.find({
			dateOfBooking : {$gte: currentDate, $lt: date},
			'product._id' : Session.get('productId'),
			'trip._id' : trip._id,
			'bookStatus': 'Canceled'
		});
	},

	bookings : function(){
		var date = new Date(localStorage.getItem('date')),
		trip = Trips.findOne(Session.get('tripId')),
		currentDate = new Date(localStorage.getItem('date'));

		with(date){
			setDate(getDate() + 1);
		}

		return Books.find({
			dateOfBooking : {$gte: currentDate, $lt: date},
			'product._id' : Session.get('productId'),
			'trip._id' : trip._id,
			slot : {$not : /.*W.*/ },
			$and : [{bookStatus : {$not : "Canceled"}}, {bookStatus : {$not : "REMOVED"}}]
		});
	},

	isBookCreated : function(status) {
		return status == 'Booked';
	},

	isBookingNotFull: function(totalPersons, boatCapacity) {
		var isValidDate = true,
		selectedDate = new Date(localStorage.getItem('date'));
		date = new Date();

		with(date){
			setHours(0);
			setMinutes(0);
			setSeconds(0);
			setMilliseconds(0);
		}

		if(selectedDate < date)
			isValidDate = false;

		return isValidDate || !isCustomer();
	},

	bookingsCreated : function(){
		return Books.find({dateOfBooking: new Date(localStorage.getItem('date')), 'product._id': Session.get('productId'), bookStatus : "Booked"});
	},

	lineColor : function(paid, bookStatus, ticketPrinted){
		if(paid && bookStatus == "Booked" && !ticketPrinted){
			return 'green';
		}else if(paid && bookStatus == "Booked" && ticketPrinted){
			return 'purple';
		}else if(paid && bookStatus == 'Canceled'){
			return 'orange';
		}else{
			return "red";
		}
	}
});

///////////////////////////////////////////
//Template Create Book
Template.createBook.productName = function(){
	return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).name : "" ;
};

Template.createBook.getDisclaimer = function(){
	return Session.get("productId") ? Products.findOne({_id: Session.get("productId")}).disclaimer : "" ;
};

Template.createBook.currentSeason = function(){
	return currentSeason();
};

Template.createBook.dateOfBooking = function(){
	return new Date(localStorage.getItem('date')).toUTCString().slice(5,17);
};

Template.createBook.booked = function(id){
	if(Session.get('isEditing')){
		if (book.trip._id == id) {
			return true;
		}else{
			return false;
		}
	}else{
		trip = Trips.findOne(Session.get('tripId'));
		if(trip){
			if(trip._id == id){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	}
};

Template.generalButtons.isEditing = function(){
	return Session.get('isEditing');
};

Template.createBook.isEditing = function(){
	return Session.get('isEditing');
};

Template.generalPassagerInfo.isCreatingExternalUser = function(){
	return Session.get('creatingUser') || Session.get('finishBooking');
};

Template.generalPassagerInfo.isCreateUserPage = function(){
	return Session.get('creatingUser');
};

Template.generalButtons.isInquiry = function(){
	return $('#size').val() > 5;
};

Template.generalButtons.rendered = function(){
	$("#bookButton").css("display", "block");
	$("#proceedButton").css("display", "block");
	$("#divAlertSize").css("display", "none");
	$("#inquiryButton").css("display", "none");
};

Template.generalPassagerInfo.previous = function(){
	if(Session.get('previousCustomer') && !Template.generalPassagerInfo.isEditingCustomer()){
		return true;
	}
	return false;
};


Template.productPrices.priced = function(price){
	if(Session.get('isEditing')){
		return _priced(price);
	}else{
		return 0;
	}
};

Template.productPrices.checkForAvailability = function(id){
	if(isCustomer() && !Prices.findOne({'_id' : id}).availableForGuest){
		return false;
	}
	return true;
};

Template.productPrices.minValue = function(price){
	if(price.toUpperCase() == 'ADULT'){
		return 1;
	}else{
		return 0;
	}
};

Template.productPrices.firstTime = function(){
	return Session.get('firstTimePrice') ? true : false;
};

Template.productPrices.firstTimePricing = function(price, unit){
	if(Session.get('isEditing')){
		var parcialTotal = _priced(price) * unit;
		calcTotal();
		return parcialTotal;
	}else{
		return 0;
	}
};

var _priced = function(price){
	for (var i = book.prices.length - 1; i >= 0; i--) {
		if(price == book.prices[i].price){
			return book.prices[i].persons;
		}
	}
	return 0;
};

Template.categoryVehicleBook.sizes = function() {
	return Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}).size : [];
};

Template.categoryVehicleBook.firstTime = function(){
	return Session.get('firstTime') ? true : false;
};

Template.createBook.trips = function(){
	if(Session.get('isEditing')){
		if(Session.get("productId")){
			return Trips.find({productId : Session.get("productId"), active : true});
		}else{
			throwError('Something Bad Happened, Try Again');
			return [];
		}
	}else{
		return Trips.find({productId : Session.get("productId"), season : currentSeason()});
	}
};


Template.createBook.helpers({
	"prices" : function(){
		if(Session.get("productId")){
			trip = Trips.findOne({_id : Session.get('tripId')});
			if(trip.availableDays)
				return Prices.find({productId : Session.get("productId"), tripId: Session.get("tripId"), active : true, season: 'both'});
			else
				return Prices.find({productId : Session.get("productId"), tripId: Session.get("tripId"), active : true, season: currentSeason()});
		}else{
			throwError('Something Bad Happened, Try Again');
			return [];
		}
	}
});

Template.createBook.tripSelected = function(){
	return Session.get('tripId');
};

Template.createBook.rendered = function(){
	if(!Session.get("isEditing"))
		Session.set("bookId", null);
	if(CanSaveTheBook){
		$("#divMessageCreateBook").hide();
		$(".addBook").removeAttr('disabled');
		$(".procedToCart").removeAttr('disabled');
	}else{
		$(".addBook").attr('disabled', true);
		$(".procedToCart").attr('disabled', true);
		$("#divMessageCreateBook").show();
	}

	updateSVGFill(getSelectedAndNextDay(), Session.get("tripId"));
	$("#statusDialog").hide();
	$("#svgBoatDialogCreate").hide();

	$('#pasagerInfo').on('submit', function(event){
		event.preventDefault();
	});
	if(Session.get('isEditing')){
		var customer = Customers.findOne({_id: Session.get("customerId")});
		var book = Books.findOne(Session.get("bookId"));

		note = Notes.findOne({bookId : Session.get("bookId"), type : "Stop at flatey"});

		if(note)
			$("#stopAtFlateyInput").attr("checked", true);

		$('#customerId').val(customer._id);
		$('#title').val(customer.title);
		$('#socialSecurityNumber').val(customer.socialSecurityNumber);
		$('#fullName').val(customer.fullName);
		splitBirth = customer.birthDate.split("-");
		$('#birthDaySelect').val(Number(splitBirth[2]));
		$('#birthMonthSelect').val(Number(splitBirth[1]));
		$('#birthYearSelect').val(splitBirth[0]);
		$('#email').val(customer.email);
		$('#telephoneCode').val(customer.telephoneCode);
		$('#telephone').val(customer.telephone);
		$('#adress').val(customer.address);
		$('#addressnumber').val(customer.addressnumber);
		$('#city').val(customer.city);
		$('#state').val(customer.state);
		$('#postcode').val(customer.postcode);
		$('#country').val(customer.country);
		$('#vehicle').val(book.vehicle.vehicleName);
		$('#vehiclePlate').val(book.vehicle.vehiclePlate);
		$('#slotNumber').val(book.slot);

		$('#dayOfBookingEdit').datepicker({
			changeMonth : true,
			changeYear : true,
			format : "dd/mm/yyyy"
		});

		var date = new Date(book.dateOfBooking);
		var splitDate = date.toISOString().split("-");

		var editDate = new Date(day+"/"+splitDate[1]+"/"+splitDate[0]);

		var day = splitDate[2].split("T")[0];

		localStorage.setItem("date", editDate);

		$('#dayOfBookingEdit').val(day+"/"+splitDate[1]+"/"+splitDate[0]);
	}

	$('#passengers').dataTable({
		"iDisplayLength": 50
	});
	$('#boatSlots').dataTable({
		"iDisplayLength": 50
	});


	product = Products.findOne(Session.get('productId'));
	if(BoatStatus.findOne({boatId : product.boatId})){
		Session.set("haveStatus", true);
	}else{
		Session.set("haveStatus", false);
		$(".noStatus").hide();
	}
};

Template.createBook.events({
	'click #boatStatus' : function(){
		$("#statusDialog").show();
	},

	'change #destination' : function(event){
		event.preventDefault();
		Session.set("tripId", event.target.value);
		$("#slotNumber").val("");
		Session.set("loadTrips", false);
		Template.createBook.prices();
	},

	'change #initials' : function(event){
		event.preventDefault();
		$("#initialsResult").val("");
	},

	'change #stopAtFlateyInput' : function(event){
		event.preventDefault();
		if($("#stopAtFlatey").val() == 'false'){
			$("#stopAtFlatey").val(true);
		}else{
			$("#stopAtFlatey").val(false);
		}
	},
	'change #includeOperatorFeeInput' : function(event){
		event.preventDefault();
		if($("#includeOperatorFee").val() == 'false'){
			$("#includeOperatorFee").val(true);
		}else{
			$("#includeOperatorFee").val(false);
		}
		console.log($("#includeOperatorFee").val());
	},

	'click rect' : function(event){
		if(Session.get("previousSlots"))
			removePrevious(Session.get("previousSlots"));

		var id = event.target.id;
		svgElement = document.getElementById(id);
		var stroke = svgElement.getAttribute("stroke");
		var fill = svgElement.getAttribute("fill");
		var text;
		if(stroke == "#000000" && fill != "#808080"){
			text = $("#slotNumber").val();
			if(text == ""){
				text+=id.split("_")[1];
			}else{
				text+="-"+id.split("_")[1];
			}
			$("#slotNumber").val(text);
			svgElement.setAttribute("stroke","#00d2ff");
		}else{
			text = "";
			var textSplit = $("#slotNumber").val().split("-");
			for (var i = 0; i < textSplit.length; i++) {
				if(textSplit[i] != id.split("_")[1]){
					if(text == ""){
						text += textSplit[i];
					}else{
						text += "-"+textSplit[i];
					}
				}
			}
			$("#slotNumber").val(text);
			svgElement.setAttribute("stroke","#000000");
		}

	},

	"click .enabledDoor" : function(){


		if($("#showDoorButton").text() == "Show Door"){
			$("rect[fill = '#87b87f']").show();
			$("text:contains('D')").show();
			$("#showDoorButton").text("Hide Door");
		}else{
			$("rect[fill = '#87b87f']").hide();
			$("text:contains('D')").hide();
			$("#showDoorButton").text("Show Door");
		}

	},

	'click #selectManualy' : function(){
		$("rect").filter(function(){
			$(this).attr("stroke", "#000000");
		});

		book = Books.findOne({slot : {$regex : ".*D.*"}});

		if(Session.get("isEditing")){
			var selectedDate = $("#dayOfBookingEdit").val();
			var arrayOfDate = selectedDate.split("/");
			var date = new Date(arrayOfDate[1]+"-"+arrayOfDate[0]+"-"+arrayOfDate[2]);
			localStorage.setItem("date", date);
			updateSVGFill();
		}


		if(currentSeason() == "winter" && !book){
			$("#showDoorButton").attr("disabled", false);
			$("rect[fill = '#87b87f']").hide();
			$("text:contains('D')").hide();
		}else{
			$("#showDoorButton").attr("disabled", true);
			$("rect[fill = '#87b87f']").show();
			$("text:contains('D')").show();
		}

		var textSplit = $("#slotNumber").val().split("-");
		if($("#slotNumber").val() != ""){
			for (var i = textSplit.length - 1; i >= 0; i--) {
				svgElement = document.getElementById("svg_"+textSplit[i]);
				svgElement.setAttribute("stroke","#00d2ff");
			}
		}

		$("#svgBoatDialogCreate").show();
	},

	'click .cancel, click .close' : function(){
		$("#statusDialog").hide();
		$("#svgBoatDialogCreate").hide();
		Session.set("previousSlots", $("#slotNumber").val());
	},

	'click .searchApisIs' : function(){
		if($("#vehiclePlate").val() != "" && $("#vehiclePlate").val().replace(/ /g,"") != "" ){
			plate = $("#vehiclePlate").val();
			$.blockUI({message : 'Looking for car... Please Wait'});
			$.ajax({
				'url': 'http://apis.is/car',
				'type': 'GET',
				'dataType': 'json',
				'data': {'number': plate},
				'success': function(response) {
					if(response.results[0]){
						$("#vehicle").val("");
						$("#vehiclecolor").val("");
						$("#vehicle").val(response.results[0].type + " " + response.results[0].subType);
					$("#vehiclecolor").val(response.results[0].color);
					throwSuccess('Vehicle found!');
					}else{
						throwError('Vehicle not found, please provide a valid vehicle plate');
					}
				}
			}).done(function(){
				$.unblockUI();
			});
		}else{
			throwError('Please provide a valid vehicle plate');
		}
	}
});

function removePrevious(slots){
	var textSplit = slots.split("-");

	for (var i = textSplit.length - 1; i >= 0; i--) {
		svgElement = document.getElementById("svg_"+textSplit[i]);
		svgElement.setAttribute("stroke","#000000");
	}

	$("#slotNumber").val("");
	Session.set("previousSlots", null);
}

Template.productPrices.events({
	"change input" : function(event){
		Session.set('firstTimePrice', false);
		var totalParcial = event.currentTarget.value * this.unit;
		$('#'+this._id).val(totalParcial);
		var totalPrice = event.currentTarget.value;
		$('#'+this._id).val(totalParcial);
		$('#'+this._id+this.unit).val(this.price+"|"+this.unit+"|"+totalPrice+"|"+totalParcial);

		var total = 0;
		$('.unitPrice').filter(function(){
			var split = $(this).val().split("|");
			if(split[2]){
				total = parseInt(total + parseInt(split[2]));
			}
		});

		checkMaxCapacity(total);
		calcTotal();
	}
});

var checkForAdults = function(){
	var prices = [];

	$('.unitPrice').filter(function(){
		var split = $(this).val().split("|");
		if(split[2]){
			var price = {
			"price" : split[0],
			"perUnit" : split[1],
			"persons" : split[2],
			"sum" : split[3]
		};

			prices.push(price);
		}
	});

	if(prices.length == 0){
		return true;
	}

	for (var i = prices.length - 1; i >= 0; i--) {
		if(prices[i].price == "Adult" && prices[i].persons == 0){
			return true;
		}
	}

	return false;
};

Template.generalButtons.events({
	//Events for identify
	'click .addBook' : function(event){
		if($("#categories").val() != "" && $("#size").val() == "" && !$('#size').is(':disabled')){
			bootbox.alert('Please Inform the size of vehicle');
		}else if(!CanSaveTheBook){
			bootbox.alert("This car can't be on the boat, there is no room for it, this booking can't be created!");
		}else if($("#categories").val() != "" && $("#size").val() != "" && $("#slotNumber").val() == ""){
			throwError("Please Inform the Slots");
		}else if($("#categories").val() != "" && $("#size").val() != null && $("#vehiclePlate").val() == ""){
			bootbox.alert("Please inform the vehicle plate.");
		}else if($("#categories").val() != "" && $("#size").val() != null && $("#vehicle").val() == ""){
			bootbox.alert("Please inform the vehicle name");
		}else if(checkSameCarOnBoat($("#vehiclePlate").val())){
			bootbox.alert("This car is already booked to this trip");
		}else if(!isCustomer() && $("#initialsResult").val() == ""){
			bootbox.alert("Please Inform the Operator Initials");
		}else{
			var form = document.getElementById('pasagerInfo');
			if(form.checkValidity()){
				if(checkForAdults()){
					bootbox.confirm("Are you sure? There is no adults on this booking", function(confirm){
						if(confirm)
							proccedToBooking("/bookOperator");
					});
				}else{
					proccedToBooking("/bookOperator");
				}
			}else{
				$('#pasagerInfo').submit(function(event){
					event.preventDefault();
				});
			}
		}
	},

	'click .confirmInquiry' : function(event){
		if($("#categories").val() != "" && $("#size").val() == "" && !$('#size').is(':disabled')){
			throwError('Please Inform the size of vehicle');
		}else if(checkSameCarOnBoat($("#vehiclePlate").val())){
				bootbox.alert("This car is already booked to this trip");
		}else if(!CanSaveTheBook){
			throwError("Sorry but the vehicle informed can't go on the boat");
		}else{
			var form = document.getElementById('pasagerInfo');
			if(form.checkValidity()){
				createBook();
				throwSuccess("Inquiry Confirmed");
				cleanExternView();
				sendMailInquiryConfirm();
				$("#loginArea").hide();
				Template.externView.rendered();

			}else{
				$('#pasagerInfo').submit(function(event){
					event.preventDefault();
				});
			}
		}
	},

	'click .saveEdit' : function(event){
		if($("#categories").val() != "" && $("#size").val() == "" && !$('#size').is(':disabled')){
			bootbox.alert('Please Inform the size of vehicle');
		}else if(!CanSaveTheBook){
			bootbox.alert("This car can't be on the boat, there is no room for it, this booking can't be created!");
		}else if($("#categories").val() != "" && $("#size").val() != "" && $("#slotNumber").val() == ""){
			throwError("Please Inform the Slots");
		}else if($("#categories").val() != "" && $("#size").val() != null && $("#vehiclePlate").val() == ""){
			bootbox.alert("Please inform the vehicle plate.");
		}else if($("#categories").val() != "" && $("#size").val() != null && $("#vehicle").val() == ""){
			bootbox.alert("Please inform the vehicle name");
		}else if(!isCustomer() && $("#initialsResult").val() == ""){
			bootbox.alert("Please Inform the Operator Initials");
		}else{
			var form = document.getElementById('pasagerInfo');
			if(form.checkValidity()){
				createBook();
				throwSuccess("Book updated");
				Session.set("isEditing", false);
				Meteor.Router.to('/bookDetailResume/'+Session.get("bookId"));
			}else{
				$('#pasagerInfo').submit(function(event){
					event.preventDefault();
				});
			}
		}
	},

	'click .procedToCart' : function(event){
		if($("#categories").val() != "" && $("#size").val() == "" && !$('#size').is(':disabled')){
			throwError('Please Inform the size of vehicle');
		}else if(!CanSaveTheBook){
			throwError("The Vehicle informed can't go on the boat");
		}else if($("#categories").val() != "" && $("#size").val() != null && $("#slotNumber").val() == ""){
			throwError("Please Inform the Slots");
		}else if($("#categories").val() != "" && $("#size").val() != null && $("#vehiclePlate").val() == ""){
			bootbox.alert("Please inform the vehicle plate.");
		}else if($("#categories").val() != "" && $("#size").val() != null && $("#vehicle").val() == ""){
			bootbox.alert("Please inform the vehicle name");
		}else if(checkSameCarOnBoat($("#vehiclePlate").val())){
			bootbox.alert("This car is already booked to this trip");
		}else if(!isCustomer() && $("#initialsResult").val() == ""){
			bootbox.alert("Please Inform the Operator Initials");
		}else{
				var form = document.getElementById('pasagerInfo');
				if(form.checkValidity()){
					if(checkForAdults()){
						bootbox.confirm("Are you sure? There is no adults on this booking", function(confirm){
							if(confirm)
								proccedToBooking('/cart');
						});
					}else{
						proccedToBooking('/cart');
					}
				}else{
					$('#pasagerInfo').submit(function(event){
						event.preventDefault();
					});
				}
			}
		}
});

 function sendMailInquiryConfirm () {
 	var html = "<html> <body><div id='wholeVoucher' style='width: 800px; margin: 0 auto; height: 115px; background-color: #005e8b; font-family: 'Open Sans','Helvetica Neue', Helvetica, Arial, sans-serif;'>"
	html +=		"<div>";
	html +=			"<img src='http://seatours.is/img/logo-en.png' style='height:110px;margin: 3px;'>";
	html +=		"</div>";
	html +=		"<div style=' margin-left: 15px; '>";
	html +=			"<br />";
	html +=			"<span>Hello! Your inquiry was completed! An agent from Seatours Office will be in contact soon!</span><br />";
	html +=			"<br />";
	html +=			"<span>Cheers!</span><br />";
	html +=			"<span>Seatours Office</span>";
	html +=		"</div>";
	html +=	"</div></body></html>";
	var email = Session.get('currentCustomerMail');
 	Meteor.call('sendEmailHTML', email, "noreply@seatours.is", "Your booking at Seatours!", html);
	console.log("Email foice!!!");
}

Template.generalPassagerInfo.events({
	'blur #socialSecurityNumber' : function(){
		if(!isCustomer() && !Session.get("editingCustomer")){
			socialNumber = $("#socialSecurityNumber").val();
			currentCustomer = Customers.findOne({socialSecurityNumber : socialNumber});
			if(currentCustomer){
				$('#fullName').val(currentCustomer.fullName);
				$('#customerId').val(currentCustomer._id);
				$('#title').val(currentCustomer.title);
				splitBirth = currentCustomer.birthDate.split("-");
				$('#birthDaySelect').val(Number(splitBirth[2]));
				$('#birthMonthSelect').val(Number(splitBirth[1]));
				$('#birthYearSelect').val(splitBirth[0]);
				$('#birthdate').val(currentCustomer.birthDate);
				$('#email').val(currentCustomer.email);
				$('#telephoneCode').val(currentCustomer.telephoneCode);
				$('#telephone').val(currentCustomer.telephone);
				$('#adress').val(currentCustomer.address);
				$('#addressnumber').val(currentCustomer.addressnumber);
				$('#city').val(currentCustomer.city);
				$('#state').val(currentCustomer.state);
				$('#postcode').val(currentCustomer.postcode);
				$('#country').val(currentCustomer.country);
				$('#groupId').val(currentCustomer.groupId);
				Session.set('SaveCustomer', false);
			}else{
				$('#fullName').val('');
				$('#customerId').val('');
				$('#title').val('');
				$('#birthDaySelect').val("");
				$('#birthMonthSelect').val("");
				$('#birthYearSelect').val("");
				$('#birthdate').val('');
				$('#email').val('');
				$('#telephoneCode').val('');
				$('#telephone').val('');
				$('#adress').val('');
				$('#addressnumber').val('');
				$('#city').val();
				$('#state').val('');
				$('#postcode').val('');
				$('#country').val('');
				//Vehicle
				$('#vehicle').val('');
				$('#categories').val('');
				$('#size').val('');
				$('#totalVehicle').val('');
				$('#vehiclePlate').val('');
				$('#groupId').val('');
				calcTotal();
				Session.set('SaveCustomer', true);
			}
		}
	},

	'change #previousCustomerData' : function(event){
		event.preventDefault();
		if($("#previousData").val() == 'false'){
			$("#previousData").val('true');
			var pCustomerData = Session.get("previousCustomer");
			$('#fullName').val(pCustomerData.fullName);
			$('#customerId').val(pCustomerData.customerId);
			var currentCustomer = pCustomerData;
			$('#title').val(currentCustomer.title);
			//SplitBirthDate
			splitBirth = currentCustomer.birthDate.split("-");

			$('#birthDaySelect').val(Number(splitBirth[2]));
			$('#birthMonthSelect').val(Number(splitBirth[1]));
			$('#birthYearSelect').val(Number(splitBirth[0]));
			$('#birthdate').val(currentCustomer.birthDate);
			$('#socialSecurityNumber').val(currentCustomer.socialSecurityNumber);
			$('#email').val(currentCustomer.email);
			$('#telephoneCode').val(currentCustomer.telephoneCode);
			$('#telephone').val(currentCustomer.telephone);
			$('#adress').val(currentCustomer.address);
			$('#addressnumber').val(currentCustomer.addressnumber);
			$('#city').val(currentCustomer.city);
			$('#state').val(currentCustomer.state);
			$('#postcode').val(currentCustomer.postcode);
			$('#country').val(currentCustomer.country);
			$('#groupId').val(currentCustomer.groupId);

			/*var pVehicle = Session.get("previousVehicle");

			$("#vehicle").val(pVehicle.vehicleName);
			$("#categories").val(pVehicle.category);
			$("#vehiclecolor").val(pVehicle.vehicleColor);
			Session.set("categoryId", pVehicle.categoryId);
			$("#size").val(pVehicle.size);
			$("#totalVehicle").val(pVehicle.totalCost);
			$('#vehiclePlate').val(pVehicle.vehiclePlate);*/

		}else{
			$("#previousData").val('false');
			$('#fullName').val('');
			$('#socialSecurityNumber').val('');
			$('#customerId').val('');
			$('#title').val('');
			$('#birthDaySelect').val("");
			$('#birthMonthSelect').val("");
			$('#birthYearSelect').val("");
			$('#birthdate').val('');
			$('#email').val('');
			$('#telephoneCode').val('');
			$('#telephone').val('');
			$('#adress').val('');
			$('#addressnumber').val('');
			$('#city').val('');
			$('#state').val('');
			$('#postcode').val('');
			$('#country').val('');
			$('#groupId').val('');
			$("#vehicle").val();
			$("#categories").val();
			$("#vehiclecolor").val();
			Session.set("categoryId", null);
			$("#size").val();
			$("#totalVehicle").val();
			$('#vehiclePlate').val();
		}
	},

	'change #myOwnData' : function(event){
		event.preventDefault();
		if($("#usingData").val() == 'false'){
			$("#usingData").val('true');
			$('#fullName').val(Meteor.user().profile.name);
			$('#customerId').val(Meteor.user().profile.customerId);
			var currentCustomer = Customers.findOne({'_id' : Meteor.user().profile.customerId});
			$('#title').val(currentCustomer.title);
			//SplitBirthDate
			splitBirth = currentCustomer.birthDate.split("-");
			$('#birthDaySelect').val(Number(splitBirth[2]));
			$('#birthMonthSelect').val(Number(splitBirth[1]));
			$('#birthYearSelect').val(splitBirth[0]);
			$('#birthdate').val(currentCustomer.birthDate);
			$('#socialSecurityNumber').val(currentCustomer.socialSecurityNumber);
			$('#email').val(currentCustomer.email);
			$('#telephoneCode').val(currentCustomer.telephoneCode);
			$('#telephone').val(currentCustomer.telephone);
			$('#adress').val(currentCustomer.address);
			$('#addressnumber').val(currentCustomer.addressnumber);
			$('#city').val(currentCustomer.city);
			$('#state').val(currentCustomer.state);
			$('#postcode').val(currentCustomer.postcode);
			$('#country').val(currentCustomer.country);
			$('#groupId').val(currentCustomer.groupId);
		}else{
			$("#usingData").val('false');
			$('#fullName').val('');
			$('#socialSecurityNumber').val('');
			$('#customerId').val('');
			$('#title').val('');
			$('#birthDaySelect').val("");
			$('#birthMonthSelect').val("");
			$('#birthYearSelect').val("");
			$('#birthdate').val('');
			$('#email').val('');
			$('#telephoneCode').val('');
			$('#telephone').val('');
			$('#adress').val('');
			$('#addressnumber').val('');
			$('#city').val('');
			$('#state').val('');
			$('#postcode').val('');
			$('#country').val('');
			$('#groupId').val('');
		}
	},

	'click .createUser' : function(event){

		var form = document.getElementById('pasagerInfo');

		if($('#firstPasswordToEnter').val() != $("#confirmPassword").val()){
			throwError("The Password doesn't match");
			$('#pasagerInfo').submit(function(event){
				event.preventDefault();
			});
		}else{
			if(form.checkValidity()){
				event.preventDefault();
				group = Groups.findOne({"name": "Customers"});

				var customerData = {
					'socialSecurityNumber' :  $('#socialSecurityNumber').val(),
					'fullName' :  $('#fullName').val(),
					'title' : $('#title').val(),
					'birthDate': $('#birthdate').val(),
					'email' : $('#email').val(),
					'telephoneCode' : $('#telephoneCode').val(),
					'telephone' : $('#telephone').val(),
					'address' : $('#adress').val(),
					'addressnumber' : $('#addressnumber').val(),
					'city' : $('#city').val(),
					'state' : $('#state').val(),
					'postcode' : $('#postcode').val(),
					'country' : $('#country').val(),
					'groupId' : group._id
				};

				var user = {
					username : form.username.value,
					email : $('#email').val(),
					password : $('#firstPasswordToEnter').val()
				};

				Meteor.call('createExternalAccount', user, customerData, function(err, result){
					if(err){
						throwError(err.reason);
					}else{
						SpinnerInit();
						Meteor.loginWithPassword(user.username, user.password, function(err){
							if (err){
								if(err.reason == 'Incorrect password')
									throwError("Incorrect Password!");
								else
									throwError("User not Found!");

							SpinnerStop();
							}else{
								throwSuccess("Successfuly registered!");
								cleanExternView();
								$("#loginArea").hide();
								Template.externView.rendered();
							}
						});
					}
				});
			}else{
				$('#pasagerInfo').submit(function(event){
					event.preventDefault();
				});
			}
		}
	},

	'change #country' : function(event){
		var value = event.target.selectedOptions[0].value;
		$('#city').val("");
		$('#postcode').val("");
		if(value == 'Iceland'){
			loadTypeAheadPostCodes(true);
		}else{
			loadTypeAheadPostCodes(false);
		}
	}
});

Template.generalPassagerInfo.customerCreation = function(){
	if(Meteor.user()){
		return isCustomer();
	}else{
		return false;
	}
};

Template.generalPassagerInfo.helpers({
	countries : function() {
		return Countries.find();
	}
});
///////////////////////////////////////////
//Template Booking Vehicles

Template.bookingVehicles.helpers({
	"vehicles" : function(){
		return Vehicles.find();
	}
});

Template.generalPassagerInfo.rendered = function() {
	$('.datepicker').datepicker({
		changeMonth : true,
		changeYear : true,
		format : "dd/mm/yyyy"
	});
	$('#socialSecurityNumber').mask('999999-9999');
	loadTypeAheadPostCodes(true);

	if(isCustomer()){
		$("#birthDayPick").birthdaypicker({
			"dateFormat" : "bigEndian",
			"required" : true
		});
	}else{
		$("#birthDayPick").birthdaypicker({
			"dateFormat" : "bigEndian",
			"required" : false
		});
	}
};


Template.categoryVehicleBook.helpers({
	categories : function(){
		return VehiclesCategory.find({season : currentSeason()});
	}
});

Template.categoryVehicleBook.categorized = function(_category){
	if(Session.get('firstTime')){
		if(_category == book.vehicle.category){
			var objCategory =  VehiclesCategory.findOne({category : _category});
			Session.set('categoryId',objCategory._id);
			Template.categoryVehicleBook.sizes();
			return true;
		}else{
			return false;
		}
	}if (Session.get('isEditing')) {
		if(_category == VehiclesCategory.findOne({_id : Session.get('categoryId')}).category){
			Template.categoryVehicleBook.sizes();
			return true;
		}else{
			return false;
		}
	}
	else{
		return false;
	}
};

Template.categoryVehicleBook.rendered = function(){
	calcVehiclePrice(Session.get('currentSizeCar'));
	calcTotal();
};


Template.categoryVehicleBook.isBaseSize = function(number) {
	category =  Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}) : null;
	if(number == category.baseSize){
		return true;
	}else{
		return false;
	}
};

Template.categoryVehicleBook.wasAutoCompleted = function(number) {
	autoCompletedSize = Session.get("currentSizeCar");
	if(autoCompletedSize){
		if(autoCompletedSize == number){
			return true;
		}
	}

	return false;
};

Template.categoryVehicleBook.sized = function(number) {
	if (number == book.vehicle.size){
			Session.set('currentSizeCar', number);
			calcVehiclePrice(number);
			calcTotal();
			return true;
		}else{
			return false;
		}
};

function disableActionsButtonsCreateBook(carSize){
	if(carSize > 5 && isCustomer()){
		$("#bookButton").css("display", "none");
		$("#proceedButton").css("display", "none");
		$("#divAlertSize").css("display", "block");
		$("#inquiryButton").css("display", "block");
	}else{
		$("#bookButton").css("display", "block");
		$("#proceedButton").css("display", "block");
		$("#divAlertSize").css("display", "none");
		$("#inquiryButton").css("display", "none");
	}
}

Template.categoryVehicleBook.events({
	'change #categories' : function(event){
		var id = event.target.selectedOptions[0].id;
		var category = VehiclesCategory.findOne({_id: id});
		if(category){
			$("#baseVehicle").val(parseInt(category.basePrice));
			$("#totalVehicle").val(parseInt(category.basePrice));
			Session.set('currentSizeCar', category.baseSize);
			disableActionsButtonsCreateBook(category.baseSize);
			Session.set('categoryId', id);
			var loop = Math.ceil(category.baseSize/5);
			if(!isCustomer()){
				if(loop == 1 && !checkPutManually(category.category)){
					$("#slotNumber").val("");
					$("#slotNumber").val(getFirstSlotAvailable());
					Session.set("previousSlots", $("#slotNumber").val());
				}else{
					$("#slotNumber").val("");
				}
			}else{
				if(getFirstSlotAvailable() == ""){
					CanSaveTheBook = false;
				}
			}
		}else{
			$("#baseVehicle").val(0);
			$("#totalVehicle").val(0);
			Session.set('categoryId', null);
		}

		calcTotal();
		changeSizes();
		Session.set("firstTime", false);
	},

	'change #size' : function(event){

		var value = event.target.selectedOptions[0].value;
		Session.set('currentSizeCar', value);
		calcVehiclePrice(Session.get('currentSizeCar'));
		var loop = Math.ceil(value/5);
		if(!isCustomer()){
			if(loop == 1){
				$("#slotNumber").val("");
				$("#slotNumber").val(getFirstSlotAvailable());
			}else{
				$("#slotNumber").val("");
			}
		}else{
			if(getFirstSlotAvailable() == ""){
				CanSaveTheBook = false;
			}
		}
		disableActionsButtonsCreateBook(value);
		calcTotal();
		Session.set("firstTime", false);
	}
});

changeSizes = function(){
	category = Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}) : null;
	if(category){
		Template.categoryVehicleBook.sizes();
	}
};

calcVehiclePrice = function(value){
	category = Session.get('categoryId') ? VehiclesCategory.findOne({_id: Session.get('categoryId')}) : null;
	if(category){
		var base = category.basePrice;
		sum = parseInt(value - category.baseSize);
		if(sum < 0 && category.onReduce){
			multFactor = sum * (-1);
			totalToBeReduced = multFactor * category.step;
			$("#totalVehicle").val(parseInt(base - totalToBeReduced));
		}else if(sum > 0){
			totalToBeAdded = sum * category.step;
			$("#totalVehicle").val(parseInt(base + totalToBeAdded));
		}else{
			$("#totalVehicle").val(parseInt(base));
		}
	}
};

calcTotal = function(){
	var total = 0;

	for (var i = $('.calcTotal').length - 1; i >= 0; i--) {
		if($('.calcTotal')[i].children[0].value != "")
			total += parseInt(($('.calcTotal')[i].children[0].value).replace(".",""));
	}

	$('#totalISK').val(total);
	$(".formattedAsMoney").maskMoney({thousands:'.', allowNegative:'true', precision:'0'});
	$(".formattedAsMoney").maskMoney('mask');

};

loadTypeAheadPostCodes = function(flag){
	loadTypeAheadInitials();
	if(flag){
		var postCodes = [],
		finalPostCodes,
		postTags = PostCodes.find({}, {fields: {postcode: 1, city: 1}});

		postTags.forEach(function(tag){
			var datum = {
				'value' : tag.postcode,
				'id' : tag._id,
				'city' : tag.city
			};
			postCodes.push(datum);
		});

		finalPostCodes = _.uniq(postCodes);

		$('#postcode').typeahead({
			local : finalPostCodes
		}).bind('typeahead:selected', function (obj, datum) {
			$('#city').val(datum.city);
		});
	}else{
		$('#postcode').typeahead('destroy');
	}
};

loadTypeAheadInitials = function(){

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

	$('#initials').typeahead({
		local : finalInitials
	}).bind('typeahead:selected', function (obj, datum) {
		$('#initialsResult').val(datum.fullName);
	});

}

var createBook = function(){
	var d, resultid, name;

	var	vehicle = {
		"vehicleName" : $("#vehicle").val(),
		"category" : $("#categories").val(),
		"vehicleColor" : $("#vehiclecolor").val(),
		"categoryId" : Session.get("categoryId"),
		"size" : $("#size").val(),
		"totalCost" : $("#totalVehicle").val().replace(".",""),
		'vehiclePlate' : $('#vehiclePlate').val()
	};

	group = Groups.findOne({"name": "Customers"});

	var customer = {
		"title" : $('#title').val(),
		"socialSecurityNumber" :  $('#socialSecurityNumber').val(),
		"fullName" :  $('#fullName').val(),
		"birthDate" : $('#birthdate').val(),
		'email' : $('#email').val(),
		"telephoneCode" : $('#telephoneCode').val(),
		"telephone" : $("#telephone").val(),
		"address" : $("#adress").val(),
		'addressnumber' : $('#addressnumber').val(),
		"city" : $("#city").val(),
		"state" : $('#state').val(),
		"postcode" : $("#postcode").val(),
		"country" : $("#country").val(),
		"lastUsedCar" : vehicle,
		"groupId" : group._id
	};
	Session.set("currentCustomerMail", customer.email);

	if(isOperator()){
		Session.set("previousCustomer", customer);
		Session.set("previousVehicle", vehicle);
	}

	var date = new Date();
	var selectedDay = new Date(localStorage.getItem('date'));

	var trip = Trips.findOne(Session.get('tripId'));

	book = {
		"trip" : {
			'_id': Session.get('tripId'),
			'from': trip.from,
			'to': trip.to,
			'hour': trip.hour
		},

		"totalISK" : parseInt($("#totalISK").val().replace(".","")),
		'dateOfBooking' : selectedDay,
		'creationDate': new Date(),
		'bookStatus' : 'Booked',
		"ticketPrinted" : false,
		'product' : (isCustomer()) ? Products.findOne(Session.get('productId')) : Product,
	};

	book.vehicle = vehicle;
	book.confirm = false;


	if(isOperator()){
		book.operatorFullName = $("#initialsResult").val();
		book.operatorIntials = $("#initials").val();
	}


	if(isCustomer()){

		if (vehicle.size > 5 ){
			book.pendingApproval = true;
		}else{
			if(vehicle.size && vehicle.category && vehicle.plate)
				book.slot = getFirstSlotAvailable();
		}
		if(Session.get('SaveCustomer')){
			var findCustomer;
			if($('#socialSecurityNumber').val())
				findCustomer = Customers.findOne({socialSecurityNumber : $('#socialSecurityNumber').val()});
			if(findCustomer){
				book.customerId = findCustomer._id;
			}else{
				customer.online = true;
				var resultId = Customers.insert(customer);
				book.customerId = resultId;
			}
		}else{
			book.customerId = $("#customerId").val();
		}


		var discount = Settings.findOne({_id: 'onlineDiscount'}).onlineDiscount;
		book.totalISK = parseInt((book.totalISK - ((book.totalISK * discount) / 100 )).toFixed());
		book.discount = discount;

		if(getCartId()){
				book.cartId = getCartId();
		}else{
			d = new Date();
			name = new Date().getTime().toString();
			localStorage.setItem('cartId', name);
			book.cartId = name;
		}
	}else{
		customer.online = false;
		book.signedby = $("initials").val();


		if(getCartIdOperator()){
			book.cartId = getCartIdOperator();
		}else{
			d = new Date();
			name = new Date().getTime().toString();
			localStorage.setItem('cartIdOperator', name);
			book.cartId = name;
		}
		book.slot = $("#slotNumber").val();

		if(Session.get('SaveCustomer')){
			var resultId = Customers.insert(customer);
			book.customerId = resultId;
			book.discount = 0;
		}else{
			//Discount
			updateCustomer($("#customerId").val() ,vehicle)
			group = Groups.findOne({_id : $('#groupId').val()});
			if(group && group.discount > 0){
				book.totalISK = parseInt((book.totalISK - ((book.totalISK * group.discount) / 100 )).toFixed());
				book.discount = group.discount;
			}
			book.customerId = $('#customerId').val();

			if(Customers.findOne({'_id': book.customerId}).lastUsedCar.vehiclePlate != $('#vehiclePlate').val()){
				Customers.update(book.customerId, {$set: {
					"lastUsedCar.category" : book.vehicle.category,
					"lastUsedCar.size" : book.vehicle.size,
					"lastUsedCar.totalCost" : book.vehicle.totalCost,
					"lastUsedCar.vehicleName" : book.vehicle.vehicleName,
					"lastUsedCar.vehiclePlate" : book.vehicle.vehiclePlate
				}});
			}
		}
	}

	if(SaveVehicle){
		Vehicles.insert(vehicle);
	}

	var prices = [];

	$('.unitPrice').filter(function(){
		var split = $(this).val().split("|");
		if(split[2]){
			var price = {
			"price" : split[0],
			"perUnit" : split[1],
			"persons" : split[2],
			"sum" : split[3]
		};

			prices.push(price);
		}
	});

	if ((isOperator() && ($('#includeOperatorFee').val() == "true") && vehicle) || (! isOperator())) {
		var operatorPrice = {
			"price" : "Confirmation Fee",
			"perUnit" : calcConfirmationFee(vehicle.category),
			"persons" : "1",
			"sum" : calcConfirmationFee(vehicle.category)
		};
		prices.push(operatorPrice);
	}

	book.prices = prices;
	book.paid = false;
	var note, noteobj;
	if (Session.get("isEditing")) {
		var selectedDate = $("#dayOfBookingEdit").val();
		var arrayOfDate = selectedDate.split("/");
		var month, day;

		if(arrayOfDate[1].length > 1){
			month = arrayOfDate[1];
		}else{
			month = arrayOfDate[1].replace('0', '');
		}

		if(arrayOfDate[0].length > 1){
			day = arrayOfDate[0];
		}else{
			day = arrayOfDate[0].replace('0', '');
		}


		var newDate = new Date(month+"/"+day+"/"+arrayOfDate[2]);

		bookEdited = Books.find(Session.get("bookId"));

		if(bookEdited.bookStatus == "Canceled"){
			Books.update(Session.get("bookId"), {$set : {
				"dateOfBooking" : newDate,
				"prices" : book.prices,
				"totalISK": book.totalISK,
				"trip.from" : book.trip.from,
				"trip.to" : book.trip.to,
				"trip.hour" : book.trip.hour,
				"slot" : $("#slotNumber").val(),
				"vehicle.category" : book.vehicle.category,
				"vehicle.size" : book.vehicle.size,
				"vehicle.totalCost" : book.vehicle.totalCost,
				"vehicle.vehicleName" : book.vehicle.vehicleName,
				"vehicle.vehiclePlate" : book.vehicle.vehiclePlate
			}});
		}else{
			Books.update(Session.get("bookId"), {$set : {
				"dateOfBooking" : newDate,
				"prices" : book.prices,
				"totalISK": book.totalISK,
				"trip.from" : book.trip.from,
				"trip.to" : book.trip.to,
				"trip.hour" : book.trip.hour,
				"bookStatus" : 'Booked',
				"slot" : $("#slotNumber").val(),
				"vehicle.category" : book.vehicle.category,
				"vehicle.size" : book.vehicle.size,
				"vehicle.totalCost" : book.vehicle.totalCost,
				"vehicle.vehicleName" : book.vehicle.vehicleName,
				"vehicle.vehiclePlate" : book.vehicle.vehiclePlate
			}});
		}

		note = $('#notes').val();
		if(note){
			noteobj = {
				created : date,
				type : 'Customer Note',
				note : note,
				bookId : Session.get("bookId")
			};

			Notes.insert(noteobj);
		}

		historyBook = {
			date : new Date(),
			action : "Edit Book",
			operator : $("#initialsResult").val(),
			bookId : Session.get("bookId")

		};

		//Change the edit thing to remove or add
		//Please add the info on the voucher too
		if($("#stopAtFlatey").val() == 'true'){
			noteobj = {
					created : new Date(),
					type : 'Stop at flatey',
					note : "This customer will make a stop at Flatey",
					bookId : Session.get("bookId")
				};
				Notes.insert(noteobj);
		}else{
			notes = Notes.find({bookId : Session.get("bookId"), type : "Stop at flatey"}).fetch();
			for(var i = 0; i < notes.length; i++){
				Notes.remove(notes[i]._id);
			}
		}

		HistoryBook.insert(historyBook);

	}else{
		if(!isCustomer()){
			refNumber = new Date().getTime().toString().substr(5);
			while(Books.findOne({refNumber : refNumber})){
				refNumber = new Date().getTime().toString().substr(5);
			}
			book.refNumber = refNumber;
			temporaryID = CartItems.insert(book);
			note = $('#notes').val();
			if(note){
				noteobj = {
					created : date,
					type : 'Customer Note',
					note : note,
					bookId : temporaryID
				};

				Notes.insert(noteobj);
			}

			historyBook = {
				date : new Date(),
				action : "Create Book",
				operator : $("#initialsResult").val(),
				bookId : temporaryID

			};

			if($("#stopAtFlatey").val() == 'true'){
				noteobj = {
						created : new Date(),
						type : 'Stop at flatey',
						note : "This customer will make a stop at Flatey",
						bookId : temporaryID
					};
					Notes.insert(noteobj);
			}

			HistoryBook.insert(historyBook);
		}else{
			if(book.pendingApproval){
				book.bookStatus = "Pending Approval (6+ meters vehicle)";
				customerId = "Pending Customer";
				refNumber = new Date().getTime().toString().substr(1);
				while(Orders.findOne({refNumber : refNumber})){
					refNumber = new Date().getTime().toString().substr(1);
				}
				book.buyerId = customerId;
				book.orderId = refNumber;
				Meteor.call('insertBook', book);
				CartItems.remove({_id: book._id});

			}else{

				temporaryID = CartItems.insert(book);
				if($("#stopAtFlatey").val() == 'true'){
					noteobj = {
							created : new Date(),
							type : 'Stop at flatey',
							note : "This customer will make a stop at Flatey",
							bookId : temporaryID
						};
						Notes.insert(noteobj);
				}
			}
		}

	}
};

getCartId = function(){
	return localStorage.getItem('cartId');
};

getCartIdOperator = function(){
	return localStorage.getItem('cartIdOperator');
};


var formatData = function(percentages){
	var data = {
		pieChart  : [
			{
				color       : 'red',
				description : 'Regular Slots',
				title       : 'Small Cars (5m)',
				value       : parseFloat(percentages.regularSlots / 43)
			},
				{
				color       : 'blue',
				description : 'Door Slots',
				title       : 'trains',
				value       : parseFloat(percentages.doorSlots / 43)
			},
				{
				color       : 'green',
				description : 'Extra Slots',
				title       : 'trains',
				value       : parseFloat(percentages.extraSlots / 43)
			},
				{
				color       : 'gray',
				description : 'Unallocated Space',
				title       : 'trains',
				value       : parseFloat(percentages.unallocated / 43)
			}
		]
	};

  return data;
};

var DURATION = 700;
var DELAY    = 200;

var drawPieChart = function( elementId, data ) {
    // TODO code duplication check how you can avoid that
    var count = 0;
    var y = 0;
    var y2 = 0;
    var containerEl = document.getElementById( elementId ),
        width       = 450,
        height      = width * 0.5,
        radius      = Math.min( width, height ) / 2,
        container   = d3.select( containerEl ),
        svg         = container.select( 'svg' )
                              .attr( 'width', width )
                              .attr( 'height', height );
    var pie = svg.append( 'g' )
        .attr(
          'transform',
          'translate(' + width / 1.5 + ',' + height / 2.3 + ')'
        );

    var detailedInfo = svg.append( 'g' )
      .attr( 'class', 'pieChart--detailedInformation' );

    var twoPi   = 2 * Math.PI;
    var pieData = d3.layout.pie()
      .value( function( d ) { return d.value; } );

    var arc = d3.svg.arc()
      .outerRadius( radius - 20)
      .innerRadius( 0 );

    var pieChartPieces = pie.datum( data )
      .selectAll( 'path' )
      .data( pieData )
      .enter()
      .append( 'path' )
      .attr( 'class', function( d ) {
        return 'pieChart__' + d.data.color;
      } )
      .attr( 'filter', 'url(#pieChartInsetShadow)' )
      .attr( 'd', arc )
      .each( function() {
        this._current = { startAngle: 0, endAngle: 0 };
      } )
      .transition()
      .duration( DURATION )
      .attrTween( 'd', function( d ) {
        var interpolate = d3.interpolate( this._current, d );
        this._current = interpolate( 0 );

        return function( t ) {
          return arc( interpolate( t ) );
        };
      } )
      .each( 'end', function handleAnimationEnd( d ) {
        drawDetailedInformation( d.data, this, count++);
      } );

    drawChartCenter();

    function drawChartCenter() {
      var centerContainer = pie.append( 'g' )
                                .attr( 'class', 'pieChart--center' );

      centerContainer.append( 'circle' )
        .attr( 'class', 'pieChart--center--outerCircle' )
        .attr( 'r', 0 )
        .attr( 'filter', 'url(#pieChartDropShadow)' )
        .transition()
        .duration( DURATION )
        .delay( DELAY )
        .attr( 'r', radius - 50 );

      centerContainer.append( 'circle' )
        .attr( 'id', 'pieChart-clippy' )
        .attr( 'class', 'pieChart--center--innerCircle' )
        .attr( 'r', 0 )
        .transition()
        .delay( DELAY )
        .duration( DURATION )
        .attr( 'r', radius - 55 )
        .attr( 'fill', '#fff' );
    }

    function drawDetailedInformation ( data, element, count) {
      var bBox      = element.getBBox(),
          infoWidth = width * 0.3,
          anchor,
          infoContainer,
          position,
          y;
          var color = "";
         y = parseInt(count * 50 + 15);

				if(count == 0){
					color = '#d15b47';
				}

				if(count == 1){
					color = '#6fb3e0';
				}

				if(count == 2){
					color = '#87b87f';
				}

				if(count == 3){
					color = '#808080';
				}



			infoContainer = detailedInfo.append( 'g' )
				.attr( 'width', infoWidth )
				.attr(
				'transform',
				'translate(' + 0 + ',' + y + ')'
			);
			anchor   = 'start';
			position = 'left';




      infoContainer.data( [ data.value * 100 ] )
                    .append( 'text' )
                    .text ( '0 %' )
                    .attr( 'class', 'pieChart--detail--percentage' )
                    .attr( 'x', ( position == 'left' ? 0 : infoWidth ) )
                    .attr( 'y', 0 )
                    .attr( 'text-anchor', anchor )
                    .transition()
                    .duration( DURATION )
                    .tween( 'text', function( d ) {
                      var i = d3.interpolateRound(
                        +this.textContent.replace( /\s%/ig, '' ),
                        d
                      );

                      return function( t ) {
												if(data.description != "Unallocated Space")
													this.textContent = i( t ) + ' % - '+calculateCars(data.description)+" Cars";
												else
													this.textContent = i( t ) + ' % ';
                      };
                    } );

      infoContainer.append( 'line' )
                    .attr( 'class', 'pieChart--detail--divider' )
                    .attr( 'x1', 0 )
                    .attr( 'x2', 0 )
                    .attr( 'y1', 0 )
                    .attr( 'y2', 0 )
                    .transition()
                    .duration( DURATION )
                    .attr( 'x2', infoWidth );

      infoContainer.data( [ data.description ] )
                    .append( 'foreignObject' )
                    .attr( 'width', infoWidth )
                    .attr( 'height', 100 )
                    .append( 'xhtml:body' )
                    .attr(
                      'class',
                      'pieChart--detail--textContainer ' + 'pieChart--detail__' + position
                    )
                    .html('<div class="line"><div style="width:10px;height:10px;border:1px solid #000; background-color: '+color+'"></div>'+data.description+'</div>');


    }
  }

function drawPieChartBoatSlots() {
    drawPieChart('pieChart', formatData(updateDataPieChart()).pieChart );
}

PieChart = {
	drawPieChartBoatSlots : function(){
		drawPieChart('pieChart', formatData(updateDataPieChart()).pieChart );
	}
}



checkMaxCapacity = function(total, productId, tripId){
	var product;
	var reRender = true;
	if(productId == null){
		product = Products.findOne(Session.get('productId'));
	}else{
		product = Products.findOne(productId);
		reRender = false;
	}

	if(tripId == null){
		tripId = Session.get('tripId');
		reRender = false;
	}

	var boat = Boats.findOne({_id : product.boatId});
	var dates = getSelectedAndNextDay();



	var persons = 0;

	books = Books.find({
		dateOfBooking : {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' : Session.get('productId'),
		'trip._id' : tripId,
		$or: [ { bookStatus: "Booked"}, { bookStatus: "Waiting Payment (credit card)" } ]
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		for (var j = 0; j < books[i].prices.length; j++) {
			if(books[i].prices[j].price != "Operator Fee")
				persons = parseInt(parseInt(books[i].prices[j].persons) + persons);
		}
	}

	if((persons + total) > boat.maxCapacity){
		$("#divMessageCreateBook").show();
		$("#messageCreateBook").text("There are too many passagers, we got only "+parseInt(boat.maxCapacity - persons)+" free sits, sorry but this booking can't be made!");
		CanSaveTheBook = false;
		return false;
	}else{
		$("#divMessageCreateBook").hide();
		CanSaveTheBook = true;
		return true;
	}

	if(reRender){
		Template.createBook.rendered();
	}

};

function proccedToBooking(route){
	createBook();
	throwSuccess("Book added on Cart");
	if(isCustomer()){
		cleanExternView();
		Session.set('cbasket', true);
		$("#loginArea").hide();
		Template.externView.rendered();
	}else{
		Meteor.Router.to(route);
	}
}

function calculateCars(description){
	var type = description.split(" ")[0];

	if(type == 'Regular'){
		return Session.get("regularCars");
	}else if(type == 'Extra'){
		return Session.get("extraCars");
	}else{
		return Session.get("doorCars");
	}

}

checkSameCarOnBoat = function(vehicleId, productId, tripId, dates){
	var datesInternal, productIdInternal, tripIdInternal;

	if(!dates){
		datesInternal = getSelectedAndNextDay();
	}else{

		var dateBefore, dateAfter;

		dateBefore = new Date(dates);
		dateAfter = new Date(dates);

		with(dateBefore){
			setHours(0);
			setMinutes(0);
			setSeconds(0);
		}

		with(dateAfter){
			setDate(getDate() + 1);
			setMinutes(0);
			setSeconds(0);
		}



		datesInternal = {
			selectedDay : dateBefore,
			nextDay : dateAfter
		}
	}

	if(!productId){
		productIdInternal = Session.get('productId');
	}else{
		productIdInternal = productId;
	}

	if(!tripId){
		tripIdInternal = Session.get('tripId');
	}else{
		tripIdInternal = tripId;
	}

	//TODO check books on customer side

	book = Books.findOne({
		dateOfBooking : {$gte: datesInternal.selectedDay, $lt: datesInternal.nextDay},
		'product._id' : productIdInternal,
		'trip._id' : tripIdInternal,
		'vehicle.vehiclePlate' : vehicleId
	});

	cartBook = CartItems.findOne({
		cartId : getCartIdOperator(),
		dateOfBooking : {$gte: datesInternal.selectedDay, $lt: datesInternal.nextDay},
		'product._id' : productIdInternal,
		'trip._id' : tripIdInternal,
		'vehicle.vehiclePlate' : vehicleId
	});

	if((book || cartBook) && vehicleId){
		return true;
	}else{
		return false;
	}
}

function saveHistoryAction(book, action, operator){

	historyBook = {
		date : new Date(),
		action : action,
		operator : operator,
		bookId : book._id

	};

	HistoryBook.insert(historyBook);

	$("#initialsResult").val("");
	Session.set("confirmBook", null);
	Session.set("callbackAction", null);
};

function updateCustomer(customerId, vehicle){
	Customers.update(customerId, { $set : {
		"title" : $('#title').val(),
		"fullName" :  $('#fullName').val(),
		"birthDate" : $('#birthdate').val(),
		'email' : $('#email').val(),
		"telephoneCode" : $('#telephoneCode').val(),
		"telephone" : $("#telephone").val(),
		"address" : $("#adress").val(),
		'addressnumber' : $('#addressnumber').val(),
		"city" : $("#city").val(),
		"state" : $('#state').val(),
		"postcode" : $("#postcode").val(),
		"country" : $("#country").val(),
		"lastUsedCar" : vehicle
		}
	});
}

function calcConfirmationFee(category){
	var fee = 5000;

	if(category.toLowerCase() == 'normal car' ||
		category.toLowerCase() == 'small car' ||
		category.toLowerCase() == 'cart (without car)' ||
		category.toLowerCase() == 'jeep' ||
		category.toLowerCase() == 'car to flatey' ||
		category.toLowerCase() == 'cart to flatey' ||
		category.toLowerCase() == 'motorcycle'){
			fee = 3000;
		}

	return fee;
}

function checkPutManually(category){
	var putManually = false;

	if(category.toLowerCase() == 'large car / motor-home' ||
		category.toLowerCase() == 'motorcycle' ||
		category.toLowerCase() == 'extra large car / tractor'){
			putManually = true;
		}

	return putManually;
}
