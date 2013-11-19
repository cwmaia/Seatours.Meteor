Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://postmaster%40seatours.com:2-j--rmow2s5@smtp.mailgun.org:587';
});

var extraSlots = ['NO', 'EXTRASLOT1', 'EXTRASLOT2'];

var realocate = function(vehicleSize, resumeStatus, from, to, product, trip){

	var spaceAvailableSlot1 = (resumeStatus.totalSpaceSlot1 - resumeStatus.spaceOnExtraSlot1);
	var spaceAvailableSlot2 = (resumeStatus.totalSpaceSlot2 - resumeStatus.spaceOnExtraSlot2);

	var carsToMove = [];
	var booksToChange = [];
	console.log("Vehicle Size: "+vehicleSize);
	console.log("Resume Status 1: "+resumeStatus.totalSpaceSlot1);
	console.log("Resume Status 2: "+resumeStatus.totalSpaceSlot2);
	console.log("Space Available 1: "+spaceAvailableSlot1);
	console.log("Space Available 2: "+spaceAvailableSlot2);

	with(from){
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	with(to){
		setDate(getDate() + 1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	//If vehicle can go on slot 1
	if(vehicleSize <= resumeStatus.totalSpaceSlot1){
		//Hey look it can goes on this slot
		//but we have to realocate the vehicles inside of it
		temporalSpaceAvailableSlot1 = spaceAvailableSlot1;
		temporalSpaceAvailableSlot2 = spaceAvailableSlot2;

		books = Books.find({
			dateOfBooking 	: {$gte: from, $lt: to},
			'product._id' 	: product._id,
			'trip.from' 	: trip.from,
			'vehicle.extraSlot' : extraSlots[1]
		}).fetch();

		//There is no car so add =]
		if(books.length == 0){
			return 'EXTRASLOT1';
		}else{
			for (var i = 0; i < books.length; i++) {
			//can i move this car on other slot??
				if(books[i].vehicle.size <= temporalSpaceAvailableSlot2){
					carsToMove.push(books[i]);
					temporalSpaceAvailableSlot2 += books[i].vehicle.size;
				}
			};

			for (var j = 0; j < carsToMove.length; j++) {
				console.log("Before: "+temporalSpaceAvailableSlot1);
				temporalSpaceAvailableSlot1 += carsToMove[j].vehicle.size;
				booksToChange.push(carsToMove[j]);
				console.log("Size of Vehicle: "+carsToMove[j].vehicle.size);
				console.log("temporalSpaceAvailableSlot1: "+temporalSpaceAvailableSlot1);
				//The vehicle can go???
				if(vehicleSize <= temporalSpaceAvailableSlot1){
					//Yeaaaa!!
					for (var k = 0; k < booksToChange.length; k++) {
						book = booksToChange[k];
						book.vehicle.extraSlot = 'EXTRASLOT2';
						Books.update(book._id, book);
					};
					console.log('EXTRASLOT1');
					return 'EXTRASLOT1';
				} 
			};
		}
	//If vehicle can go on slot 2	
	}

	if(vehicleSize <= resumeStatus.totalSpaceSlot2){
		console.log('aqui - 2');
		//Hey look it can goes on this slot
		//but we have to realocate the vehicles inside of it
		temporalSpaceAvailableSlot1 = spaceAvailableSlot1;
		temporalSpaceAvailableSlot2 = spaceAvailableSlot2;

		books = Books.find({
			dateOfBooking 	: {$gte: from, $lt: to},
			'product._id' 	: product._id,
			'trip.from' 	: trip.from,
			'vehicle.extraSlot' : extraSlots[2]
		}).fetch();

		//There is no car so add =]
		if(books.length == 0){
			return 'EXTRASLOT2';
		}else{
			for (var i = 0; i < books.length; i++) {
			//can i move this car on other slot??
				if(books[i].vehicle.size <= temporalSpaceAvailableSlot1){
					carsToMove.push(books[i]);
					temporalSpaceAvailableSlot1 += books[i].vehicle.size;
				}
			};

			for (var j = 0; j < carsToMove.length; j++) {
				temporalSpaceAvailableSlot2 += carsToMove[j].vehicle.size;
				booksToChange.push(carsToMove[j]);
				//The vehicle can go???
				if(vehicleSize <= temporalSpaceAvailableSlot2){
					//Yeaaaa!!

					for (var k = 0; k < booksToChange.length; k++) {
						book = booksToChange[k];
						book.vehicle.extraSlot = 'EXTRASLOT1';
						Books.update(book._id, book);
					};
					console.log('EXTRASLOT2');
					return 'EXTRASLOT2';
				} 
			};
		}	
	}
	//Sad but it can't go
	console.log('false');
	return false;
}


var calcSpaceOnExtraSlots = function(from, to, product, trip){
	//calc space available on extra slot 1
	var spaceOnExtraSlot1 = 0;
	var spaceOnExtraSlot2 = 0;

	books = Books.find({
		dateOfBooking 	: {$gte: from, $lt: to},
		'product._id' 	: product._id,
		'trip.from' 	: trip.from,
		'vehicle.extraSlot' : extraSlots[1]
	}).fetch();

	for (var i = 0; i < books.length; i++) {
		spaceOnExtraSlot1 += books[i].vehicle.size;
	};

	books = Books.find({
		dateOfBooking 	: {$gte: from, $lt: to},
		'product._id' 	: product._id,
		'trip.from' 	: trip.from,
		'vehicle.extraSlot' : extraSlots[2]
	}).fetch();

	for (var j = 0; j < books.length; j++) {
		spaceOnExtraSlot2 += books[j].vehicle.size;
	};

	countVehicle5m = Books.find({
		dateOfBooking 	: {$gte: from, $lt: to},
		'product._id' 	: product._id,
		'trip.from' 	: trip.from,
		'vehicle.size'  : {$gt: 0, $lte: 5},
		'vehicle.extraSlot' : extraSlots[0]
	}).count();

	totalSpaceSlot1 = 24;
	totalSpaceSlot2 = 24;

	if(countVehicle5m == 25){
		totalSpaceSlot2 = 19;
	}

	if(countVehicle5m > 25 && countVehicle5m <= 27){
		totalSpaceSlot1 = 19;
		totalSpaceSlot2 = 19;
	}

	if(countVehicle5m == 28){
		totalSpaceSlot1 = 19;
		totalSpaceSlot2 = 15;
	}

	if(countVehicle5m > 28 && countVehicle5m <= 30){
		totalSpaceSlot1 = 15;
		totalSpaceSlot2 = 15;
	}



	spaceOnSlots = {
		totalSpaceSlot1 : totalSpaceSlot1, 
		spaceOnExtraSlot1 : spaceOnExtraSlot1,
		totalSpaceSlot2 : totalSpaceSlot2,
		spaceOnExtraSlot2 : spaceOnExtraSlot2,
		numberOf5MetersVehicles : countVehicle5m
	}

	return spaceOnSlots;


}

var getTotalExtraSpaceSlot = function(from, to, product, trip, extraSlot){

	extraSpace = 15;

	books = Books.find({
		dateOfBooking 	: {$gte: from, $lt: to},
		'product._id' 	: product._id,
		'trip.from' 	: trip.from,
		'vehicle.extraSlot' : extraSlot
	}).fetch();

	var spaceAlocated = 0;

	for (var i = 0; i < books.length; i++) {
		spaceAlocated += books[i].vehicle.size;
	};

	extraSpace = extraSpace - spaceAlocated;

	return extraSpace;
}

var alocateCarExtraSlots = function(from, to, product, trip, size){
	var extraSlotsResume = calcSpaceOnExtraSlots(from, to, product, trip);
	return realocate(size, extraSlotsResume, from, to, product, trip);
}



var getMaxCarsUpTo5 = function(boatId){
	boat = Boats.findOne({_id: "1"});
	getMax = 0;

	for (var i = 0; i < boat.status.length; i++) {
		if(boat.status[i].qtdCarsUpTo_5 > getMax){
			getMax = boat.status[i].qtdCarsUpTo_5;
		}
	};

	return getMax;
}

var getMaxCarsUpTo6 = function(boatId){
	boat = Boats.findOne({_id: "1"});
	getMax = 0;

	for (var i = 0; i < boat.status.length; i++) {
		if(boat.status[i].qtdCarsUpTo_6 > getMax){
			getMax = boat.status[i].qtdCarsUpTo_6;
		}
	};

	return getMax;
}

if(Boats.find().count() == 0){
	Boats.insert({
	"_id" : "1",
	"name" : "Baldur Ferry",
	"maxCapacity" : 300,
	'status' : [
		{
			"qtdCarsUpTo_5" : 24,
			"qtdCarsUpTo_6" : 4,
			"bigSlotOne" : 24,
			"bigSlotTwo" : 24
		},
		{
			"qtdCarsUpTo_5" : 25,
			"qtdCarsUpTo_6" : 4,
			"bigSlotOne" : 24,
			"bigSlotTwo" : 19
		},
		{
			"qtdCarsUpTo_5" : 27,
			"qtdCarsUpTo_6" : 4,
			"bigSlotOne" : 19,
			"bigSlotTwo" : 19
		},
		{
			"qtdCarsUpTo_5" : 28,
			"qtdCarsUpTo_6" : 4,
			"bigSlotOne" : 19,
			"bigSlotTwo" : 15
		},
		{
			"qtdCarsUpTo_5" : 30,
			"qtdCarsUpTo_6" : 4,
			"bigSlotOne" : 15,
			"bigSlotTwo" : 15
		}
	]
	})
}

if(Products.find().count() == 0){
	Products.insert({
		"name" 			: "Baldur Ferry",
		"description" 	: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tempus neque vitae leo accumsan, ac rutrum urna bibendum. Integer vitae purus ac diam mattis vehicula. Duis tincidunt ultricies felis. In nec congue ligula, ut fermentum nulla. Aliquam elit quam, ultricies ac orci non, consectetur malesuada augue. Sed feugiat nisi ac accumsan vestibulum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam elementum nisi vel turpis dictum, quis accumsan augue porta.",
		"trips"			: [
			Trips.insert({
				"from" 	: "Stykkishólmur",
				"to"	: "Brjánslækur",
				"hour"  : "15:00"
			}),

			Trips.insert({
				"from" 	: "Brjánslækur",
				"to"	: "Stykkishólmur",
				"hour"  : "18:00"		
			})
		],
		"prices" 		: [
			{
				"price" : "adult",
				"unit" : 4080
			},
			{
				"price" : "child",
				"unit": 2040
			},
			{
				"price"  : "infant",
				"unit"	: 0
			},
			{
				"price"  : "senior",
				"unit" : 3264
			},
			{
				"price"  : "school",
				"unit" : 2040
			},
			{
				"price" : "guides",
				"unit": 0
			}
		],
		"activated" 	: true,
		"boatId" : '1'
	});

	Products.insert({
		"name" 			: "Viking Sushi Adventure",
		"description" 	: "Quisque volutpat suscipit interdum. Nam felis tellus, viverra eu quam ac, accumsan vestibulum quam. Phasellus luctus sem non nunc varius, vitae adipiscing augue gravida. Vestibulum libero velit, ultrices id tortor vitae, elementum congue ligula. Vestibulum in auctor urna, eget aliquam enim. Curabitur in tellus lacinia, consectetur nunc varius, posuere nisl. Mauris porta id eros eu imperdiet. Cras tristique laoreet erat vitae fermentum. Donec ornare lobortis iaculis. Sed sodales suscipit urna, sit amet laoreet dui rhoncus id. Etiam tempus nulla ut fringilla malesuada. Proin ac lorem eget leo ornare rhoncus vel et magna. Nam eu scelerisque nisl, ultricies blandit tellus. In vitae mauris at tortor porta egestas. Integer porta placerat purus, eget mattis nisi molestie vel.",
		"trips"			: [
			Trips.insert({
				"from" 	: "Caicó",
				"to"	: "Bermudas",
				"hour"  : "14:00"
			}),

			Trips.insert({
				"from" 	: "Bermudas",
				"to"	: "Caicó",
				"hour"  : "20:00"
			})
		],
		"prices" 		: [
			{
				"price" : "adult",
				"unit" : 4080
			},
			{
				"price" : "child",
				"unit": 2040
			},
			{
				"price"  : "infant",
				"unit"	: 0
			},
			{
				"price"  : "senior",
				"unit" : 3264
			},
			{
				"price"  : "school",
				"unit" : 2040
			},
			{
				"price" : "guides",
				"unit": 0
			}
		],
		"activated" 	: true,
		"boatId" : '1'
	});

	Products.insert({
		"name" 			: "Viking Sushi Short",
		"description" 	: "Morbi mi quam, hendrerit eget purus in, eleifend eleifend sapien. Proin imperdiet, ipsum viverra hendrerit eleifend, quam nisl vestibulum massa, vitae cursus magna quam vel tortor. Quisque tincidunt eget elit ac consectetur. Donec interdum, eros nec feugiat commodo, purus nibh malesuada sapien, sed consectetur arcu massa ullamcorper urna. Vivamus metus nibh, blandit vel facilisis in, vulputate eget urna. Nulla et aliquet ligula, sit amet tempus sem. Donec vel ligula posuere, ultricies lacus at, porttitor justo. Aenean hendrerit fermentum ipsum, sit amet malesuada purus interdum ac. Donec imperdiet diam congue euismod varius. Quisque volutpat ultrices risus non varius. Quisque malesuada enim ac diam pharetra mollis. Vestibulum tristique massa a odio eleifend, sit amet tincidunt nulla dignissim. Donec tempor, velit vitae dapibus commodo, risus ipsum vehicula nisi, sed vehicula tellus eros sit amet eros. Vestibulum ipsum ipsum, vestibulum vitae nunc quis, tempus ultricies sapien. Proin aliquam feugiat pellentesque.",
		"trips"			: [
			Trips.insert({
				"from" 	: "Pipa",
				"to"	: "Haiti",
				"hour"  : "15:00"
			}),

			Trips.insert({
				"from" 	: "Haiti",
				"to"	: "Pipa",
				"hour"  : "19:00"
			})
		],
		"prices" 		: [
			{
				"price" : "adult",
				"unit" : 4080
			},
			{
				"price" : "child",
				"unit": 2040
			},
			{
				"price"  : "infant",
				"unit"	: 0
			},
			{
				"price"  : "senior",
				"unit" : 3264
			},
			{
				"price"  : "school",
				"unit" : 2040
			},
			{
				"price" : "guides",
				"unit": 0
			}
		],
		"activated" 	: true,
		"boatId" : '1'
	});
}

if(VehiclesCategory.find().count() == 0){
	VehiclesCategory.insert({
		"category" 	: "Normal car with cart",
		"size"		: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
		"basePrice" : 7815
	});

	VehiclesCategory.insert({
		"category" 	: "Small car",
		"size"		: [4.5],
		"basePrice" : 4080
	});

	VehiclesCategory.insert({
		"category" 	: "Motorcycle",
		"size"		: [2.5],
		"basePrice" : 2442
	});

	VehiclesCategory.insert({
		"category" 	: "Lorry (price incl. VAT)",
		"size"		: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
		"basePrice" : 41074
	});

	VehiclesCategory.insert({
		"category" 	: "Normal car with trailler/caravan",
		"size"		: [10, 11, 12, 13, 14, 15],
		"basePrice" : 100030
	});

	VehiclesCategory.insert({
		"category" 	: "Van (price incl. VAT)",
		"size"		: [5, 6, 7 ,8 , 9, 10, 11],
		"basePrice" : 17712
	});

	VehiclesCategory.insert({
		"category" 	: "Cart (without car)",
		"size"		: [2, 3, 4, 5, 6, 7 ,8 , 9],
		"basePrice" : 3735
	});

	VehiclesCategory.insert({
		"category" 	: "Large Car / Motor-Home",
		"size"		: [6, 7 ,8 , 9, 10, 11, 12, 13, 14, 15],
		"basePrice" : 7575
	});

	VehiclesCategory.insert({
		"category" 	: "Bus",
		"size"		: [6, 7 ,8 , 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		"basePrice" : 13080
	});

	VehiclesCategory.insert({
		"category" 	: "Large Car with cart",
		"size"		: [11, 12, 13, 14, 15, 16],
		"basePrice" : 11310
	});

	VehiclesCategory.insert({
		"category" 	: "Jeep",
		"size"		: [4, 5, 6, 7],
		"basePrice" : 4080
	});

	VehiclesCategory.insert({
		"category" 	: "Normal Car",
		"size"		: [5, 6, 7],
		"basePrice" : 4080
	});

	VehiclesCategory.insert({
		"category" 	: "Large Car with trailler / caravan",
		"size"		: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
		"basePrice" : 13525
	});
}

if(Meteor.users.find().count() == 0){
	Accounts.createUser({
	  'username'  : 'gudrun',
	  'email'     : 'gudrun@me.com',
	  'password'  : '1234' //encrypted automatically 
	});
}

if(Customers.find().count() == 0){
	Customers.insert({
		"title" : "Mr",
		"fullName" :  "Carlos Maia",
		"birthDate" : "10/10/1990",
		'email' : "carlos@me.com",
		"telephoneCode" : "+55",
		"telephone" : "(11) 1111-1111",
		"adress" : "Adress",
		"city" : "City Name",
		"state" : "Any State here",
		"postcode" : "59000000",
		"country" : "Brazil"
	});

	Customers.insert({
		"title" : "Mr",
		"fullName" :  "Roberto Hallais",
		"birthDate" : "10/10/1992",
		'email' : "roberto@me.com",
		"telephoneCode" : "+55",
		"telephone" : "(84) 4004-0001",
		"adress" : "New Adress",
		"city" : "Yes it changed",
		"state" : "Another State",
		"postcode" : "99551",
		"country" : "Brazil"
	});
}

// var countries = [{"id":1,"name":"Afghanistan"},{"id":2,"name":"Albania"},{"id":3,"name":"Algeria"},{"id":4,"name":"American Samoa"},{"id":5,"name":"Andorra"},{"id":6,"name":"Angola"},{"id":7,"name":"Anguilla"},{"id":8,"name":"Antigua and Barbuda"},{"id":9,"name":"Argentina"},{"id":10,"name":"Armenia"},{"id":11,"name":"Aruba"},{"id":12,"name":"Australia"},{"id":13,"name":"Austria"},{"id":14,"name":"Azerbaijan"},{"id":15,"name":"Bahamas"},{"id":16,"name":"Bahrain"},{"id":17,"name":"Bangladesh"},{"id":18,"name":"Barbados"},{"id":19,"name":"Belarus"},{"id":20,"name":"Belgium"},{"id":21,"name":"Belize"},{"id":22,"name":"Benin"},{"id":23,"name":"Bermuda"},{"id":24,"name":"Bhutan"},{"id":25,"name":"Bolivia"},{"id":26,"name":"Bosnia-Herzegovina"},{"id":27,"name":"Botswana"},{"id":28,"name":"Bouvet Island"},{"id":29,"name":"Brazil"},{"id":30,"name":"Brunei"},{"id":31,"name":"Bulgaria"},{"id":32,"name":"Burkina Faso"},{"id":33,"name":"Burundi"},{"id":34,"name":"Cambodia"},{"id":35,"name":"Cameroon"},{"id":36,"name":"Canada"},{"id":37,"name":"Cape Verde"},{"id":38,"name":"Cayman Islands"},{"id":39,"name":"Central African Republic"},{"id":40,"name":"Chad"},{"id":41,"name":"Chile"},{"id":42,"name":"China"},{"id":43,"name":"Christmas Island"},{"id":44,"name":"Cocos (Keeling) Islands"},{"id":45,"name":"Colombia"},{"id":46,"name":"Comoros"},{"id":47,"name":"Congo, Democratic Republic of the (Zaire)"},{"id":48,"name":"Congo, Republic of"},{"id":49,"name":"Cook Islands"},{"id":50,"name":"Costa Rica"},{"id":51,"name":"Croatia"},{"id":52,"name":"Cuba"},{"id":53,"name":"Cyprus"},{"id":54,"name":"Czech Republic"},{"id":55,"name":"Denmark"},{"id":56,"name":"Djibouti"},{"id":57,"name":"Dominica"},{"id":58,"name":"Dominican Republic"},{"id":59,"name":"Ecuador"},{"id":60,"name":"Egypt"},{"id":61,"name":"El Salvador"},{"id":62,"name":"Equatorial Guinea"},{"id":63,"name":"Eritrea"},{"id":64,"name":"Estonia"},{"id":65,"name":"Ethiopia"},{"id":66,"name":"Falkland Islands"},{"id":67,"name":"Faroe Islands"},{"id":68,"name":"Fiji"},{"id":69,"name":"Finland"},{"id":70,"name":"France"},{"id":71,"name":"French Guiana"},{"id":72,"name":"Gabon"},{"id":73,"name":"Gambia"},{"id":74,"name":"Georgia"},{"id":75,"name":"Germany"},{"id":76,"name":"Ghana"},{"id":77,"name":"Gibraltar"},{"id":78,"name":"Greece"},{"id":79,"name":"Greenland"},{"id":80,"name":"Grenada"},{"id":81,"name":"Guadeloupe (French)"},{"id":82,"name":"Guam (USA)"},{"id":83,"name":"Guatemala"},{"id":84,"name":"Guinea"},{"id":85,"name":"Guinea Bissau"},{"id":86,"name":"Guyana"},{"id":87,"name":"Haiti"},{"id":88,"name":"Holy See"},{"id":89,"name":"Honduras"},{"id":90,"name":"Hong Kong"},{"id":91,"name":"Hungary"},{"id":92,"name":"Iceland"},{"id":93,"name":"India"},{"id":94,"name":"Indonesia"},{"id":95,"name":"Iran"},{"id":96,"name":"Iraq"},{"id":97,"name":"Ireland"},{"id":98,"name":"Israel"},{"id":99,"name":"Italy"},{"id":100,"name":"Ivory Coast (Cote D`Ivoire)"},{"id":101,"name":"Jamaica"},{"id":102,"name":"Japan"},{"id":103,"name":"Jordan"},{"id":104,"name":"Kazakhstan"},{"id":105,"name":"Kenya"},{"id":106,"name":"Kiribati"},{"id":107,"name":"Kuwait"},{"id":108,"name":"Kyrgyzstan"},{"id":109,"name":"Laos"},{"id":110,"name":"Latvia"},{"id":111,"name":"Lebanon"},{"id":112,"name":"Lesotho"},{"id":113,"name":"Liberia"},{"id":114,"name":"Libya"},{"id":115,"name":"Liechtenstein"},{"id":116,"name":"Lithuania"},{"id":117,"name":"Luxembourg"},{"id":118,"name":"Macau"},{"id":119,"name":"Macedonia"},{"id":120,"name":"Madagascar"},{"id":121,"name":"Malawi"},{"id":122,"name":"Malaysia"},{"id":123,"name":"Maldives"},{"id":124,"name":"Mali"},{"id":125,"name":"Malta"},{"id":126,"name":"Marshall Islands"},{"id":127,"name":"Martinique (French)"},{"id":128,"name":"Mauritania"},{"id":129,"name":"Mauritius"},{"id":130,"name":"Mayotte"},{"id":131,"name":"Mexico"},{"id":132,"name":"Micronesia"},{"id":133,"name":"Moldova"},{"id":134,"name":"Monaco"},{"id":135,"name":"Mongolia"},{"id":136,"name":"Montenegro"},{"id":137,"name":"Montserrat"},{"id":138,"name":"Morocco"},{"id":139,"name":"Mozambique"},{"id":140,"name":"Myanmar"},{"id":141,"name":"Namibia"},{"id":142,"name":"Nauru"},{"id":143,"name":"Nepal"},{"id":144,"name":"Netherlands"},{"id":145,"name":"Netherlands Antilles"},{"id":146,"name":"New Caledonia (French)"},{"id":147,"name":"New Zealand"},{"id":148,"name":"Nicaragua"},{"id":149,"name":"Niger"},{"id":150,"name":"Nigeria"},{"id":151,"name":"Niue"},{"id":152,"name":"Norfolk Island"},{"id":153,"name":"North Korea"},{"id":154,"name":"Northern Mariana Islands"},{"id":155,"name":"Norway"},{"id":156,"name":"Oman"},{"id":157,"name":"Pakistan"},{"id":158,"name":"Palau"},{"id":159,"name":"Panama"},{"id":160,"name":"Papua New Guinea"},{"id":161,"name":"Paraguay"},{"id":162,"name":"Peru"},{"id":163,"name":"Philippines"},{"id":164,"name":"Pitcairn Island"},{"id":165,"name":"Poland"},{"id":166,"name":"Polynesia (French)"},{"id":167,"name":"Portugal"},{"id":168,"name":"Puerto Rico"},{"id":169,"name":"Qatar"},{"id":170,"name":"Reunion"},{"id":171,"name":"Romania"},{"id":172,"name":"Russia"},{"id":173,"name":"Rwanda"},{"id":174,"name":"Saint Helena"},{"id":175,"name":"Saint Kitts and Nevis"},{"id":176,"name":"Saint Lucia"},{"id":177,"name":"Saint Pierre and Miquelon"},{"id":178,"name":"Saint Vincent and Grenadines"},{"id":179,"name":"Samoa"},{"id":180,"name":"San Marino"},{"id":181,"name":"Sao Tome and Principe"},{"id":182,"name":"Saudi Arabia"},{"id":183,"name":"Senegal"},{"id":184,"name":"Serbia"},{"id":185,"name":"Seychelles"},{"id":186,"name":"Sierra Leone"},{"id":187,"name":"Singapore"},{"id":188,"name":"Slovakia"},{"id":189,"name":"Slovenia"},{"id":190,"name":"Solomon Islands"},{"id":191,"name":"Somalia"},{"id":192,"name":"South Africa"},{"id":193,"name":"South Georgia and South Sandwich Islands"},{"id":194,"name":"South Korea"},{"id":195,"name":"South Sudan"},{"id":196,"name":"Spain"},{"id":197,"name":"Sri Lanka"},{"id":198,"name":"Sudan"},{"id":199,"name":"Suriname"},{"id":200,"name":"Svalbard and Jan Mayen Islands"},{"id":201,"name":"Swaziland"},{"id":202,"name":"Sweden"},{"id":203,"name":"Switzerland"},{"id":204,"name":"Syria"},{"id":205,"name":"Taiwan"},{"id":206,"name":"Tajikistan"},{"id":207,"name":"Tanzania"},{"id":208,"name":"Thailand"},{"id":209,"name":"Timor-Leste (East Timor)"},{"id":210,"name":"Togo"},{"id":211,"name":"Tokelau"},{"id":212,"name":"Tonga"},{"id":213,"name":"Trinidad and Tobago"},{"id":214,"name":"Tunisia"},{"id":215,"name":"Turkey"},{"id":216,"name":"Turkmenistan"},{"id":217,"name":"Turks and Caicos Islands"},{"id":218,"name":"Tuvalu"},{"id":219,"name":"Uganda"},{"id":220,"name":"Ukraine"},{"id":221,"name":"United Arab Emirates"},{"id":222,"name":"United Kingdom"},{"id":223,"name":"United States"},{"id":224,"name":"Uruguay"},{"id":225,"name":"Uzbekistan"},{"id":226,"name":"Vanuatu"},{"id":227,"name":"Venezuela"},{"id":228,"name":"Vietnam"},{"id":229,"name":"Virgin Islands"},{"id":230,"name":"Wallis and Futuna Islands"},{"id":231,"name":"Yemen"},{"id":232,"name":"Zambia"},{"id":233,"name":"Zimbabwe"}];

// for (var i = countries.length - 1; i >= 0; i--) {
// 	Countries.insert(countries[i])

if(Vehicles.find().count() == 0){
	var fs = Npm.require('fs');
	/*fs.readFile('../../../../../public/cars2.json', function(err, data){
		if(err)
			console.log(err);
		 var obj = JSON.parse(data);
		 console.log(obj);
	})*/
}

if(Books.find().count() == 0){
	//Add Books on past Month
	var date = new Date();
	var products = Products.find().fetch();
	var vehicles = VehiclesCategory.find().fetch();
	var prices = products[0].prices;
	var thisDay = new Date();
	var nextDay = new Date();
	var saveBook = true;
	var max5mCars = getMaxCarsUpTo5("1");
	var max6mCars = getMaxCarsUpTo6("1");

	with(thisDay){
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	with(nextDay){
		setDate(getDate() +1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}


	for (var i = 0; i < 100; i++) {
		var sum = 0;
		with(date){
			var randomday = parseInt((Math.random() * (30 - 5) + 5));
			setDate(randomday);
			var randomMonth = parseInt((Math.random() * (12 - 10) + 10));
			setMonth(randomMonth);
		}

		var customer = {
			"title" : 'Mr',
			"fullName" :  'Customer Random ' + i,
			"birthDate" : '31/01/1991',
			'email' : 'customer_noreply@seatours.com',
			"telephoneCode" : '+354',
			"telephone" : '(44) 4444-4444',
			"adress" : 'Random Adress ' + i,
			"city" : "Random City " + i,
			"state" : "Random State " + i,
			"postcode" :  "Random Postcode " + i,
			"country" : "Brazil"
		}

		var result = Customers.insert(customer);
		customer._id = result;

		var randomProductIndex = parseInt((Math.random() * (2 - 0) + 0));
		var randomVehicleIndex = parseInt((Math.random() * (2 - 0) + 0));
		var zeroOrOne = parseInt((Math.random() * (2 - 0) + 0));
		var trip = Trips.findOne(products[randomProductIndex].trips[zeroOrOne]);

		var book = {
			"trip" : {
				'from' 	: trip.from,
				'to' 	: trip.to,
			 	'hour' 	: trip.hour
			 },
			'dateOfBooking' : date,
			'customerId' : result,
			'product' : products[randomProductIndex]
		}

		if(zeroOrOne){
			//calcs total cost of vehicle
			var size = 5;
			var base = vehicles[randomVehicleIndex].basePrice;
			if(size > 10){
				var mult = size - 10;
				base += mult * 1625;
			}
			sum += base;

			vehicle = {
				"vehicleModel" : "",
				"category" : vehicles[randomVehicleIndex].category,
				"size" : vehicles[randomVehicleIndex].size[0],
				"totalCost" : base
			}

			//If vehicles has less or 5 meters
			if(vehicle.size <= 5){
				countVehicle5m = Books.find({
					dateOfBooking 	: {$gte: thisDay, $lt: nextDay},
					'product._id' 	: products[randomProductIndex]._id,
					'trip.from' 	: trip.from,
					'vehicle.size'  : {$gt: 0, $lte: 5},
					'vehicle.extraSlot' : extraSlots[0]
				}).count();

				if(countVehicle5m < max5mCars){
					vehicle.extraSlot = extraSlots[0];
				}
			}

			//If car has between 5 and 6 meters, try alocated him on 6 		
			if(vehicle.size > 5 && vehicle.size <= 6){
				countVehicle6m = Books.find({
					dateOfBooking 	: {$gte: thisDay, $lt: nextDay},
					'product._id' 	: products[randomProductIndex]._id,
					'trip.from' 	: trip.from,
					'vehicle.size'  : {$gt: 5, $lte: 6},
					'vehicle.extraSlot' : extraSlots[0]
				}).count();

				if(countVehicle6m < max6mCars){
					vehicle.extraSlot = extraSlots[0];
				}
			}

			//If car can't alocated on normal slots
			//try alocate it on extra slots
			if(!vehicle.extraSlot){
				//Return false if has no space for the vehicle, 
				//EXTRASLOT1 if alocated on slot 1
				//EXTRASLOT2 if alocated on slot 2
				var alocated = alocateCarExtraSlots(thisDay, nextDay, products[randomProductIndex], trip, vehicle.size);
				if(alocated){
					vehicle.extraSlot = alocated;
				}
			}
			
			//If vehicle can't alocated even on extra slots
			//the vehicle can't enter on boat 
			//and the booking is not created
			if(!vehicle.extraSlot){
				saveBook = false;
			}else{
				book.vehicle = vehicle;
			}

		}else{
			book.vehicle = {
			"vehicleModel" : "",
			"category" : "",
			"size" : "",
			"totalCost" : ""
			}
		}

		var pricesRandom = [];
		var randomLoopPrices = parseInt((Math.random() * (5 - 2) + 2));

		for (var j = 0; j < randomLoopPrices; j++) {
			var randomForPrices = parseInt((Math.random() * (5 - 0) + 0));
			var price = {
				"prices" : prices[randomForPrices].price,
				"perUnit" : prices[randomForPrices].unit,
				"persons" : randomForPrices,
				"sum" : prices[randomForPrices].unit * randomForPrices
				}

			sum += prices[randomForPrices].unit * randomForPrices;
			pricesRandom.push(price);	
		};

		book.prices = pricesRandom;
		book.totalISK = sum;

		if(zeroOrOne){
			book.paid = true;
			book.bookStatus = 'Created';
		}else{
			book.paid = false;
			book.bookStatus = 'Canceled';
		}

		if(saveBook){
			var transaction = {};
			if(book._id){
				Books.update(book._id, book);
				transaction = {
					'bookId' : book._id,
					'date' : new Date(),
					'status' : 'Waiting Payment',
					'amount' : book.totalISK,
					'detail' : '',
					'vendor' : 'Gudrun'
				}

			}else{
				var resultBook = Books.insert(book);
				transaction = {
				'bookId' : resultBook,
				'date' : new Date(),
				'status' : 'Waiting Payment',
				'amount' : book.totalISK,
				'detail' : '',
				'vendor' : 'Gudrun'
				}
			}
			

			if(zeroOrOne)
				transaction.type = 'Card';
			else
				transaction.type = 'Money';

			Transactions.insert(transaction);
		}
		

	};			
}

