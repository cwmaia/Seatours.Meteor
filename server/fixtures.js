if(Products.find().count() == 0){
	Products.insert({
		"name" 			: "Baldy Ferry",
		"description" 	: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tempus neque vitae leo accumsan, ac rutrum urna bibendum. Integer vitae purus ac diam mattis vehicula. Duis tincidunt ultricies felis. In nec congue ligula, ut fermentum nulla. Aliquam elit quam, ultricies ac orci non, consectetur malesuada augue. Sed feugiat nisi ac accumsan vestibulum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam elementum nisi vel turpis dictum, quis accumsan augue porta.",
		"trips"			: [{
			"from" 	: "Stykkishólmur",
			"to"	: "Brjánslækur",
			"hour"  : "15:00"
		},
		{
			"from" 	: "Brjánslækur",
			"to"	: "Natal",
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
		"activated" 	: true
	});

	Products.insert({
		"name" 			: "Sushi Vinking Adventure",
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
		"activated" 	: true

	});

	Products.insert({
		"name" 			: "Sushi Vinking Short",
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
		"activated" 	: true
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

//For Tests
if(SeatoursUsers.find().count() == 0){
	SeatoursUsers.insert({
		"username" : "cwmaia",
		"authKey" : "1234",
		"authLvl" : "admin"
	});

	SeatoursUsers.insert({
		"username" : "gudrun",
		"authKey" : "1234",
		"authLvl" : "admin"
	});

	SeatoursUsers.insert({
		"username" : "test",
		"authKey" : "1234",
		"authLvl" : "guest"
	});
}

if(Books.find().count() == 0){
	Books.insert({
			"destination" : "Sushi Vinking Short",
			"departure" : "04/10/2013",
			"adultNumber" : "1",
			"childNumber" : "0",
			"infantNumber" :"0",
			"seniorNumber" : "0",
			"schoolNumber" : "0",
			"guidesNumber" : "0",
			"vehiclesNumber" : "0",
			"totalISK" : "4080 ISK",
			"title" : "Mr",
			"firstName" : "Peter",
			"surname" : "Parker",
			"birthDate" : "12/10/1989",
			"email" : "peter@teste.me",
			"telephoneCode" : "Brazil (+55)",
			"telephone" : "11 8888-5555",
			"adress" : "Av. 123",
			"city" : "São Paulo",
			"county" : "Sao Paulo",
			"postcode" : "59000000",
			"country" : "Brazil",
			"paid" : "No"
		});

	Books.insert({
			"destination" : "Sushi Vinking Adventure",
			"departure" : "05/05/2014",
			"adultNumber" : "2",
			"childNumber" : "0",
			"infantNumber" :"0",
			"seniorNumber" : "0",
			"schoolNumber" : "0",
			"guidesNumber" : "0",
			"vehiclesNumber" : "0",
			"totalISK" : "8160 ISK",
			"title" : "Mr",
			"firstName" : "Squall",
			"surname" : "Leonhart",
			"birthDate" : "12/10/1989",
			"email" : "squall@square-enix.com",
			"telephoneCode" : "Brazil (+55)",
			"telephone" : "11 8888-5555",
			"adress" : "Balamb Gardem",
			"city" : "Balamb",
			"county" : "Balamb",
			"postcode" : "59000000",
			"country" : "Balamb",
			"paid" : "Yes"
		});

	Books.insert({
			"destination" : "Baldy Ferry",
			"departure" : "06/11/2013",
			"adultNumber" : "2",
			"childNumber" : "1",
			"infantNumber" :"0",
			"seniorNumber" : "0",
			"schoolNumber" : "0",
			"guidesNumber" : "0",
			"vehiclesNumber" : "0",
			"totalISK" : "10200 ISK",
			"title" : "Mr",
			"firstName" : "Zidane",
			"surname" : "Tribal",
			"birthDate" : "12/10/1989",
			"email" : "zidane@square-enix.com",
			"telephoneCode" : "Brazil (+55)",
			"telephone" : "11 8888-5555",
			"adress" : "Alexandria Castle",
			"city" : "Alexandria",
			"county" : "Alexandria",
			"postcode" : "59000000",
			"country" : "Alexandria",
			"paid" : "No"
		});
}