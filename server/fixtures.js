Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://postmaster%40seatours.com:2-j--rmow2s5@smtp.mailgun.org:587';
});

var extraSlots = ['NO', 'EXTRASLOT1', 'EXTRASLOT2'];
var admId = '';
var vendorsId = '';

// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
	function CSVToArray( strData, strDelimiter ){
	// Check to see if the delimiter is defined. If not,
	// then default to comma.
	strDelimiter = (strDelimiter || ",");
	 
	// Create a regular expression to parse the CSV values.
	var objPattern = new RegExp(
	(
	// Delimiters.
	"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
	 
	// Quoted fields.
	"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
	 
	// Standard fields.
	"([^\"\\" + strDelimiter + "\\r\\n]*))"
	),
	"gi"
	);
	 

	// Create an array to hold our data. Give the array
	// a default empty first row.
	var arrData = [[]];
	 
	// Create an array to hold our individual pattern
	// matching groups.
	var arrMatches = null;
	 
	 console.log(arrData);
	// Keep looping over the regular expression matches
	// until we can no longer find a match.
	while (arrMatches = objPattern.exec( strData )){
	 
		// Get the delimiter that was found.
		var strMatchedDelimiter = arrMatches[ 1 ];
		 
		// Check to see if the given delimiter has a length
		// (is not the start of string) and if it matches
		// field delimiter. If id does not, then we know
		// that this delimiter is a row delimiter.
		if (
		strMatchedDelimiter.length &&
		(strMatchedDelimiter != strDelimiter)
		){
			// Since we have reached a new row of data,
			// add an empty row to our data array.
			arrData.push( [] );
		}
		// Now that we have our delimiter out of the way,
		// let's check to see which kind of value we
		// captured (quoted or unquoted).
		if (arrMatches[ 2 ]){ 
			// We found a quoted value. When we capture
			// this value, unescape any double quotes.
			var strMatchedValue = arrMatches[ 2 ].replace(
			new RegExp( "\"\"", "g" ),
			"\""
			);
		} else {
			// We found a non-quoted value.
			var strMatchedValue = arrMatches[ 3 ];
		 
		}
		 
		// Now that we have our value string, let's add
		// it to the data array.
		arrData[ arrData.length - 1 ].push( strMatchedValue );
		console.log('tenso');
	}
	console.log('aqui'); 
	console.log(arrData); 
	// Return the parsed data.
	return( arrData );
}

