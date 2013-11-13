var stat = true;

var makeActive = function(link, i, li){

	$('#buttonFilter').html($(link).text() + '<i class="icon-angle-down icon-on-right bigger-110"></i>');

	$('.chartFilter').filter(function(){
		$(this).removeClass('blue');
		$(this).parent().removeClass('active');
	})

	$('.chartIcon').filter(function(){
		$(this).addClass('invisible');
	})

	$(li).addClass('active');
	$(link).addClass('blue');
	$(i).removeClass('invisible');
	
}

var drawPieChart = function(placeholder, data, position) {
    $.plot(placeholder, data, {
		series: {
			pie: {
				show: true,
				tilt:0.8,
				highlight: {
					opacity: 0.25
				},
				stroke: {
					color: '#fff',
					width: 2
				},
				startAngle: 2
			}
		},
		legend: {
			show: true,
			position: position || "ne", 
			labelBoxBorderColor: null,
			margin:[-30,15]
		}
		,
		grid: {
			hoverable: true,
			clickable: true
		}
 	});
};

var calcBooks = function(from, to){
	paidBooks = Books.find({paid: true, dateOfBooking: {$gte: from, $lt: to}}).count();
	notPaidBooks = Books.find({paid: false, dateOfBooking: {$gte: from, $lt: to}}).count();
	totalBooks = Books.find({dateOfBooking: {$gte: from, $lt: to}}).count();

	$('#paid').text(paidBooks);
	$('#notPaid').text(notPaidBooks);
	$('#totalBooks').text(totalBooks);

	var data = {
		paidBooks : paidBooks,
		notPaidBooks : notPaidBooks
	}

	return data;
}

