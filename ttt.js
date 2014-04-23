
// Angular would've been overkill here... 
// showing off jQuery Skillz instead
$(function() {


	// Click handlers
	$('.board td').on('click', function(){
		if($(this).hasClass('ex') || $(this).hasClass('circle'))
			return
		$(this).addClass('circle')
		makeMove();
	})

	$('.reset').on('click', function(){
		$('.board td').removeClass('ex').removeClass('circle')
		$('.alert').hide()
	})

	function makeMove() {
		
		// TODO: Algorithm here

		// For now, draw an X in the first TD w/o a class
		var classless = $('.board td:not([class])')
		if(!classless || !classless.length)
			return endGame()
		else
			$(classless[0]).addClass('ex')
	}

	
	function endGame() {
		// TODO: figure out whether player won or lost, show message
		var win = true
		if(win)
			$('.alert-success').show()
		else
			$('.alert-success').hide()
	}

});