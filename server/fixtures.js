Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://postmaster%40seatours.com:2-j--rmow2s5@smtp.mailgun.org:587';
});

if(Boats.find().count() == 0){
	Boats.insert({
	"_id" : "1",
	"name" : "Baldur Ferry",
	"maxCapacity" : 10,
	'slots' : [
		{
			"number" : 1,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 2,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 5,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 4,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 5,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 6,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 7,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 8,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 9,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 10,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 11,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 12,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 13,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 14,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 15,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 16,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 17,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 18,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 19,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 20,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 21,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 22,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 23,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 24,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 25,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 26,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 27,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 28,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 29,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 30,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 31,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 32,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 33,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 34,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 34,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 36,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 37,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 38,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 39,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		},
		{
			"number" : 40,
			"slot_name" : "Small Car Slot",
			"width" : 5,
			"height" : 5,
			"split" : false,
			"alocated" : false
		}
	]
	})
}

if(Products.find().count() == 0){
	Products.insert({
		"name" 			: "Baldur Ferry",
		"description" 	: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tempus neque vitae leo accumsan, ac rutrum urna bibendum. Integer vitae purus ac diam mattis vehicula. Duis tincidunt ultricies felis. In nec congue ligula, ut fermentum nulla. Aliquam elit quam, ultricies ac orci non, consectetur malesuada augue. Sed feugiat nisi ac accumsan vestibulum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam elementum nisi vel turpis dictum, quis accumsan augue porta.",
		"trips"			: [{
			"from" 	: "Stykkishólmur",
			"to"	: "Brjánslækur",
			"hour"  : "15:00"
		},
		{
			"from" 	: "Brjánslækur",
			"to"	: "Stykkishólmur",
			"hour"  : "18:00"		
		}],
		"prices" 	: [
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
		"trips"			: [{
			"from" 	: "Caicó",
			"to"	: "Bermudas",
			"hour"  : "14:00"
		},
		{
			"from" 	: "Bermudas",
			"to"	: "Caicó",
			"hour"  : "20:00"
		}],
		"prices" 	: [
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
		"trips"			: [{
			"from" 	: "Pipa",
			"to"	: "Haiti",
			"hour"  : "15:00"
		},
		{
			"from" 	: "Haiti",
			"to"	: "Pipa",
			"hour"  : "19:00"
		}],
		"prices" 	: [
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
		"category" 	: "Normal Car / Motor-Home",
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

	for (var i = 0; i < 500; i++) {
		var sum = 0;
		with(date){
			var randomday = parseInt((Math.random() * (20 - 1) + 1));
			setDate(randomday);
			var randomMonth = parseInt((Math.random() * (10 - 1) + 1));
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

		Customers.insert(customer);

		var randomProductIndex = parseInt((Math.random() * (2 - 0) + 0));
		var randomVehicleIndex = parseInt((Math.random() * (12 - 0) + 0));
		var zeroOrOne = parseInt((Math.random() * (1 - 0) + 0));


		var book = {
			"destination" : products[randomProductIndex].trips[zeroOrOne].from + ' - ' + products[randomProductIndex].trips[zeroOrOne].to + ' - ' + products[randomProductIndex].trips[zeroOrOne].hour,
			'dateOfBooking' : date,
			'customer' : customer,
			'product' : products[randomProductIndex]
		}

		if(zeroOrOne){
			book.vehicle = {
				"vehicleModel" : "",
				"category" : vehicles[randomVehicleIndex].category,
				"size" : vehicles[randomVehicleIndex].size[0],
				"totalCost" : function(){
					var size = vehicles[randomVehicleIndex].size[0];
					var base = vehicles[randomVehicleIndex].basePrice;
					if(size > 10){
						var mult = size - 10;
						base += mult * 1625;
					}
					sum += base;
					return base;
				}
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

		Books.insert(book);
	};			
				
}