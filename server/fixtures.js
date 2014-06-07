Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://postmaster%40seatours.com:2-j--rmow2s5@smtp.mailgun.org:587';
});

var extraSlots = ['NO', 'EXTRASLOT1', 'EXTRASLOT2'];
var admId = '';
var vendorsId = '';
var customersId = '';
var specialId = '';


if(Groups.find().count() == 0){
	admId = Groups.insert({
		'name' : 'Administrators',
		'description' : 'Seatours Admin Group',
		'type' : 'internal'
	});

	vendorsId = Groups.insert({
		'name' : 'Vendors',
		'description' : 'Vendors',
		'type' : 'internal',
		'permissions' : [
			'bookOperator',
			'bookDetail',
			'createBook',
			'cart',
			'finishBooking'
		]
	})

	Groups.insert({
		'name' : 'Agencies',
		'description' : 'Travel Agencies',
		'type' : 'internal',
		'discount' : 0,
		'permissions' : [
			'bookOperator',
			'bookDetail',
			'createBook',
			'cart',
			'finishBooking'
		]
	})

	customersId = Groups.insert({
		'name' : 'Customers',
		'description' : 'Extern Customers',
		'type' : 'external',
		'discount' : 0,
		'permissions' : [
			'bookOperator',
			'createBook',
			'myVoucher'
			]
	})

	specialId = Groups.insert({
		'name' : 'Special Offers',
		'description' : 'Extern Customers',
		'type' : 'external',
		'discount' : 0,
		'permissions' : [
			'bookOperator',
			'createBook',
			'myVoucher'
			]
	})
}

if(Boats.find().count() == 0){
	Boats.insert({
		"_id" : "1",
		"name" : "Baldur Ferry",
		"maxCapacity" : 300,
		"max5mDoor" : 3,
		"max6mDoor" : 2,
		"boatImage" : "Baldur Ferry.jpg"
	});

  Boats.insert({
    "_id" : "2",
    "name" : "Saerun",
    "maxCapacity" : 50,
    "max5mDoor" : 0,
    "max6mDoor" : 0,
    "boatImage" : "saerun.jpeg"
  });

	BoatStatus.insert({
		'boatId' : "1",
		"qtdCarsUpTo_5" : 24,
		"qtdCarsUpTo_6" : 4,
		"bigSlotOne" : 24,
		"bigSlotTwo" : 24,
		"AddExtraMotos" : true
	});

	BoatStatus.insert({
		'boatId' : "1",
		"qtdCarsUpTo_5" : 25,
		"qtdCarsUpTo_6" : 4,
		"bigSlotOne" : 24,
		"bigSlotTwo" : 19,
		"AddExtraMotos" : false
	});

	BoatStatus.insert({
		'boatId' : "1",
		"qtdCarsUpTo_5" : 27,
		"qtdCarsUpTo_6" : 4,
		"bigSlotOne" : 19,
		"bigSlotTwo" : 19,
		"AddExtraMotos" : false
	});

	BoatStatus.insert({
		'boatId' : "1",
		"qtdCarsUpTo_5" : 28,
		"qtdCarsUpTo_6" : 4,
		"bigSlotOne" : 19,
		"bigSlotTwo" : 15,
		"AddExtraMotos" : false
	});

	BoatStatus.insert({
		'boatId' : "1",
		"qtdCarsUpTo_5" : 30,
		"qtdCarsUpTo_6" : 4,
		"bigSlotOne" : 15,
		"bigSlotTwo" : 15,
		"AddExtraMotos" : false
	});

}

