  
// "Model"
var Board = function() {
  this.board = [0,0,0,0,0,0,0,0,0]
  this.player = 'o'
  this.opponent = 'x'
  this.win_sequences = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6] // diagonals
    ]
  this.winning_seq = [];
  this.winner = null
}

Board.prototype = {

  resetBoard: function() {
    this.board = [0,0,0,0,0,0,0,0,0]
    this.winning_seq = [];
    this.winner = null
  },
  isFull: function() {
    return _.indexOf(this.board, 0) == -1
  },
  // Returns winning player
  findWinner: function() {
    if(this.win(this.player))
      return this.player
    else if(this.win(this.opponent))
      return this.opponent
    else
      return false
  },
  // Returns winning sequence if "who" is a winner, false otherwise
  // Stores winning sequence and winner
  win: function(who) {

    // use jQuery's .each since it allows breaks
    var win_seq = false
    var that = this
    $.each(this.win_sequences, function(i, seq){
      if(that._matchThree(seq, who)) {
        win_seq = seq
        return false // break
      }
    })

    // Store in model
    if(win_seq) { 
      this.winning_sequence = win_seq
      this.winner = who
    }
    return win_seq
  },
  tie : function() {
    return this.isFull() && !this.winner
  },
  // Marks a move on the board
  move : function(pos, player) {
    if(pos < 0 || pos > 8) 
      console.log('this should not happen. micah made a boo boo')  
    else
      this.board[pos] = player

    // XXX
    console.log(this.board)
  },
  // Checks whether board contains player marker "who" in all 3 positions
  // _yeah I know, it's not really private
  _matchThree : function(sequence, who) {
    if(this.board[sequence[0]] == who && 
       this.board[sequence[1]] == who && 
       this.board[sequence[2]] == who)
      return true
  }
};


// Angular would've been overkill here... 
// showing off jQuery Skillz instead
$(function() {

  // Init new board instance
  var board = new Board()

  // Player "plays" click handler
  $('.board td').on('click', function(){
    if($(this).hasClass(board.player) || $(this).hasClass(board.opponent))
      return

    makeMove($(this).data('position'), board.player)
  })

  // Reset click handler
  $('.reset').on('click', function(){
    $('.board td').removeClass(board.player).removeClass(board.opponent)
                  .removeClass('win')
    $('.alert').hide()

    board.resetBoard()
  })

  // Helper UI function to highlight the winning sequence 
  function highlightWin(sequence) {
    var $td = $('.board td')
    _.each(sequence, function(i){
      $td.eq(i).addClass('win')
    })
  }


  // "Controller" aka Main Algorithm Stuff
  // probably not the best place to put it
  function makeMove(position, who) {

    $('.board td:eq('+position+')').addClass(who)
    board.move(position, who)

    var winner = board.findWinner()
    if(board.isFull() || winner)
      return endGame(winner)

    // AI Algo here
    // For now, draw an X in the first TD w/o a class
    else if(who == board.player) {
      var $td = $('.board td:not(".o"):not(".x"):first').addClass(board.opponent)
      // already recursive, and this isn't even the real algorithm!
      makeMove($td.data('position'), board.opponent)
    }
  }

  function endGame(winner) {
    if(winner == board.player)
      $('.alert-success').show()
    else if(winner == board.opponent)
      $('.alert-error').show()
    // this 'if' is extraneous, but good for error checks
    else if(board.tie()) 
      $('.alert-info').show()

    highlightWin(board.winning_sequence)
  }



});