var calcBooksThisWeek = function(){
	var curr = new Date; // get current date
	var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
	var last = first + 6; // last day is the first day + 6

	var firstday = new Date(curr.setDate(first));
	var lastday = new Date(curr.setDate(last));

	with(firstday){
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	with(lastday){
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	var data = calcBooks(firstday, lastday);

	var placeholder = $('#piechart-placeholder').css({'width':'90%' , 'min-height':'150px'});
	var data = [
		{ label: "Paid Books",  data: data.paidBooks, color: "#68BC31"},
		{ label: "No Paid  Books",  data: data.notPaidBooks, color: "#2091CF"}
	];

	drawPieChart(placeholder, data);
	placeholder.data('chart', data);
	placeholder.data('draw', drawPieChart);
}

var calcBooksThisMonth = function(){
	var firstDayCurrentMonth = new Date();
	var firstDayNextMonth = new Date();
	with(firstDayCurrentMonth){
		setDate(1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	with(firstDayNextMonth){
		setDate(1);
		setMonth(getMonth() +1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	var data = calcBooks(firstDayCurrentMonth, firstDayNextMonth);

	var placeholder = $('#piechart-placeholder').css({'width':'90%' , 'min-height':'150px'});
	var data = [
		{ label: "Paid Books",  data: data.paidBooks, color: "#68BC31"},
		{ label: "No Paid  Books",  data: data.notPaidBooks, color: "#2091CF"}
	];

	drawPieChart(placeholder, data);
	placeholder.data('chart', data);
	placeholder.data('draw', drawPieChart);
}

var calcBooksLastMonth = function(){
	var firstDayLastMonth = new Date();
	var firstDayCurrentMonth = new Date();
	with(firstDayLastMonth){
		setDate(1);
		setMonth(getMonth() -1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	with(firstDayCurrentMonth){
		setDate(1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	var data = calcBooks(firstDayLastMonth, firstDayCurrentMonth);

	var placeholder = $('#piechart-placeholder').css({'width':'90%' , 'min-height':'150px'});
	var data = [
		{ label: "Paid Books",  data: data.paidBooks, color: "#68BC31"},
		{ label: "No Paid  Books",  data: data.notPaidBooks, color: "#2091CF"}
	];

	drawPieChart(placeholder, data);
	placeholder.data('chart', data);
	placeholder.data('draw', drawPieChart);
}

var calcBooksLastWeek = function(){
	var curr = new Date; // get current date
	var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
	var last = first + 6; // last day is the first day + 6

	var firstday = new Date(curr.setDate(first));
	var lastday = new Date(curr.setDate(last));

	with(firstday){
		setDate(getDate() -7);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	with(lastday){
		setDate(getDate() - 6);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	var data = calcBooks(firstday, lastday);

	var placeholder = $('#piechart-placeholder').css({'width':'90%' , 'min-height':'150px'});
	var data = [
		{ label: "Paid Books",  data: data.paidBooks, color: "#68BC31"},
		{ label: "No Paid  Books",  data: data.notPaidBooks, color: "#2091CF"}
	];

	drawPieChart(placeholder, data);
	placeholder.data('chart', data);
	placeholder.data('draw', drawPieChart);
}

var countBooksThisMonth = function(){
	var firstDayCurrentMonth = new Date();
	var firstDayNextMonth = new Date();
	with(firstDayCurrentMonth){
		setDate(1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	with(firstDayNextMonth){
		setDate(1);
		setMonth(getMonth() +1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	return Books.find({dateOfBooking: {$gte: firstDayCurrentMonth, $lt: firstDayNextMonth}}).count();
}

Template.overview.bookQtd = function() {
	return countBooksThisMonth();
}

Template.overview.percentageMonth = function(){
	//Get all the books of past month
	var firstDayPastMonth = new Date();
	var firstDayCurrentMonth = new Date();
	var firstDayNextMonth = new Date();
	with(firstDayPastMonth){
		setMonth(getMonth() -1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
		setDate(1);
	}

	with(firstDayCurrentMonth){
		setDate(1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	with(firstDayNextMonth){
		setDate(1);
		setMonth(getMonth() +1);
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	var percentage = 0;

	booksOfPastMonth = Books.find({dateOfBooking: {$gte: firstDayPastMonth, $lt: firstDayCurrentMonth}}).count();
	booksOfCurrentMonth = Books.find({dateOfBooking: {$gte: firstDayCurrentMonth, $lt: firstDayNextMonth}}).count();
	
	percentage = (booksOfCurrentMonth * 100) / booksOfPastMonth;
	percentage = percentage - 100;

	if(booksOfCurrentMonth > booksOfPastMonth){
		stat = true;
	}else{
		stat = false;
	}
	return Math.abs(parseInt(percentage));
}

Template.overview.stat = function(){
	if(stat)
		return 'stat-success';
	return 'stat-important';
}


Template.overview.events({
	'click #thisWeek' : function(e){
		var link = e.currentTarget;
		var i = $(link).children().first();
		var li = $(link).parent();
		makeActive(link, i, li);
		calcBooksLastMonth();
	},
	'click #thisMonth' : function(e){
		var link = e.currentTarget;
		var i = $(link).children().first();
		var li = $(link).parent();
		makeActive(link, i, li);
		calcBooksLastMonth();
	},
	'click #lastWeek' : function(e){
		var link = e.currentTarget;
		var i = $(link).children().first();
		var li = $(link).parent();
		makeActive(link, i, li);
		calcBooksLastMonth();
	},
	'click #lastMonth' : function(e){
		var link = e.currentTarget;
		var i = $(link).children().first();
		var li = $(link).parent();
		makeActive(link, i, li);
		calcBooksLastMonth();
	},
})

Template.overview.rendered = function(){
	var curr = new Date; // get current date
		var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
		var last = first + 6; // last day is the first day + 6

		var firstday = new Date(curr.setDate(first)).toUTCString();
		var lastday = new Date(curr.setDate(last)).toUTCString();
		calcBooks(firstday, lastday);


	$('.easy-pie-chart.percentage').each(function(){
					var $box = $(this).closest('.infobox');
					var barColor = $(this).data('color') || (!$box.hasClass('infobox-dark') ? $box.css('color') : 'rgba(255,255,255,0.95)');
					var trackColor = barColor == 'rgba(255,255,255,0.95)' ? 'rgba(255,255,255,0.25)' : '#E2E2E2';
					var size = parseInt($(this).data('size')) || 50;
					$(this).easyPieChart({
						barColor: barColor,
						trackColor: trackColor,
						scaleColor: false,
						lineCap: 'butt',
						lineWidth: parseInt(size/10),
						animate: /msie\s*(8|7|6)/.test(navigator.userAgent.toLowerCase()) ? false : 1000,
						size: size
					});
				})
			
	$('.sparkline').each(function(){
		var $box = $(this).closest('.infobox');
		var barColor = !$box.hasClass('infobox-dark') ? $box.css('color') : '#FFF';
		$(this).sparkline('html', {tagValuesAttribute:'data-values', type: 'bar', barColor: barColor , chartRangeMin:$(this).data('min') || 0} );
	});

	var curr = new Date; // get current date
	var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
	var last = first + 6; // last day is the first day + 6

	var firstday = new Date(curr.setDate(first));
	var lastday = new Date(curr.setDate(last));

	with(firstday){
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	with(lastday){
		setHours(0);
		setMinutes(0);
		setSeconds(0);
	}

	paidBooks = Books.find({paid: true, dateOfBooking: {$gte: firstday, $lt: lastday}}).count();
	noPaidBooks = Books.find({paid: false, dateOfBooking: {$gte: firstday, $lt: lastday}}).count();

	var placeholder = $('#piechart-placeholder').css({'width':'90%' , 'min-height':'150px'});
	var data = [
		{ label: "Paid Books",  data: paidBooks, color: "#68BC31"},
		{ label: "No Paid  Books",  data: noPaidBooks, color: "#2091CF"}
	];

 	calcBooks(firstday, lastday);
	 drawPieChart(placeholder, data);

	 placeholder.data('chart', data);
	 placeholder.data('draw', drawPieChart);

	   var $tooltip = $("<div class='tooltip top in'><div class='tooltip-inner'></div></div>").hide().appendTo('body');
			  var previousPoint = null;
			
			  placeholder.on('plothover', function (event, pos, item) {
				if(item) {
					if (previousPoint != item.seriesIndex) {
						previousPoint = item.seriesIndex;
						var tip = item.series['label'] + " : " + item.series['percent'].toFixed(2)+'%';
						$tooltip.show().children(0).text(tip);
					}
					$tooltip.css({top:pos.pageY + 10, left:pos.pageX + 10});
				} else {
					$tooltip.hide();
					previousPoint = null;
				}
				
			 });

			var d1 = [];
			for (var i = 0; i < Math.PI * 2; i += 0.5) {
				d1.push([i, Math.sin(i)]);
			}
		
			var d2 = [];
			for (var i = 0; i < Math.PI * 2; i += 0.5) {
				d2.push([i, Math.cos(i)]);
			}
		
			var d3 = [];
			for (var i = 0; i < Math.PI * 2; i += 0.2) {
				d3.push([i, Math.tan(i)]);
			}
			
		
			var sales_charts = $('#sales-charts').css({'width':'100%' , 'height':'220px'});
			$.plot("#sales-charts", [
				{ label: "Baldur Ferry", data: d1 },
				{ label: "Viking Sushi", data: d2 },
				{ label: "Whale Watching", data: d3 }
			], {
				hoverable: true,
				shadowSize: 0,
				series: {
					lines: { show: true },
					points: { show: true }
				},
				xaxis: {
					tickLength: 0
				},
				yaxis: {
					ticks: 10,
					min: -2,
					max: 2,
					tickDecimals: 3
				},
				grid: {
					backgroundColor: { colors: [ "#fff", "#fff" ] },
					borderWidth: 1,
					borderColor:'#555'
				}
			});
		
}