if(Products.find().count() == 0){
	result = Products.insert({
		"name" 			: "Baldur Ferry",
		"active" 	: true,
		"boatId" : '1',
		'availableFor' : customersId,
		'imageName' : "Baldur Ferry.jpg",
		'featured' : true,
    'order' : 0,
		'disclaimer' : "Ferry Baldur daily crosses Breiðafjörður Bay. PLEASE NOTE – if your are travelling with a car and stopping in Flatey Island you need to book “Stykkisholmur-Brjanslækur” (or reverse), and mark in the checkbox that you will be stopping in Flatey."
	});

	var tripID1 = Trips.insert({
		"from" 	: "Stykkishólmur",
		"to"	: "Brjanslækur",
		"hour"  : "15:00",
		'season' : "winter",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID1,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	var tripID2 = Trips.insert({
		"from" 	: "Brjanslækur",
		"to"	: "Stykkisholmur",
		"hour"  : "18:00",
		'season' : "winter",
		'active' : true,
		'productId' : result
	});
	BlockingDates.insert({
					'tripId' : tripID2,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});


	var tripID22 = Trips.insert({
		"from" 	: "Stykkisholmur",
		"to"	: "Brjanslækur",
		"hour"  : "09:00",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID22,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	var tripID3 = Trips.insert({
		"from" 	: "Stykkisholmur",
		"to"	: "Flatey",
		"hour"  : "09:00",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID3,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	var tripID4 = Trips.insert({
		"from" 	: "Flatey",
		"to"	: "Brjanslækur",
		"hour"  : "10:35",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID4,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});


	var tripID5 = Trips.insert({
		"from" 	: "Brjanslækur",
		"to"	: "Flatey",
		"hour"  : "12:15",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID5,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	var tripID6 = Trips.insert({
		"from" 	: "Brjanslækur",
		"to"	: "Stykkisholmur",
		"hour"  : "12:15",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});
	BlockingDates.insert({
					'tripId' : tripID6,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	var tripID7 = Trips.insert({
		"from" 	: "Flatey",
		"to"	: "Stykkisholmur",
		"hour"  : "13:15",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID7,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	var tripID8 = Trips.insert({
		"from" 	: "Stykkisholmur",
		"to"	: "Brjanslækur",
		"hour"  : "15:45",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

		BlockingDates.insert({
					'tripId' : tripID8,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	var tripID9 = Trips.insert({
		"from" 	: "Stykkisholmur",
		"to"	: "Flatey",
		"hour"  : "15:45",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID9,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	var tripID10 = Trips.insert({
		"from" 	: "Flatey",
		"to"	: "Brjanslækur",
		"hour"  : "17:15",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID10,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	var tripID11 = Trips.insert({
		"from" 	: "Brjanslækur",
		"to"	: "Flatey",
		"hour"  : "19:00",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID11,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	var tripID12 = Trips.insert({
		"from" 	: "Brjanslækur",
		"to"	: "Stykkisholmur",
		"hour"  : "19:00",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID12,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	var tripID13 = Trips.insert({
		"from" 	: "Flatey",
		"to"	: "Stykkisholmur",
		"hour"  : "20:00",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID13,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

  Prices.insert({
    "price" 	: "Adult",
    "unit"	: 5250,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID1,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Adult",
    "unit"	: 5250,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID2,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Adult",
    "unit"	: 5250,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID22,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Adult",
    "unit"	: 5250,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID6,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Adult",
    "unit"	: 5250,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID8,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Adult",
    "unit"	: 5250,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID12,
    'availableForGuest' : true
  });

  //Senior

  Prices.insert({
    "price" 	: "Senior",
    "unit"	: 4200,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID1,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Senior",
    "unit"	: 4200,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID2,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Senior",
    "unit"	: 4200,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID22,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Senior",
    "unit"	: 4200,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID6,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Senior",
    "unit"	: 4200,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID8,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Senior",
    "unit"	: 4200,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID12,
    'availableForGuest' : true
  });

  //Teenager

  Prices.insert({
    "price" 	: "Teenager",
    "unit"	: 2625,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID1,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Teenager",
    "unit"	: 2625,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID2,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Teenager",
    "unit"	: 2625,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID22,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Teenager",
    "unit"	: 2625,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID6,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Teenager",
    "unit"	: 2625,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID8,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Teenager",
    "unit"	: 2625,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID12,
    'availableForGuest' : true
  });

  //Child

  Prices.insert({
    "price" 	: "Child",
    "unit"	: 0,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID1,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Child",
    "unit"	: 0,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID2,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Child",
    "unit"	: 0,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID22,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Child",
    "unit"	: 0,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID6,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Child",
    "unit"	: 0,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID8,
    'availableForGuest' : true
  });

  Prices.insert({
    "price" 	: "Child",
    "unit"	: 0,
    'active' : true,
    'season' : 'summer',
    'productId' : result,
    'tripId' : tripID12,
    'availableForGuest' : true
  });

	//Winter Prices - Stykkisholmur-Brjansl
	////////////////////////////////////////
	Prices.insert({
   "price" 	: "Adult",
   "unit"	: 4080,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID1,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Adult",
   "unit"	: 4080,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID2,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Adult",
   "unit"	: 4080,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID22,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Adult",
   "unit"	: 4080,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID6,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Adult",
   "unit"	: 4080,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID8,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Adult",
   "unit"	: 4080,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID12,
   'availableForGuest' : true
 });

 //Senior

 Prices.insert({
   "price" 	: "Senior",
   "unit"	: 3260,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID1,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Senior",
   "unit"	: 3260,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID2,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Senior",
   "unit"	: 3260,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID22,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Senior",
   "unit"	: 3260,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID6,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Senior",
   "unit"	: 3260,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID8,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Senior",
   "unit"	: 3260,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID12,
   'availableForGuest' : true
 });

 //Teenager

 Prices.insert({
   "price" 	: "Teenager",
   "unit"	: 2040,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID1,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Teenager",
   "unit"	: 2040,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID2,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Teenager",
   "unit"	: 2040,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID22,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Teenager",
   "unit"	: 2040,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID6,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Teenager",
   "unit"	: 2040,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID8,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Teenager",
   "unit"	: 2040,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID12,
   'availableForGuest' : true
 });

 //Child

 Prices.insert({
   "price" 	: "Child",
   "unit"	: 0,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID1,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Child",
   "unit"	: 0,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID2,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Child",
   "unit"	: 0,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID22,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Child",
   "unit"	: 0,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID6,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Child",
   "unit"	: 0,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID8,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Child",
   "unit"	: 0,
   'active' : true,
   'season' : 'winter',
   'productId' : result,
   'tripId' : tripID12,
   'availableForGuest' : true
 });

 //Stykys to Flatey

 Prices.insert({
   "price" 	: "Adult",
   "unit"	: 3580,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID3,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Adult",
   "unit"	: 3580,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID7,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Adult",
   "unit"	: 3580,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID9,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Adult",
   "unit"	: 3580,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID13,
   'availableForGuest' : true
 });

 //Senior

 Prices.insert({
   "price" 	: "Senior",
   "unit"	: 2865,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID3,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Senior",
   "unit"	: 2865,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID7,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Senior",
   "unit"	: 2865,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID9,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Senior",
   "unit"	: 2865,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID13,
   'availableForGuest' : true
 });

 //Teenager

 Prices.insert({
   "price" 	: "Teenager",
   "unit"	: 1790,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID3,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Teenager",
   "unit"	: 1790,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID7,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Teenager",
   "unit"	: 1790,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID9,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Teenager",
   "unit"	: 1790,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID13,
   'availableForGuest' : true
 });

 //Child

 Prices.insert({
   "price" 	: "Child",
   "unit"	: 0,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID3,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Child",
   "unit"	: 0,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID7,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Child",
   "unit"	: 0,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID9,
   'availableForGuest' : true
 });

 Prices.insert({
   "price" 	: "Child",
   "unit"	: 0,
   'active' : true,
   'season' : 'summer',
   'productId' : result,
   'tripId' : tripID13,
   'availableForGuest' : true
 });


 //Winter Prices - Stykkisholmur-Flatey
 ////////////////////////////////////////
 Prices.insert({
  "price" 	: "Adult",
  "unit"	: 2810,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID3,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Adult",
  "unit"	: 2810,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID7,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Adult",
  "unit"	: 2810,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID9,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Adult",
  "unit"	: 2810,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID13,
  'availableForGuest' : true
});

//Senior

Prices.insert({
  "price" 	: "Senior",
  "unit"	: 2245,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID3,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Senior",
  "unit"	: 2245,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID7,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Senior",
  "unit"	: 2245,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID9,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Senior",
  "unit"	: 2245,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID13,
  'availableForGuest' : true
});


//Teenager

Prices.insert({
  "price" 	: "Teenager",
  "unit"	: 1405,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID3,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Teenager",
  "unit"	: 1405,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID7,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Teenager",
  "unit"	: 1405,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID9,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Teenager",
  "unit"	: 1405,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID13,
  'availableForGuest' : true
});

//Child

Prices.insert({
  "price" 	: "Child",
  "unit"	: 0,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID3,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Child",
  "unit"	: 0,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID7,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Child",
  "unit"	: 0,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID9,
  'availableForGuest' : true
});

Prices.insert({
  "price" 	: "Child",
  "unit"	: 0,
  'active' : true,
  'season' : 'winter',
  'productId' : result,
  'tripId' : tripID13,
  'availableForGuest' : true
});

// Flatey to Bjarbs


Prices.insert({
 "price" 	: "Adult",
 "unit"	: 2985,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID4,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Adult",
 "unit"	: 2985,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID5,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Adult",
 "unit"	: 2985,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID10,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Adult",
 "unit"	: 2985,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID11,
 'availableForGuest' : true
});

//Senior

Prices.insert({
 "price" 	: "Senior",
 "unit"	: 2388,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID4,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Senior",
 "unit"	: 2388,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID5,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Senior",
 "unit"	: 2388,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID10,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Senior",
 "unit"	: 2388,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID11,
 'availableForGuest' : true
});

//Teenager

Prices.insert({
 "price" 	: "Teenager",
 "unit"	: 1493,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID4,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Teenager",
 "unit"	: 1493,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID5,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Teenager",
 "unit"	: 1493,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID10,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Teenager",
 "unit"	: 1493,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID11,
 'availableForGuest' : true
});

//Child

Prices.insert({
 "price" 	: "Child",
 "unit"	: 0,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID4,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Child",
 "unit"	: 0,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID5,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Child",
 "unit"	: 0,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID10,
 'availableForGuest' : true
});

Prices.insert({
 "price" 	: "Child",
 "unit"	: 0,
 'active' : true,
 'season' : 'summer',
 'productId' : result,
 'tripId' : tripID11,
 'availableForGuest' : true
});


//Winter Prices - Bjarns-Flatey
////////////////////////////////////////
Prices.insert({
"price" 	: "Adult",
"unit"	: 2315,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID4,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Adult",
"unit"	: 2315,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID5,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Adult",
"unit"	: 2315,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID10,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Adult",
"unit"	: 2315,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID11,
'availableForGuest' : true
});

//Senior

Prices.insert({
"price" 	: "Senior",
"unit"	: 1852,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID4,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Senior",
"unit"	: 1852,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID5,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Senior",
"unit"	: 1852,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID10,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Senior",
"unit"	: 1852,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID11,
'availableForGuest' : true
});


//Teenager

Prices.insert({
"price" 	: "Teenager",
"unit"	: 1158,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID4,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Teenager",
"unit"	: 1158,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID5,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Teenager",
"unit"	: 1158,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID10,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Teenager",
"unit"	: 1158,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID11,
'availableForGuest' : true
});

//Child

Prices.insert({
"price" 	: "Child",
"unit"	: 0,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID4,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Child",
"unit"	: 0,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID5,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Child",
"unit"	: 0,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID10,
'availableForGuest' : true
});

Prices.insert({
"price" 	: "Child",
"unit"	: 0,
'active' : true,
'season' : 'winter',
'productId' : result,
'tripId' : tripID11,
'availableForGuest' : true
});


	result = Products.insert({
		"name" 			: "Viking Sushi Adventure",
		"active" 	: true,
		"boatId" : '2',
		'availableFor' : customersId,
		'imageName' : "sushi.jpg",
		'featured' : false,
    'order' : 0

	});

	var tripID14 = Trips.insert({
		"from" 	: "Viking Sushi Adventure",
		"to"	: "",
	  "hour"  : "14:15",
		'season' : "summer",
		'active' : true,
		'productId' : result
	});

	BlockingDates.insert({
					'tripId' : tripID14,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	Prices.insert({
		"price" 	: "Adult",
		"unit"	: 7090,
		'active' : true,
		'season' : 'both',
		'productId' : result,
    'tripId' : tripID14,
		'availableForGuest' : true
	})

	Prices.insert({
		"price" 	: "Child",
		"unit"	: 0,
		'active' : true,
		'season' : 'both',
		'productId' : result,
    'tripId' : tripID14,
		'availableForGuest' : true
	})

	Prices.insert({
		"price" 	: "Teenager",
		"unit"	: 3545,
		'active' : true,
		'season' : 'both',
		'productId' : result,
    'tripId' : tripID14,
		'availableForGuest' : true
	})

	Prices.insert({
		"price" 	: "Senior",
		"unit"	: 5672,
		'active' : true,
		'season' : 'both',
		'productId' : result,
    'tripId' : tripID14,
		'availableForGuest' : true
	})

	result = Products.insert({
		"name" 			: "Family Trip",
		"active" 	: true,
		"boatId" : '2',
		'availableFor' : customersId,
		'imageName' : "family.jpeg",
		'featured' : false,
    'order' : 1
	});

	var tripID15 = Trips.insert({
		"from" 	: "Family Trip",
		"to"	: "",
		"hour"  : "13:20",
		'season' : "summer",
		'active' : true,
		'productId' : result,
		'availableDays' : {start: '06/15/2014', end: '08/20/2014'}
	});
	BlockingDates.insert({
					'tripId' : tripID15,
					'availableWeekDays' : "true,true,true,true,true,true,true",
					'user' : "default",
					'type' : 'blockWeekDay'
				});

	Prices.insert({
		"price" 	: "Adult",
		"unit"	: 5250,
		'active' : true,
		'season' : 'both',
		'productId' : result,
    'tripId' : tripID15,
		'availableForGuest' : true
	})

	Prices.insert({
		"price" 	: "Child",
		"unit"	: 0,
		'active' : true,
		'season' : 'both',
		'productId' : result,
    'tripId' : tripID15,
		'availableForGuest' : true
	})

	Prices.insert({
		"price" 	: "Teenager",
		"unit"	: 2625,
		'active' : true,
		'season' : 'both',
		'productId' : result,
    'tripId' : tripID15,
		'availableForGuest' : true
	})

  Prices.insert({
    "price" 	: "Senior",
    "unit"	: 4200,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID15,
    'availableForGuest' : true
  })

  result = Products.insert({
    "name" 			: "Taste of Iceland",
    "active" 	: true,
    "boatId" : '2',
    'availableFor' : customersId,
    'imageName' : "tasteoficeland.jpg",
    'featured' : false,
    'order' : 1
  });

  var tripID16 = Trips.insert({
    "from" 	: "Taste of Iceland",
    "to"	: "",
    "hour"  : "14:30",
    'season' : "summer",
    'active' : true,
    'productId' : result,
    'availableDays' : {start: '05/17/2014', end: '08/20/2014'}
  });

  BlockingDates.insert({
          'tripId' : tripID16,
          'availableWeekDays' : "true,true,true,true,true,true,true",
          'user' : "default",
          'type' : 'blockWeekDay'
        });

  Prices.insert({
    "price" 	: "Adult",
    "unit"	: 9270,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID16,
    'availableForGuest' : true
  })

  Prices.insert({
    "price" 	: "Child",
    "unit"	: 1500,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID16,
    'availableForGuest' : true
  })

  Prices.insert({
    "price" 	: "Teenager",
    "unit"	: 4635,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID16,
    'availableForGuest' : true
  })

  Prices.insert({
    "price" 	: "Senior",
    "unit"	: 7416,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID16,
    'availableForGuest' : true
  })

  result = Products.insert({
    "name" 			: "Vortilboð",
    "active" 	: true,
    "boatId" : '2',
    'availableFor' : "admin",
    'imageName' : "vortilboo.jpg",
    'featured' : false,
    'order' : 1
  });

  var tripID17 = Trips.insert({
    "from" 	: "Vortilboð",
    "to"	: "",
    "hour"  : "00:00",
    'season' : "noSeason",
    'active' : true,
    'productId' : result,
    'availableDays' : {start: '15/03/2014', end: '10/06/2014'}
  });

  BlockingDates.insert({
          'tripId' : tripID17,
          'availableWeekDays' : "true,true,true,true,true,true,true",
          'user' : "default",
          'type' : 'blockWeekDay'
        });

  Prices.insert({
    "price" 	: "Adult",
    "unit"	: 9275,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID17,
    'availableForGuest' : true
  })

  Prices.insert({
    "price" 	: "Child",
    "unit"	: 1500,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID17,
    'availableForGuest' : true
  })

  Prices.insert({
    "price" 	: "Teenager",
    "unit"	: 4638,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID17,
    'availableForGuest' : true
  })

  Prices.insert({
    "price" 	: "Senior",
    "unit"	: 7420,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID17,
    'availableForGuest' : true
  })

  result = Products.insert({
    "name" 			: "Veisluferð 3-4",
    "active" 	: true,
    "boatId" : '2',
    'availableFor' : "admin",
    'imageName' : "veislufero.jpeg",
    'featured' : false,
    'order' : 1
  });

  var tripID18 = Trips.insert({
    "from" 	: "Veisluferð 3-4",
    "to"	: "",
    "hour"  : "00:00",
    'season' : "summer",
    'active' : true,
    'productId' : result,
    'availableDays' : {start: '15/03/2014', end: '10/06/2014'}
  });

  BlockingDates.insert({
          'tripId' : tripID18,
          'availableWeekDays' : "true,true,true,true,true,true,true",
          'user' : "default",
          'type' : 'blockWeekDay'
        });

  Prices.insert({
    "price" 	: "Adult",
    "unit"	: 11990,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID18,
    'availableForGuest' : true
  })

  Prices.insert({
    "price" 	: "Child",
    "unit"	: 1500,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID18,
    'availableForGuest' : true
  })

  Prices.insert({
    "price" 	: "Teenager",
    "unit"	: 5995,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID18,
    'availableForGuest' : true
  })

  Prices.insert({
    "price" 	: "Senior",
    "unit"	: 9590,
    'active' : true,
    'season' : 'both',
    'productId' : result,
    'tripId' : tripID18,
    'availableForGuest' : true
  })







}

if(VehiclesCategory.find().count() == 0){
	VehiclesCategory.insert({
		"category" 	: "Normal Car",
		"size"		: [5, 6, 7],
		"basePrice" : 5250,
		'baseSize'  : 5,
		'onReduce'  : false,
		'step'      : 1790,
    'season' : "summer"
	});

	VehiclesCategory.insert({
		"category" 	: "Normal car with cart",
		"size"		: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
		"basePrice" : 9960,
		'baseSize'  : 10,
		'onReduce'  : false,
		'step'      : 1790,
    'season' : "summer"
	});

	VehiclesCategory.insert({
		"category" 	: "Small car",
		"size"		: [4.5],
		"basePrice" : 5250,
		'baseSize'  : 4.5,
		'onReduce'  : false,
		'step'      : 1790,
    'season' : "summer"
	});

	VehiclesCategory.insert({
		"category" 	: "Motorcycle",
		"size"		: [2.5],
		"basePrice" : 3120,
		'baseSize'  : 2.5,
		'onReduce'  : false,
		'step'      : 1790,
    'season' : "summer"
	});

	VehiclesCategory.insert({
		"category" 	: "Lorry I/VAT",
		"size"		: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
		"basePrice" : 41074,
		'baseSize'  : 11,
		'onReduce'  : true,
		'step'      : 3734,
    'season' : "summer"
	});

	VehiclesCategory.insert({
		"category" 	: "Normal car with trailler/caravan",
		"size"		: [10, 11, 12, 13, 14, 15],
		"basePrice" : 12860,
		'baseSize'  : 10,
		'onReduce'  : false,
		'step'      : 1790,
    'season' : "summer"
	});

	VehiclesCategory.insert({
		"category" 	: "Van I/VAT",
		"size"		: [5, 6, 7 ,8 , 9, 10, 11],
		"basePrice" : 17712,
		'baseSize'  : 8,
		'onReduce'  : true,
		'step'      : 2214,
    'season' : "summer"
	});

	VehiclesCategory.insert({
		"category" 	: "Cart (without car)",
		"size"		: [2, 3, 4, 5, 6, 7 ,8 , 9],
		"basePrice" : 4710,
		'baseSize'  : 5,
		'onReduce'  : false,
		'step'      : 1790,
    'season' : "summer"
	});

	VehiclesCategory.insert({
		"category" 	: "Large Car / Motor-Home",
		"size"		: [5, 6, 7 ,8 , 9, 10, 11, 12, 13, 14, 15],
		"basePrice" : 7610,
		'baseSize'  : 5,
		'onReduce'  : false,
		'step'      : 1790,
    'season' : "summer"
	});

	VehiclesCategory.insert({
		"category" 	: "Bus",
		"size"		: [6, 7 ,8 , 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		"basePrice" : 16960,
		'baseSize'  : 8,
		'onReduce'  : true,
		'step'      : 2120,
    'season' : "summer"
	});

	VehiclesCategory.insert({
		"category" 	: "Jeep",
		"size"		: [4, 5, 6, 7],
		"basePrice" : 5250,
		'baseSize'  : 5,
		'onReduce'  : false,
		'step'      : 1790,
    'season' : "summer"
	});

	VehiclesCategory.insert({
		"category" 	: "Extra Large Car / Tractor",
		"size"		: [5, 6, 7 ,8 , 9, 10, 11, 12, 13, 14, 15],
		"basePrice" : 7610,
		'baseSize'  : 5,
		'onReduce'  : false,
		'step'      : 1790,
    'season'      : 'summer',
	});

  VehiclesCategory.insert({
    "category" 	: "Car to Flatey",
    "size"		: [5, 6, 7],
    "basePrice" : 7610,
    'baseSize'  : 5,
    'onReduce'  : false,
    'step'      : 1790,
    'season' : "summer"
  });

  VehiclesCategory.insert({
    "category" 	: "Cart to Flatey",
    "size"		: [5, 6, 7],
    "basePrice" : 5250,
    'baseSize'  : 5,
    'onReduce'  : false,
    'step'      : 1790,
    'season' : "summer"
  });

  VehiclesCategory.insert({
    "category" 	: "Oil Cart",
    "size"		: [5],
    "basePrice" : 8212,
    'baseSize'  : 5,
    'onReduce'  : false,
    'step'      : 1790,
    'season' : "summer"
  });

  //Winter Prices

  VehiclesCategory.insert({
    "category" 	: "Normal Car",
    "size"		: [5, 6, 7],
    "basePrice" : 4080,
    'baseSize'  : 5,
    'onReduce'  : false,
    'step'      : 1625,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Normal car with cart",
    "size"		: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    "basePrice" : 7815,
    'baseSize'  : 10,
    'onReduce'  : false,
    'step'      : 1625,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Small car",
    "size"		: [4.5],
    "basePrice" : 4080,
    'baseSize'  : 4.5,
    'onReduce'  : false,
    'step'      : 1625,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Motorcycle",
    "size"		: [2.5],
    "basePrice" : 2442,
    'baseSize'  : 2.5,
    'onReduce'  : false,
    'step'      : 1625,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Lorry I/VAT",
    "size"		: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    "basePrice" : 41074,
    'baseSize'  : 11,
    'onReduce'  : true,
    'step'      : 3734,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Normal car with trailler/caravan",
    "size"		: [10, 11, 12, 13, 14, 15],
    "basePrice" : 10030,
    'baseSize'  : 10,
    'onReduce'  : false,
    'step'      : 1625,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Van I/VAT",
    "size"		: [5, 6, 7 ,8 , 9, 10, 11],
    "basePrice" : 17712,
    'baseSize'  : 8,
    'onReduce'  : true,
    'step'      : 2214,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Cart (without car)",
    "size"		: [2, 3, 4, 5, 6, 7 ,8 , 9],
    "basePrice" : 3735,
    'baseSize'  : 5,
    'onReduce'  : false,
    'step'      : 1625,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Large Car / Motor-Home",
    "size"		: [5, 6, 7 ,8 , 9, 10, 11, 12, 13, 14, 15],
    "basePrice" : 5950,
    'baseSize'  : 5,
    'onReduce'  : false,
    'step'      : 1625,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Bus",
    "size"		: [6, 7 ,8 , 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    "basePrice" : 13080,
    'baseSize'  : 8,
    'onReduce'  : true,
    'step'      : 1635,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Jeep",
    "size"		: [4, 5, 6, 7],
    "basePrice" : 4080,
    'baseSize'  : 5,
    'onReduce'  : false,
    'step'      : 1625,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Extra Large Car / Tractor",
    "size"		: [5, 6, 7 ,8 , 9, 10, 11, 12, 13, 14, 15],
    "basePrice" : 5950,
    'baseSize'  : 5,
    'onReduce'  : false,
    'step'      : 1625,
    'season'      : 'winter',
  });

  VehiclesCategory.insert({
    "category" 	: "Car to Flatey",
    "size"		: [5, 6, 7],
    "basePrice" : 5950,
    'baseSize'  : 5,
    'onReduce'  : false,
    'step'      : 1625,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Cart to Flatey",
    "size"		: [2, 3, 4, 5, 6, 7 ,8 , 9],
    "basePrice" : 4080,
    'baseSize'  : 5,
    'onReduce'  : false,
    'step'      : 1545,
    'season' : "winter"
  });

  VehiclesCategory.insert({
    "category" 	: "Oil Cart",
    "size"		: [5],
    "basePrice" : 8212,
    'baseSize'  : 5,
    'onReduce'  : false,
    'step'      : 1790,
    'season' : "winter"
  });
}

customerID = "";
customerID2 = "";

if(Customers.find().count() == 0){

}


if(Meteor.users.find().count() == 0){
	Accounts.createUser({
	  'username'  : 'skrifstofa5211',
	  'email'     : 'admin@seatours.com',
	  'profile'	  : {'groupID' : admId, 'name' : 'Skrifstofa'},
	  'password'  : '9876' //encrypted automatically
	});

  Initials.insert({
    initial : "SP",
    fullName : 'Siggeir Petursson'
  })
}

if(PostCodes.find().count() == 0){

	//1xx Reykjavík North, Reykjavík South, Southwest & South

	PostCodes.insert({
		'postcode' : 101,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 102,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 103,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 104,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 105,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 107,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 108,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 109,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 110,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 111,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 112,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 113,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 116,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 121,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 123,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 124,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 125,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 127,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 128,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 129,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 130,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 132,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 150,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 155,
		'city'     : 'Reykjavík'
	})

	PostCodes.insert({
		'postcode' : 170,
		'city'     : 'Seltjarnarnes'
	})

	PostCodes.insert({
		'postcode' : 172,
		'city'     : 'Seltjarnarnes'
	})

	PostCodes.insert({
		'postcode' : 190,
		'city'     : 'Vogar'
	})

	//2xx Southwest & South

	PostCodes.insert({
		'postcode' : 200,
		'city'     : 'Kópavogur'
	})

	PostCodes.insert({
		'postcode' : 201,
		'city'     : 'Kópavogur'
	})

	PostCodes.insert({
		'postcode' : 202,
		'city'     : 'Kópavogur'
	})

	PostCodes.insert({
		'postcode' : 210,
		'city'     : 'Kópavogur'
	})

	PostCodes.insert({
		'postcode' : 212,
		'city'     : 'Garðabær'
	})

	PostCodes.insert({
		'postcode' : 220,
		'city'     : 'Hafnarfjörður'
	})

	PostCodes.insert({
		'postcode' : 221,
		'city'     : 'Hafnarfjörður'
	})

	PostCodes.insert({
		'postcode' : 222,
		'city'     : 'Hafnarfjörður'
	})

	PostCodes.insert({
		'postcode' : 225,
		'city'     : 'Garðabær'
	})

	PostCodes.insert({
		'postcode' : 230,
		'city'     : 'Reykjanesbær'
	})

	PostCodes.insert({
		'postcode' : 232,
		'city'     : 'Reykjanesbær'
	})

	PostCodes.insert({
		'postcode' : 233,
		'city'     : 'Reykjanesbær'
	})

	PostCodes.insert({
		'postcode' : 235,
		'city'     : 'Reykjanesbær'
	})

	PostCodes.insert({
		'postcode' : 240,
		'city'     : 'Grindavík'
	})

	PostCodes.insert({
		'postcode' : 245,
		'city'     : 'Sandgerði'
	})

	PostCodes.insert({
		'postcode' : 250,
		'city'     : 'Garður'
	})

	PostCodes.insert({
		'postcode' : 260,
		'city'     : 'Reykjanesbær'
	})

	PostCodes.insert({
		'postcode' : 270,
		'city'     : 'Mosfellsbær'
	})

	PostCodes.insert({
		'postcode' : 271,
		'city'     : 'Mosfellsbær'
	})

	PostCodes.insert({
		'postcode' : 276,
		'city'     : 'Mosfellsbær'
	})

	//3xx Northwest & South

	PostCodes.insert({
		'postcode' : 300,
		'city'     : 'Akranes'
	})

	PostCodes.insert({
		'postcode' : 301,
		'city'     : 'Akranes'
	})

	PostCodes.insert({
		'postcode' : 302,
		'city'     : 'Akranes'
	})

	PostCodes.insert({
		'postcode' : 310,
		'city'     : 'Borgarnes'
	})

	PostCodes.insert({
		'postcode' : 311,
		'city'     : 'Borgarnes'
	})

	PostCodes.insert({
		'postcode' : 320,
		'city'     : 'Reykholt'
	})

	PostCodes.insert({
		'postcode' : 340,
		'city'     : 'Stykkishólmur'
	})

	PostCodes.insert({
		'postcode' : 345,
		'city'     : 'Flatey'
	})

	PostCodes.insert({
		'postcode' : 350,
		'city'     : 'Grundarfjörður'
	})

	PostCodes.insert({
		'postcode' : 355,
		'city'     : 'Ólafsvík'
	})

	PostCodes.insert({
		'postcode' : 356,
		'city'     : 'Snæfellsbær'
	})

	PostCodes.insert({
		'postcode' : 360,
		'city'     : 'Hellissandur'
	})

	PostCodes.insert({
		'postcode' : 370,
		'city'     : 'Búðardalur'
	})

	PostCodes.insert({
		'postcode' : 371,
		'city'     : 'Búðardalur'
	})

	PostCodes.insert({
		'postcode' : 380,
		'city'     : 'Reykhólahreppur'
	})

	//4xx: Northwest

	PostCodes.insert({
		'postcode' : 400,
		'city'     : 'Ísafjörður'
	})

	PostCodes.insert({
		'postcode' : 401,
		'city'     : 'Ísafjörður'
	})

	PostCodes.insert({
		'postcode' : 410,
		'city'     : 'Hnífsdalur'
	})

	PostCodes.insert({
		'postcode' : 415,
		'city'     : 'Bolungarvík'
	})

	PostCodes.insert({
		'postcode' : 420,
		'city'     : 'Súðavík'
	})

	PostCodes.insert({
		'postcode' : 425,
		'city'     : 'Flateyri'
	})

	PostCodes.insert({
		'postcode' : 430,
		'city'     : 'Suðureyri'
	})

	PostCodes.insert({
		'postcode' : 450,
		'city'     : 'Patreksfjörður'
	})

	PostCodes.insert({
		'postcode' : 451,
		'city'     : 'Patreksfjörður'
	})

	PostCodes.insert({
		'postcode' : 460,
		'city'     : 'Tálknafjörður'
	})

	PostCodes.insert({
		'postcode' : 465,
		'city'     : 'Bíldudalur'
	})

	PostCodes.insert({
		'postcode' : 470,
		'city'     : 'Þingeyri'
	})

	PostCodes.insert({
		'postcode' : 471,
		'city'     : 'Þingeyri'
	})

	//5xx: Northwest


	PostCodes.insert({
		'postcode' : 500,
		'city'     : 'Staður'
	})

	PostCodes.insert({
		'postcode' : 510,
		'city'     : 'Hólmavík'
	})

	PostCodes.insert({
		'postcode' : 512,
		'city'     : 'Hólmavík'
	})

	PostCodes.insert({
		'postcode' : 520,
		'city'     : 'Drangsnes'
	})

	PostCodes.insert({
		'postcode' : 524,
		'city'     : 'Árneshreppur'
	})

	PostCodes.insert({
		'postcode' : 530,
		'city'     : 'Hvammstangi'
	})

	PostCodes.insert({
		'postcode' : 531,
		'city'     : 'Hvammstangi'
	})

	PostCodes.insert({
		'postcode' : 540,
		'city'     : 'Blönduós'
	})

	PostCodes.insert({
		'postcode' : 541,
		'city'     : 'Blönduós'
	})

	PostCodes.insert({
		'postcode' : 545,
		'city'     : 'Skagaströnd'
	})

	PostCodes.insert({
		'postcode' : 550,
		'city'     : 'Sauðárkrókur'
	})

	PostCodes.insert({
		'postcode' : 551,
		'city'     : 'Sauðárkrókur'
	})

	PostCodes.insert({
		'postcode' : 560,
		'city'     : 'Varmahlíð'
	})


	PostCodes.insert({
		'postcode' : 565,
		'city'     : 'Hofsós'
	})

	PostCodes.insert({
		'postcode' : 566,
		'city'     : 'Hofsós'
	})

	PostCodes.insert({
		'postcode' : 570,
		'city'     : 'Fljót'
	})

	PostCodes.insert({
		'postcode' : 580,
		'city'     : 'Siglufjörður'
	})

	//6xx: Northeast

	PostCodes.insert({
		'postcode' : 600,
		'city'     : 'Akureyri'
	})

	PostCodes.insert({
		'postcode' : 601,
		'city'     : 'Akureyri'
	})

	PostCodes.insert({
		'postcode' : 602,
		'city'     : 'Akureyri'
	})

	PostCodes.insert({
		'postcode' : 603,
		'city'     : 'Akureyri'
	})

	PostCodes.insert({
		'postcode' : 610,
		'city'     : 'Grenivík'
	})

	PostCodes.insert({
		'postcode' : 611,
		'city'     : 'Grímsey'
	})

	PostCodes.insert({
		'postcode' : 620,
		'city'     : 'Dalvík'
	})

	PostCodes.insert({
		'postcode' : 621,
		'city'     : 'Dalvík'
	})

	PostCodes.insert({
		'postcode' : 625,
		'city'     : 'Ólafsfjörður'
	})

	PostCodes.insert({
		'postcode' : 630,
		'city'     : 'Hrísey'
	})

	PostCodes.insert({
		'postcode' : 640,
		'city'     : 'Húsavík'
	})

	PostCodes.insert({
		'postcode' : 641,
		'city'     : 'Húsavík'
	})

	PostCodes.insert({
		'postcode' : 645,
		'city'     : 'Fosshóll'
	})


	PostCodes.insert({
		'postcode' : 650,
		'city'     : 'Laugar'
	})

	PostCodes.insert({
		'postcode' : 660,
		'city'     : 'Mývatn'
	})

	PostCodes.insert({
		'postcode' : 670,
		'city'     : 'Kópasker'
	})

	PostCodes.insert({
		'postcode' : 671,
		'city'     : 'Kópaskeri'
	})

	PostCodes.insert({
		'postcode' : 675,
		'city'     : 'Raufarhöfn'
	})

	PostCodes.insert({
		'postcode' : 680,
		'city'     : 'Þórshöfn'
	})

	PostCodes.insert({
		'postcode' : 681,
		'city'     : 'Þórshöfn'
	})

	PostCodes.insert({
		'postcode' : 685,
		'city'     : 'Bakkafjörður'
	})

	PostCodes.insert({
		'postcode' : 690,
		'city'     : 'Vopnafjörður'
	})

	//7xx: Northeast & South

	PostCodes.insert({
		'postcode' : 700,
		'city'     : 'Egilsstaðir'
	})

	PostCodes.insert({
		'postcode' : 701,
		'city'     : 'Egilsstaðir'
	})

	PostCodes.insert({
		'postcode' : 710,
		'city'     : 'Seyðisfjörður'
	})

	PostCodes.insert({
		'postcode' : 715,
		'city'     : 'Mjóifjörður'
	})

	PostCodes.insert({
		'postcode' : 720,
		'city'     : 'Borgarfjörður'
	})

	PostCodes.insert({
		'postcode' : 730,
		'city'     : 'Reyðarfjörður'
	})

	PostCodes.insert({
		'postcode' : 735,
		'city'     : 'Eskifjörður'
	})

	PostCodes.insert({
		'postcode' : 740,
		'city'     : 'Neskaupstaður'
	})

	PostCodes.insert({
		'postcode' : 750,
		'city'     : 'Fáskrúðsfjörður'
	})

	PostCodes.insert({
		'postcode' : 755,
		'city'     : 'Stöðvarfjörður'
	})

	PostCodes.insert({
		'postcode' : 760,
		'city'     : 'Breiðdalsvík'
	})

	PostCodes.insert({
		'postcode' : 765,
		'city'     : 'Djúpivogur'
	})

	PostCodes.insert({
		'postcode' : 780,
		'city'     : 'Höfn'
	})


	PostCodes.insert({
		'postcode' : 781,
		'city'     : 'Höfn'
	})

	PostCodes.insert({
		'postcode' : 785,
		'city'     : 'Öræfi'
	})

	//8xx: South

	PostCodes.insert({
		'postcode' : 800,
		'city'     : 'Selfoss'
	})

	PostCodes.insert({
		'postcode' : 801,
		'city'     : 'Selfoss'
	})

	PostCodes.insert({
		'postcode' : 802,
		'city'     : 'Selfoss'
	})

	PostCodes.insert({
		'postcode' : 810,
		'city'     : 'Hveragerði'
	})

	PostCodes.insert({
		'postcode' : 815,
		'city'     : 'Þorlákshöfn'
	})

	PostCodes.insert({
		'postcode' : 816,
		'city'     : 'Ölfus'
	})

	PostCodes.insert({
		'postcode' : 820,
		'city'     : 'Eyrarbakki'
	})

	PostCodes.insert({
		'postcode' : 825,
		'city'     : 'Stokkseyri'
	})

	PostCodes.insert({
		'postcode' : 840,
		'city'     : 'Laugarvatn'
	})

	PostCodes.insert({
		'postcode' : 845,
		'city'     : 'Flúðir'
	})

	PostCodes.insert({
		'postcode' : 850,
		'city'     : 'Hella'
	})

	PostCodes.insert({
		'postcode' : 851,
		'city'     : 'Hella'
	})

	PostCodes.insert({
		'postcode' : 860,
		'city'     : 'Hvolsvöllur'
	})


	PostCodes.insert({
		'postcode' : 861,
		'city'     : 'Hvolsvöllur'
	})

	PostCodes.insert({
		'postcode' : 870,
		'city'     : 'Vík'
	})

	PostCodes.insert({
		'postcode' : 871,
		'city'     : 'Vík'
	})

	PostCodes.insert({
		'postcode' : 880,
		'city'     : 'Kirkjubæjarklaustur'
	})

	//9xx: South

	PostCodes.insert({
		'postcode' : 900,
		'city'     : 'Vestmannaeyjar'
	})

	PostCodes.insert({
		'postcode' : 902,
		'city'     : 'Vestmannaeyjar'
	})

	//////////////////////////////////////////////////
	// Settings

	Settings.insert({'summerStartDate' : '01/06',
					 '_id' : 'summer'});
	Settings.insert({'winterStartDate' : '01/09',
					 '_id' : 'winter'});
	Settings.insert({'onlineDiscount' : 10,
					 '_id' : 'onlineDiscount'});
	Settings.insert({'operatorFee' : 3000,
					 '_id' : 'operatorFee'});
}

var callback = function(data){
	Fiber = Npm.require('fibers')
	Fiber(function(){
			for (var i = 1; i < data.length; i++) {
			var Car = {
				'brandname' : data[i].brandname.charAt(0).toUpperCase() + data[i].brandname.slice(1),
				'model' : data[i].model.charAt(0).toUpperCase() + data[i].model.slice(1),
				'modelBody' : data[i].modelBody,
				'weight' : data[i].weight,
				'length' : data[i].length,
				'width' : data[i].width,
				'height' : data[i].heigth
			}
			Cars.insert(Car);
		};
	}).run();
}


var callbackCSV = function(data){
	var a = CSVToArray(data, '');
	console.log(a[1]);
}

/*
if(Cars.find().count() == 0){

    var fs  = Npm.require("fs");
    var jumpFirstLine = true;

	fs.readFileSync('../../../../../public/cars.csv').toString().split('\n').forEach(function (line) {
    	car = line.split(',');
    	var Car = {
				'brandname' : car[1] ? car[1].charAt(0).toUpperCase() + car[1].slice(1) : '',
				'model' : car[2] ? car[2].charAt(0).toUpperCase() + car[2].slice(1) :  '',
				'modelTrim' : car[3] ? car[3].charAt(0).toUpperCase() + car[3].slice(1) : '',
				'modelYear' : car[4],
				'modelBody' : car[5],
				'weight' : car[25],
				'length' : car[26],
				'width' : car[27],
				'height' : car[28]
			}
		if(jumpFirstLine)
			jumpFirstLine = false;
		else
			Cars.insert(Car);
	});



}*/
