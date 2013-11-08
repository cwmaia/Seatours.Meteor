$(function(){
	$('.btn').click(function(){
		clearErrors();
		clearSuccess();
	})
	
})

showPopover = function(element, msg, type) {
	type == undefined ? type = 'error' : '';

	element.addClass('tooltip-' + type + ' ' + type);
	element.popover({
		placement: 'top',
		// title: 'Error',
		content: msg
	});

	element.popover('show');
}