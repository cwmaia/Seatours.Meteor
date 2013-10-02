if(Products.find().count() == 0){
	Products.insert({
		"name" : "Baldy Ferry",
		"description" : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas tempus neque vitae leo accumsan, ac rutrum urna bibendum. Integer vitae purus ac diam mattis vehicula. Duis tincidunt ultricies felis. In nec congue ligula, ut fermentum nulla. Aliquam elit quam, ultricies ac orci non, consectetur malesuada augue. Sed feugiat nisi ac accumsan vestibulum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam elementum nisi vel turpis dictum, quis accumsan augue porta.",
		"schedulesAvailable" : ["15:00", "18:00"]
	});

	Products.insert({
		"name" : "Sushi Vinking Adventure",
		"description" : "Quisque volutpat suscipit interdum. Nam felis tellus, viverra eu quam ac, accumsan vestibulum quam. Phasellus luctus sem non nunc varius, vitae adipiscing augue gravida. Vestibulum libero velit, ultrices id tortor vitae, elementum congue ligula. Vestibulum in auctor urna, eget aliquam enim. Curabitur in tellus lacinia, consectetur nunc varius, posuere nisl. Mauris porta id eros eu imperdiet. Cras tristique laoreet erat vitae fermentum. Donec ornare lobortis iaculis. Sed sodales suscipit urna, sit amet laoreet dui rhoncus id. Etiam tempus nulla ut fringilla malesuada. Proin ac lorem eget leo ornare rhoncus vel et magna. Nam eu scelerisque nisl, ultricies blandit tellus. In vitae mauris at tortor porta egestas. Integer porta placerat purus, eget mattis nisi molestie vel.",
		"schedulesAvailable" : ["13:00", "15:00"]
	});

	Products.insert({
		"name" : "Sushi Vinking Short",
		"description" : "Morbi mi quam, hendrerit eget purus in, eleifend eleifend sapien. Proin imperdiet, ipsum viverra hendrerit eleifend, quam nisl vestibulum massa, vitae cursus magna quam vel tortor. Quisque tincidunt eget elit ac consectetur. Donec interdum, eros nec feugiat commodo, purus nibh malesuada sapien, sed consectetur arcu massa ullamcorper urna. Vivamus metus nibh, blandit vel facilisis in, vulputate eget urna. Nulla et aliquet ligula, sit amet tempus sem. Donec vel ligula posuere, ultricies lacus at, porttitor justo. Aenean hendrerit fermentum ipsum, sit amet malesuada purus interdum ac. Donec imperdiet diam congue euismod varius. Quisque volutpat ultrices risus non varius. Quisque malesuada enim ac diam pharetra mollis. Vestibulum tristique massa a odio eleifend, sit amet tincidunt nulla dignissim. Donec tempor, velit vitae dapibus commodo, risus ipsum vehicula nisi, sed vehicula tellus eros sit amet eros. Vestibulum ipsum ipsum, vestibulum vitae nunc quis, tempus ultricies sapien. Proin aliquam feugiat pellentesque.",
		"schedulesAvailable" : ["10:00", "12:00"]
	});
}

//For Tests
if(Users.find().count() == 0){
	Users.insert({
		"username" : "cwmaia",
		"authKey" : "1234",
		"authLvl" : "admin"
	});

	Users.insert({
		"username" : "gudrun",
		"authKey" : "1234",
		"authLvl" : "admin"
	});

	Users.insert({
		"username" : "test",
		"authKey" : "1234",
		"authLvl" : "guest"
	});



}