if(Groups.find().count() == 0){
	admId = Groups.insert({
		'name' : 'Administrators',
		'description' : 'Lords of the Universe'
	});

	vendorsId = Groups.insert({
		'name' : 'Vendors',
		'description' : 'Vendors'
	})

	Groups.insert({
		'name' : 'Agencies',
		'description' : 'Travel Agencies'
	})
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
	result = Products.insert({
		"name" 			: "Baldur Ferry",
		"description" 	: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tempus neque vitae leo accumsan, ac rutrum urna bibendum. Integer vitae purus ac diam mattis vehicula. Duis tincidunt ultricies felis. In nec congue ligula, ut fermentum nulla. Aliquam elit quam, ultricies ac orci non, consectetur malesuada augue. Sed feugiat nisi ac accumsan vestibulum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam elementum nisi vel turpis dictum, quis accumsan augue porta.",
		"activated" 	: true,
		"boatId" : '1'
	});

	Trips.insert({
		"from" 	: "Stykkishólmur",
		"to"	: "Brjánslækur",
		"hour"  : "15:00",
		'season' : "summer",
		'active' : true,
		'productId' : result
	}),

	Trips.insert({
		"from" 	: "Brjánslækur",
		"to"	: "Stykkishólmur",
		"hour"  : "18:00",
		'season' : "summer",
		'active' : true,
		'productId' : result		
	})

	Trips.insert({
		"from" 	: "Stykkishólmur",
		"to"	: "Brjánslækur",
		"hour"  : "15:00",
		'season' : "winter",
		'active' : true,
		'productId' : result
	}),


	Prices.insert({
		"price" 	: "Adult",
		"unit"	: 4080,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Adult",
		"unit"	: 4080,
		'active' : true,
		'season' : 'winter',
		'productId' : result
	})


	Prices.insert({
		"price" 	: "Child",
		"unit"	: 2040,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Infant",
		"unit"	: 0,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Senior",
		"unit"	: 3264,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "School Discount",
		"unit"	: 2040,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Guides and Drivers",
		"unit"	: 0,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	result = Products.insert({
		"name" 			: "Viking Sushi Adventure",
		"description" 	: "Quisque volutpat suscipit interdum. Nam felis tellus, viverra eu quam ac, accumsan vestibulum quam. Phasellus luctus sem non nunc varius, vitae adipiscing augue gravida. Vestibulum libero velit, ultrices id tortor vitae, elementum congue ligula. Vestibulum in auctor urna, eget aliquam enim. Curabitur in tellus lacinia, consectetur nunc varius, posuere nisl. Mauris porta id eros eu imperdiet. Cras tristique laoreet erat vitae fermentum. Donec ornare lobortis iaculis. Sed sodales suscipit urna, sit amet laoreet dui rhoncus id. Etiam tempus nulla ut fringilla malesuada. Proin ac lorem eget leo ornare rhoncus vel et magna. Nam eu scelerisque nisl, ultricies blandit tellus. In vitae mauris at tortor porta egestas. Integer porta placerat purus, eget mattis nisi molestie vel.",
		"activated" 	: true,
		"boatId" : '1'
	});

	Trips.insert({
		"from" 	: "Caicó",
		"to"	: "Bermudas",
		"hour"  : "14:00",
		'season' : "summer",
		'active' : true,
		'productId' : result
	}),

	Trips.insert({
		"from" 	: "Bermudas",
		"to"	: "Caicó",
		"hour"  : "20:00",
		'season' : "summer",
		'active' : true,
		'productId' : result
	})


	Prices.insert({
		"price" 	: "Adult",
		"unit"	: 4080,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Child (12 - 14)",
		"unit"	: 2040,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Infant (0 - 11)",
		"unit"	: 0,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Senior",
		"unit"	: 3264,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "School Discount",
		"unit"	: 2040,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Guides & Drivers",
		"unit"	: 0,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	result = Products.insert({
		"name" 			: "Viking Sushi Short",
		"description" 	: "Morbi mi quam, hendrerit eget purus in, eleifend eleifend sapien. Proin imperdiet, ipsum viverra hendrerit eleifend, quam nisl vestibulum massa, vitae cursus magna quam vel tortor. Quisque tincidunt eget elit ac consectetur. Donec interdum, eros nec feugiat commodo, purus nibh malesuada sapien, sed consectetur arcu massa ullamcorper urna. Vivamus metus nibh, blandit vel facilisis in, vulputate eget urna. Nulla et aliquet ligula, sit amet tempus sem. Donec vel ligula posuere, ultricies lacus at, porttitor justo. Aenean hendrerit fermentum ipsum, sit amet malesuada purus interdum ac. Donec imperdiet diam congue euismod varius. Quisque volutpat ultrices risus non varius. Quisque malesuada enim ac diam pharetra mollis. Vestibulum tristique massa a odio eleifend, sit amet tincidunt nulla dignissim. Donec tempor, velit vitae dapibus commodo, risus ipsum vehicula nisi, sed vehicula tellus eros sit amet eros. Vestibulum ipsum ipsum, vestibulum vitae nunc quis, tempus ultricies sapien. Proin aliquam feugiat pellentesque.",			
		"activated" 	: true,
		"boatId" : '1'
	});

	Trips.insert({
		"from" 	: "Pipa",
		"to"	: "Haiti",
		"hour"  : "15:00",
		'season' : "summer",
		'active' : true,
		'productId' : result
	}),

	Trips.insert({
		"from" 	: "Haiti",
		"to"	: "Pipa",
		"hour"  : "19:00",
		'season' : "summer",
		'active' : true,
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Adult",
		"unit"	: 4080,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Child (12 - 14)",
		"unit"	: 2040,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Infant (0 - 11)",
		"unit"	: 0,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Senior",
		"unit"	: 3264,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "School Discount",
		"unit"	: 2040,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})

	Prices.insert({
		"price" 	: "Guides & Drivers",
		"unit"	: 0,
		'active' : true,
		'season' : 'summer',
		'productId' : result
	})
		
}

if(VehiclesCategory.find().count() == 0){
	VehiclesCategory.insert({
		"category" 	: "Normal car with cart",
		"size"		: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
		"basePrice" : 7815,
		'baseSize'  : 10,
		'onReduce'  : false,
		'step'      : 1625
	});

	VehiclesCategory.insert({
		"category" 	: "Small car",
		"size"		: [4.5],
		"basePrice" : 4080,
		'baseSize'  : 4.5,
		'onReduce'  : false,
		'step'      : 1625
	});

	VehiclesCategory.insert({
		"category" 	: "Motorcycle",
		"size"		: [2.5],
		"basePrice" : 2442,
		'baseSize'  : 2.5,
		'onReduce'  : false,
		'step'      : 1625
	});

	VehiclesCategory.insert({
		"category" 	: "Lorry (price incl. VAT)",
		"size"		: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
		"basePrice" : 41074,
		'baseSize'  : 11,
		'onReduce'  : true,
		'step'      : 3734
	});

	VehiclesCategory.insert({
		"category" 	: "Normal car with trailler/caravan",
		"size"		: [10, 11, 12, 13, 14, 15],
		"basePrice" : 100030,
		'baseSize'  : 10,
		'onReduce'  : false,
		'step'      : 1625
	});

	VehiclesCategory.insert({
		"category" 	: "Van (price incl. VAT)",
		"size"		: [5, 6, 7 ,8 , 9, 10, 11],
		"basePrice" : 17712,
		'baseSize'  : 8,
		'onReduce'  : true,
		'step'      : 2214
	});

	VehiclesCategory.insert({
		"category" 	: "Cart (without car)",
		"size"		: [2, 3, 4, 5, 6, 7 ,8 , 9],
		"basePrice" : 3735,
		'baseSize'  : 5,
		'onReduce'  : false,
		'step'      : 1625
	});

	VehiclesCategory.insert({
		"category" 	: "Large Car / Motor-Home",
		"size"		: [6, 7 ,8 , 9, 10, 11, 12, 13, 14, 15],
		"basePrice" : 7575,
		'baseSize'  : 6,
		'onReduce'  : false,
		'step'      : 1625
	});

	VehiclesCategory.insert({
		"category" 	: "Bus",
		"size"		: [6, 7 ,8 , 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
		"basePrice" : 13080,
		'baseSize'  : 8,
		'onReduce'  : true,
		'step'      : 1635
	});

	VehiclesCategory.insert({
		"category" 	: "Large Car with cart",
		"size"		: [11, 12, 13, 14, 15, 16],
		"basePrice" : 11310,
		'baseSize'  : 11,
		'onReduce'  : false,
		'step'      : 1625
	});

	VehiclesCategory.insert({
		"category" 	: "Jeep",
		"size"		: [4, 5, 6, 7],
		"basePrice" : 4080,
		'baseSize'  : 5,
		'onReduce'  : false,
		'step'      : 1625
	});

	VehiclesCategory.insert({
		"category" 	: "Normal Car",
		"size"		: [5, 6, 7],
		"basePrice" : 4080,
		'baseSize'  : 5,
		'onReduce'  : false,
		'step'      : 1625
	});

	VehiclesCategory.insert({
		"category" 	: "Large Car with trailler / caravan",
		"size"		: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
		"basePrice" : 13525,
		'baseSize'  : 11,
		'onReduce'  : false,
		'step'      : 1625
	});
}

if(Meteor.users.find().count() == 0){
	Accounts.createUser({
	  'username'  : 'gudrun',
	  'email'     : 'gudrun@me.com',
	  'profile'	  : {'groupID' : admId, 'name' : 'Gudrun'},
	  'password'  : '1234' //encrypted automatically 
	});

	Accounts.createUser({
	  'username'  : 'rhneto',
	  'email'     : 'rhneto@me.com',
	  'profile'	  : {'groupID' : vendorsId, 'name' : 'Roberto'},
	  'password'  : '1234' //encrypted automatically 
	});

	Accounts.createUser({
	  'username'  : 'cmaia',
	  'email'     : 'cmaia@me.com',
	  'profile'	  : {'groupID' : vendorsId, 'name' : 'Carlos Maia'},
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

/*if(Books.find().count() == 0){
	//Add Books on past Month
	var date = new Date();
	var products = Products.find().fetch();
	var vehicles = VehiclesCategory.find().fetch();
	var prices = products[0].prices;
	var thisDay = new Date();
	var nextDay = new Date();
	var saveBook = true;


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


	for (var i = 0; i < 20; i++) {
		console.log(i);
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
		var trip = Trips.find({productId : products[randomProductIndex]._id}).fetch()[zeroOrOne];

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

			console.log(vehicles[randomVehicleIndex].size[0]);

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
					'vehicle.extraSlot' : extraSlots[0]
				}).count();

				if(countVehicle5m < 30){
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

				if(countVehicle6m < 2){
					vehicle.extraSlot = extraSlots[0];
				}
			}

			//If car can't alocated on normal slots
			//try alocate it on extra slots
			if(!vehicle.extraSlot){
				//Return false if has no space for the vehicle, 
				//EXTRASLOT1 if alocated on slot 1
				//EXTRASLOT2 if alocated on slot 2
				//var alocated = alocateCarExtraSlots(thisDay, nextDay, products[randomProductIndex], trip, vehicle.size);
				//if(alocated){
					//vehicle.extraSlot = alocated;
				//}
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

		/*for (var j = 0; j < randomLoopPrices; j++) {
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

		book.prices = pricesRandom;*/
		/*book.totalISK = sum;

		book.paid = true;
		book.bookStatus = 'Created';
		
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
}*/

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

	Settings.insert({'summerStartDate' : '06/01',
					 '_id' : 'summer'});
	Settings.insert({'winterStartDate' : '12/01',
					 '_id' : 'winter'});
}

var callback = function(data){
	Fiber = Npm.require('fibers')
	Fiber(function(){
			for (var i = 1; i < data.length; i++) {
			var Car = {
				'brandname' : data[i].brandname,
				'model' : data[i].model,
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
	console.log(a);
}

if(Cars.find().count() == 0){

	/*var fs = Npm.require('fs');
		var _data;
		fs.readFile('../../../../../public/cars.csv', function(err, data){
			if(err){
				console.log(err);
			}
			else{
				callbackCSV(data);
			}
		});*/



	var fs = Npm.require('fs');
		var _data;
		fs.readFile('../../../../../public/cars2.json', function(err, data){
			if(err){
				console.log(err);
			}
			else{
				_data = JSON.parse(data);
				callback(_data);
			}
		});
}


