appendImage = function(){
	$('#id-logo').html("");
	$('#id-logo').html("<img src='/images/logo-en.png'>");

}

handle_side_menu = function () {
	$('#menu-toggler').on('click', function() {
		$('#sidebar').toggleClass('display');
		$(this).toggleClass('display');
		return false;
	});
	//mini
	var $minimized = false;
	$('#sidebar-collapse').on('click', function(){
		$('#sidebar').toggleClass('menu-min');
		$(this.firstChild).toggleClass('icon-double-angle-right');
		$minimized = $('#sidebar').hasClass('menu-min');
		if($minimized) {
			$('.open > .submenu').removeClass('open');
		}
	});
	
	//opening submenu
	$('.nav-list').on('click', function(e){
		if($minimized) return;

		//check to see if we have clicked on an element which is inside a .dropdown-toggle element?!
		//if so, it means we should toggle a submenu
		var link_element = $(e.target).closest('.dropdown-toggle');
		if(link_element && link_element.length > 0) {
		    var sub = link_element.next().get(0);

			//if we are opening this submenu, close all other submenus except the ".active" one
			if(! $(sub).is(':visible') ) {//ie, we are about to open it and make it visible
			  $('.open > .submenu').each(function(){
				if(this != sub && !$(this.parentNode).hasClass('active')) {
					$(this).slideUp(200).parent().removeClass('open');
				}
			  });
			}

			$(sub).slideToggle(200).parent().toggleClass('open');
			return false;
		 }
	 })
}


general_things = function() {
 $('.ace-nav [class*="icon-animated-"]').closest('a').on('click', function(){
	var icon = $(this).find('[class*="icon-animated-"]').eq(0);
	var $match = icon.attr('class').match(/icon\-animated\-([\d\w]+)/);
	icon.removeClass($match[0]);
	$(this).off('click');
 });
 
 
 //simple settings

 $('#ace-settings-btn').on('click', function(){
	$(this).toggleClass('open');
	$('#ace-settings-box').toggleClass('open');
 });
 
 $('#ace-settings-header').removeAttr('checked').on('click', function(){
	if(this.checked) {
		$('.navbar').addClass('navbar-fixed-top');
		$(document.body).addClass('navbar-fixed');
	}
	else {
		$('.navbar').removeClass('navbar-fixed-top');
		$(document.body).removeClass('navbar-fixed');
		
		if($('#ace-settings-sidebar').get(0).checked) $('#ace-settings-sidebar').click();
	}
 });
 
 $('#ace-settings-sidebar').removeAttr('checked').on('click', function(){
	if(this.checked) {
		$('#sidebar').addClass('fixed');
		if(! $('#ace-settings-header').get(0).checked) $('#ace-settings-header').click();
	}
	else {
		$('#sidebar').removeClass('fixed');
	}
 });


 $('#btn-scroll-up').on('click', function(){
	var duration = Math.max(100, parseInt($('html').scrollTop() / 3));
	$('html,body').animate({scrollTop: 0}, duration);
	return false;
 });
 
 
  $('#skin-colorpicker').ace_colorpicker().on('change', function(){
	var skin_class = $(this).find('option:selected').data('class');
	
	var body = $(document.body);

	body.attr('class', body.hasClass('navbar-fixed') ? 'navbar-fixed' : '');
	if(skin_class != 'default') body.addClass(skin_class);
	
	if(skin_class == 'skin-1') {
		//$('.ace-nav > li').addClass('no-border');
		$('.ace-nav > li.grey').addClass('dark');
	}
	else {
		//$('.ace-nav > li').removeClass('no-border');
		$('.ace-nav > li.grey').removeClass('dark');
	}
	
	if(skin_class == 'skin-2') {
		$('.ace-nav > li').addClass('no-border margin-1');
		$('.ace-nav > li:not(:last-child)').addClass('light-pink').find('> a > [class*="icon-"]').addClass('pink').end().eq(0).find('.badge').addClass('badge-warning');
	}
	else {
		$('.ace-nav > li').removeClass('no-border').removeClass('margin-1');
		$('.ace-nav > li:not(:last-child)').removeClass('light-pink').find('> a > [class*="icon-"]').removeClass('pink').end().eq(0).find('.badge').removeClass('badge-warning');
	}
	
	if(skin_class == 'skin-3') {
		$('.ace-nav > li.grey').addClass('red').find('.badge').addClass('badge-yellow');
	} else {
		$('.ace-nav > li.grey').removeClass('red').find('.badge').removeClass('badge-yellow');
	}
 });
 
}



