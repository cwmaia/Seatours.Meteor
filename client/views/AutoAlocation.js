var extraSlots = ['NO', 'EXTRASLOT1', 'EXTRASLOT2', 'OVERRIDE'];
/*
var getExtraSlotsSpace = function(trip){
	var dates = getSelectedAndNextDay();
	var extraSpace1 = 0;
	var extraSpace2 = 0;
	var count5m = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	cartItems = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	for (var i = books.length - 1; i >= 0; i--) {
		if(books[i].vehicle.size <= 5){
			count5m++;
		}
	};

	for (var i = cartItems.length - 1; i >= 0; i--) {
		if(cartItems[i].vehicle.size <= 5){
			count5m++;
		}
	};

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[3]
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		count5m = count5m + Math.ceil(books[i].vehicle.size / 5);
	};

	books = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[3]
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		count5m = count5m + Math.ceil(books[i].vehicle.size / 5);
	};

	product = Products.findOne(Session.get('productId'));
	boatStatus = BoatStatus.find({boatId: product.boatId}).fetch();
	status5mAnterior = boatStatus[0].qtdCarsUpTo_5;

	for (var i = 0; i < boatStatus.length; i++) {
		if(status5mAnterior == boatStatus[i].qtdCarsUpTo_5){
			if(count5m < (boatStatus[i].qtdCarsUpTo_5 + 1)){
				extraSpace1 = boatStatus[i].bigSlotOne;
				extraSpace2 = boatStatus[i].bigSlotTwo;
			}
		}else{
			if(count5m >= status5mAnterior && count5m < (boatStatus[i].qtdCarsUpTo_5)){
				extraSpace1 = boatStatus[i].bigSlotOne;
				extraSpace2 = boatStatus[i].bigSlotTwo;
			}
		}

		status5mAnterior = boatStatus[i].qtdCarsUpTo_5;
	};



	extraSpace = {
		extraSpace1 : extraSpace1,
		extraSpace2 : extraSpace2
	}

	return extraSpace;
}
var realocate = function(size, booksSlot1, booksSlot2, sumSpacesSlot1, sumSpacesSlot2, extraSpace1, extraSpace2){


	temporalFreeSpace1 = extraSpace1 - sumSpacesSlot1;
	temporalFreeSpace2 = extraSpace2 - sumSpacesSlot2;
	//It can goes on slot 1?
	if(size <= extraSpace1){
		temporalFreeSpace1 = extraSpace1 - sumSpacesSlot1;
		temporalFreeSpace2 = extraSpace2 - sumSpacesSlot2;
		//Tries to move cars to slot 2
		var CarsToMove = [];
		for (var i = 0; i < booksSlot1.length; i++) {
			if(booksSlot1[i].vehicle.size <= temporalFreeSpace2){
				CarsToMove.push(booksSlot1[i]);
				temporalFreeSpace2 -= parseInt(booksSlot1[i].vehicle.size);
				temporalFreeSpace1 += parseInt(booksSlot1[i].vehicle.size);
				if(size <= temporalFreeSpace1){
					for (var j = 0; j < CarsToMove.length; j++) {
						Books.update(CarsToMove[j]._id, {$set : {'vehicle.extraSlot' : extraSlots[2]}});
						CartItems.update(CarsToMove[j]._id, {$set : {'vehicle.extraSlot' : extraSlots[2]}});
					};

					return extraSlots[1];
				}
			}
		};
	//It can goes on slot 2?
	}else if(size <= extraSpace2){
		temporalFreeSpace1 = extraSpace1 - sumSpacesSlot1;
		temporalFreeSpace2 = extraSpace2 - sumSpacesSlot2;

		var CarsToMove = [];
		for (var i = 0; i < booksSlot2.length; i++) {
			if(booksSlot2[i].vehicle.size <= temporalFreeSpace1){
				CarsToMove.push(booksSlot1[i]);
				temporalFreeSpace1 -= booksSlot1[i].vehicle.size;
				temporalFreeSpace2 += booksSlot1[i].vehicle.size;
				if(size <= temporalFreeSpace2){
					for (var j = 0; j < CarsToMove.length; j++) {
						Books.update(CarsToMove[j]._id, {$set : {'vehicle.extraSlot' : extraSlots[1]}});
						CartItems.update(CarsToMove[j]._id, {$set : {'vehicle.extraSlot' : extraSlots[2]}});
					};

					return extraSlots[2];
				}
			}
		};
	//So sad can't go
	}else{
		return false;
	}
	

}


var doorMaxCapacity = function (trip){
	var dates = getSelectedAndNextDay();
	var count6m = 0;
	var count5m = 0;
	var max5mCars = 0;
	var max6mCars = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	if(Session.get('isEditing')){
		if(books.indexOf(Books.findOne(Session.get('bookId')))>=0){
			books.splice(books.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}

	cartItems = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	for (var i = books.length - 1; i >= 0; i--) {
		if(books[i].vehicle.size <= 5){
			count5m++;
		}
		if(books[i].vehicle.size > 5 && books[i].vehicle.size <= 6){
			count6m++;
		}
	};

	for (var i = cartItems.length - 1; i >= 0; i--) {
		if(cartItems[i].vehicle.size <= 5){
			count5m++;
		}
		if(cartItems[i].vehicle.size > 5 && cartItems[i].vehicle.size <= 6){
			count6m++;
		}
	};

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[3]
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		count5m = count5m + Math.ceil(books[i].vehicle.size / 5);
	};

	books = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[3]
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		count5m = count5m + Math.ceil(books[i].vehicle.size / 5);
	};

	extraSpace = getExtraSlotsSpace(trip);

	sumExtraSpace = parseInt(extraSpace.extraSpace1 + extraSpace.extraSpace2);
	
	product = Products.findOne(Session.get('productId'));
	boatStatus = BoatStatus.find({boatId : product.boatId}).fetch();
	

	for (var i = 0; i < boatStatus.length; i++) {
		totalSlots = parseInt(boatStatus[i].bigSlotOne + boatStatus[i].bigSlotTwo);
		if(sumExtraSpace <= totalSlots){
			CanAdd2Motocycle = boatStatus[i].AddExtraMotos;
			max5mCars = boatStatus[i].qtdCarsUpTo_5;
			max6mCars = boatStatus[i].qtdCarsUpTo_6;
		}
	};

	if(count5m == max5mCars){
		return true;
	}

	if(count6m == max6mCars){
		return true;
	}

	return false;
	
}

var checkSpaceExtra = function(size, trip){
	var dates = getSelectedAndNextDay();
	var count5m = 0;

	booksSlot1 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();

	if(Session.get('isEditing')){
		if(booksSlot1.indexOf(Books.findOne(Session.get('bookId')))>=0){
			booksSlot1.splice(booksSlot1.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}

	booksSlot2 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[2]
	}).fetch();

	if(Session.get('isEditing')){
		if(booksSlot2.indexOf(Books.findOne(Session.get('bookId')))>=0){
			booksSlot2.splice(booksSlot2.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}

	booksSlot3 = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();

	if(Session.get('isEditing')){
		if(booksSlot3.indexOf(Books.findOne(Session.get('bookId')))>=0){
			booksSlot3.splice(booksSlot3.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}

	booksSlot4 = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[2]
	}).fetch();

	if(Session.get('isEditing')){
		if(booksSlot4.indexOf(Books.findOne(Session.get('bookId')))>=0){
			booksSlot4.splice(booksSlot4.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}

	extraSpace = getExtraSlotsSpace(trip);

	sumSpacesSlot1 = 0;
	sumSpacesSlot2 = 0;

	for (var i = 0; i < booksSlot1.length; i++) {
		sumSpacesSlot1 += parseInt(booksSlot1[i].vehicle.size);
	};
	for (var i = 0; i < booksSlot2.length; i++) {
		sumSpacesSlot2 += parseInt(booksSlot2[i].vehicle.size);
	};

	for (var i = 0; i < booksSlot3.length; i++) {
		sumSpacesSlot1 += parseInt(booksSlot3[i].vehicle.size);
		booksSlot1.push(booksSlot3[i]);
	};
	for (var i = 0; i < booksSlot4.length; i++) {
		sumSpacesSlot2 += parseInt(booksSlot4[i].vehicle.size);
		booksSlot2.push(booksSlot4[i]);
	};

	freeSpaceSlot1 = parseInt(extraSpace.extraSpace1 - sumSpacesSlot1);
	freeSpaceSlot2 = parseInt(extraSpace.extraSpace2 - sumSpacesSlot2);


	
	if(size <= freeSpaceSlot1){
		return extraSlots[1];
	}else if(size <= freeSpaceSlot2){
		return extraSlots[2];
	}else{
		//Tries to realocate
		return realocate(size, booksSlot1, booksSlot2, sumSpacesSlot1, sumSpacesSlot2, extraSpace.extraSpace1, extraSpace.extraSpace2);
	}
}

var countExtraSpace = function(){

	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));
	var spaceAlocatedSlot1 = 0;
	var spaceAlocatedSlot2 = 0;
	var spaceAlocatedSlot3 = 0;
	var spaceAlocatedSlot4 = 0;
	var spaceAlocated = 0;
	var max5slots = 30;

	booksSlot1 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();


	booksSlot2 = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[2]
	}).fetch();

	booksSlot3 = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();


	booksSlot4 = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[2]
	}).fetch();

	for (var i = booksSlot1.length - 1; i >= 0; i--) {
		spaceAlocatedSlot1 += parseInt(booksSlot1[i].vehicle.size);
	};

	for (var i = booksSlot2.length - 1; i >= 0; i--) {
		spaceAlocatedSlot2 += parseInt(booksSlot2[i].vehicle.size);
	};

	$("#spaceAlocatedSlot1").text(spaceAlocatedSlot1);
	$("#spaceAlocatedSlot2").text(spaceAlocatedSlot2);

}

var checkHaveToOpenDoor = function(size, trip){	

	var dates = getSelectedAndNextDay();
	var count5m = 0;
	var count6m = 0;
	var max5mCars = 0;
	var max6mCars = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();

	cartBooks = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[0]
	}).fetch();


	if(Session.get('isEditing')){
		if(books.indexOf(Books.findOne(Session.get('bookId')))>=0){
			books.splice(books.indexOf(Books.findOne(Session.get('bookId'))),1);
		}
	}


	for (var i = books.length - 1; i >= 0; i--) {
		if(books[i].vehicle.size <= 5){
			count5m++;
		}

		if(books[i].vehicle.size > 5 && books[i].vehicle.size <= 6){
			count6m++;
		}
	};

	for (var i = cartBooks.length - 1; i >= 0; i--) {
		if(cartBooks[i].vehicle.size <= 5){
			count5m++;
		}

		if(cartBooks[i].vehicle.size > 5 && cartBooks[i].vehicle.size <= 6){
			count6m++;
		}
	};

	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[3]
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		count5m = count5m + Math.ceil(books[i].vehicle.size / 5);
	};

	books = CartItems.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked',
		'vehicle.extraSlot' : extraSlots[3]
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		count5m = count5m + Math.ceil(books[i].vehicle.size / 5);
	};

	extraSpace = getExtraSlotsSpace(trip);

	sumExtraSpace = parseInt(extraSpace.extraSpace1 + extraSpace.extraSpace2);
	
	product = Products.findOne(Session.get('productId'));
	boatStatus = BoatStatus.find({boatId : product.boatId}).fetch();
	boat = Boats.findOne({_id : product.boatId});
	

	for (var i = 0; i < boatStatus.length; i++) {
		totalSlots = parseInt(boatStatus[i].bigSlotOne + boatStatus[i].bigSlotTwo);
		if(sumExtraSpace <= totalSlots){
			max5mCars = boatStatus[i].qtdCarsUpTo_5;
			max6mCars = boatStatus[i].qtdCarsUpTo_6;
		}
	};

	max5mCarsDoor = boat.max5mDoor;
	max6mCarsDoor = boat.max6mDoor;

	door5Limit = parseInt(max5mCars - max5mCarsDoor);
	door6Limit = parseInt(max6mCars - max6mCarsDoor);

	if(size <= 5){
		if(count5m < door5Limit){
			return false;
		}
	}

	if(size > 5 && size <= 6){
		if(count6m < door6Limit){
			return false;
		}
	}

	return true;
}


checkIfCarsFits = function(size){

	var trip = Trips.findOne(Session.get('tripId'));
	ExtraSlot = null;
	CanSaveTheBook = true;

	if(size <= 6){
		//Check if all space on the boat for the cars has takken, if yes
		//will ask to operator if him wants to open the door for place the cars
		showAlert = checkHaveToOpenDoor(size, trip);

		//If the door has reached the max capacity, there is no space on the boat for the
		//car based on his size
		maxCapacity = doorMaxCapacity(trip);
		if(showAlert){
			if(!isCustomer()){
					bootbox.confirm("There is no room for this car on the boat. However you can place it on the Door. Wishes to put it on boat door?" , function(confirm){
					if(confirm){
						ExtraSlot = extraSlots[0];
						CanSaveTheBook = true;
						Template.createBook.rendered();
					}else{
						bootbox.confirm("There is no room for this car on the boat (on regular slots). However you can place it on a Extra Slot. Wishes to put it on extra slot?" , function(confirm){
							if(confirm){
								fits = checkSpaceExtra(size, trip);
								if(fits){
									ExtraSlot = fits;
									CanSaveTheBook = true;
									Template.createBook.rendered();
								}else{
									$("#messageCreateBook").text("There is no room for this car, sorry but this booking can't be made!");
									bootbox.alert("This car can't be on the boat, there is no room for it, this booking can't be created!");
									CanSaveTheBook = false;
									Template.createBook.rendered();
								}
							}else{
								$("#messageCreateBook").text("There is no room for this car, sorry but this booking can't be made!");
								bootbox.alert("This car can't be on the boat, there is no room for it, this booking can't be created!");
								CanSaveTheBook = false;
								Template.createBook.rendered();
							}
						})
					}
				})
			//Customer Path		
			}else{
				ExtraSlot = extraSlots[0];
				CanSaveTheBook = true;
				return true;
			}
		}else if(size <= 2.5 && CanAdd2Motocycle){
			ExtraSlot = extraSlots[0];
			CanSaveTheBook = true;
			Template.createBook.rendered();
		}else if(maxCapacity){
			if(!isCustomer()){
				bootbox.confirm("The Door is already full, place the car on extra slots?" ,function(confirm){
					if(confirm){
						fits = checkSpaceExtra(size, trip);
						if(fits){
							ExtraSlot = fits;
							CanSaveTheBook = true;
							Template.createBook.rendered();
						}else{
							$("#messageCreateBook").text("There is no room for this car, sorry but this booking can't be made!");
							bootbox.alert("This car can't be on the boat, there is no room for it, this booking can't be created!");
							CanSaveTheBook = false;
							Template.createBook.rendered();
						}
					}else{
						$("#messageCreateBook").text("There is no room for this car, sorry but this booking can't be made!");
						bootbox.alert("This car can't be on the boat, there is no room for it, this booking can't be created!");
						CanSaveTheBook = false;
						Template.createBook.rendered();
					}
				});
				//Customer Path			
			}else{
				fits = checkSpaceExtra(size, trip);
				if(fits){
					ExtraSlot = fits;
					CanSaveTheBook = true;
					return true;
				}else{
					$("#messageCreateBook").text("There is no room for this car, sorry but this booking can't be made!");
					bootbox.alert("This car can't be on the boat, there is no room for it, this booking can't be created!");
					CanSaveTheBook = false;
					Template.createBook.rendered();
					return false;
				}
			}
		}
	}else if(size > 6){
		if(!isCustomer()){
			bootbox.confirm("There is no room for this car on the boat (on regular slots). However you can place it on a Extra Slot. Wishes to put it on extra slot?" , function(confirm){
				if(confirm){
					fits = checkSpaceExtra(size, trip);
					if(fits){
						ExtraSlot = fits;
						CanSaveTheBook = true;
						Template.createBook.rendered();
					}else{
						var slots = Math.ceil(size/5);

						bootbox.confirm('There is no room even on extra slots, you can place this car on boat, however it will take '+ slots + ' five meters slots, Whishes to put in regular slots?', function(confirm){
							if(confirm){
								CanSaveTheBook = true;
								ExtraSlot = extraSlots[3];
								Template.createBook.rendered();
							}else{
								$("#messageCreateBook").text("There is no room for this car, sorry but this booking can't be made!");
								bootbox.alert("This car can't be on the boat, there is no room for it, this booking can't be created!");
								CanSaveTheBook = false;
								Template.createBook.rendered();
							}
						});
					}
				}else{	
					var slots = Math.ceil(size/5);

					bootbox.confirm('You can place this car on boat, however it will take '+ slots + ' five meters slots, Whishes to put in regular slots?', function(confirm){
						if(confirm){
							ExtraSlot = extraSlots[3];
							CanSaveTheBook = true;
							Template.createBook.rendered();
						}else{
							$("#messageCreateBook").text("There is no room for this car, sorry but this booking can't be made!");
							bootbox.alert("This car can't be on the boat, there is no room for it, this booking can't be created!");
							CanSaveTheBook = false;
							Template.createBook.rendered();
						}
					});
				}
			});
				//Customer Path		
		}else{
			fits = checkSpaceExtra(size, trip);
			if(fits){	
				ExtraSlot = fits;
				CanSaveTheBook = true;
				Template.createBook.rendered();
				return true;
			}else{
				if(!Session.get('checkOrder')){
					$("#messageCreateBook").text("There is no room for this car, sorry but this booking can't be made!");
					bootbox.alert("This car can't be on the boat, there is no room for it, this booking can't be created!");
					CanSaveTheBook = false;
					Template.createBook.rendered();
				}
				return false;
			}
		}
	}
}


checkMaxCapacity = function(total){
	var dates = getSelectedAndNextDay();
	var trip = Trips.findOne(Session.get('tripId'));
	var product = Products.findOne(Session.get('productId'));
	var boat = Boats.findOne({_id : product.boatId});

	var persons = 0;
	
	books = Books.find({
		dateOfBooking 	: {$gte: dates.selectedDay, $lt: dates.nextDay},
		'product._id' 	: Session.get('productId'),
		'trip._id' 	: trip._id,
		'bookStatus'	: 'Booked'
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		for (var j = 0; j < books[i].prices.length; j++) {
			if(books[i].prices[j].price != "Operator Fee")
				persons = parseInt(parseInt(books[i].prices[j].persons) + persons);
		};
	};

	if((persons + total) > boat.maxCapacity){
		$("#divMessageCreateBook").show();
		$("#messageCreateBook").text("There are too many passagers, we got only "+parseInt(boat.maxCapacity - persons)+" free sits, sorry but this booking can't be made!");
		CanSaveTheBook = false;
		Template.createBook.rendered();
		return false;
	}else{
		$("#divMessageCreateBook").hide();
		CanSaveTheBook = true;
		Template.createBook.rendered();
		return true;
	}	
	
}*/