  
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
  this.winning_sequence = [];
  this.winner = null
}

Board.prototype = {

  resetBoard : function() {
    this.board = [0,0,0,0,0,0,0,0,0]
    this.winning_sequence = [];
    this.winner = null
  },
  isFull : function() {
    return _.indexOf(this.board, 0) == -1
  },
  // Returns winning player
  findWinner : function() {
    if( this.win(this.player) )
      return this.player
    else if( this.win(this.opponent) )
      return this.opponent
    else
      return false
  },
  hasWinner : function() {
    return this.winner
  },
  // Returns winning sequence if "who" is a winner, false otherwise
  // Stores winning sequence and winner
  win : function(who) {

    // use jQuery's .each since it allows breaks
    var win_seq = false
    var that = this
    $.each(this.win_sequences, function(i, seq){
      if( that._matchThree(seq, who) ) {
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
    if( pos < 0 || pos > 8 ) 
      console.log('this should not happen. micah made a boo boo')  
    else
      this.board[pos] = player
  },
  // Returns indices of empty spaces in board
  getEmptySpaces : function() {
    var spaces = [];
    _.each(this.board, function(val, i){
      if(val === 0)
        spaces.push(i)
    })
    return spaces
  },
  // Checks whether board contains player marker "who" in all 3 positions
  // _yeah I know, it's not really private
  _matchThree : function(sequence, who) {
    if( this.board[sequence[0]] == who && 
        this.board[sequence[1]] == who && 
        this.board[sequence[2]] == who )
      return true
  }
};



var Negamax = function() {
  this.MAX_DEPTH = 6
  this.MAX_VALUE = 1000
  this.MIN_VALUE = (-1 * this.MAX_VALUE)
}

Negamax.prototype = {
  
  // Uses negamax, a variation of minimax that assumes 
  //   a zero-sum game (the losses of one player equal the gains of another)
  //   w/ alpha-beta pruning, where is breaks from diving into the branch
  //   if it realizes the current move cannot be better than a previous one
  // Called recursively
  // The meat between the bread
  _solve : function(board, player, depth) {
    
    console.log('in _solve, player='+player+', depth='+depth)
    
    // Check ending conditions
    if( depth > this.MAX_DEPTH )
      return 0

    var winner = board.findWinner()
    if( winner == player )
      return this.MAX_VALUE
    else if( winner && winner != player )
      return this.MIN_VALUE
    else if( board.isFull() )
      return 0

    var alpha = this.MIN_VALUE
    var possible_moves = board.getEmptySpaces()

    // Testing, return first of possible moves
    this.next_move = _.first(_.shuffle(possible_moves))
    return this.next_move
  },

  // Public function to call
  // Returns position id of next move
  nextMove : function(board, player) {
    this.next_move = -1
    this._solve(board, player, 0)
    
    console.log('the next move is: '+this.next_move)
    return this.next_move
  }
};




// Angular would've been overkill here... 
// showing off jQuery Skillz instead
$(function() {

  // Init new board and algo instance
  var board = new Board()
  var algorithm = new Negamax(board.board, board.player)

  // Player "plays" click handler
  $('.board td').on('click', function(){
    if( board.hasWinner() ||
       $(this).hasClass(board.player) || $(this).hasClass(board.opponent) )
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

  // Records move on game board and calls computer to make next move
  function makeMove(position, who) {

    $('.board td:eq('+position+')').addClass(who)
    board.move(position, who)

    // Are we done?
    var winner = board.findWinner()
    if( board.isFull() || winner )
      return endGame(winner)

    // Not done, make computer move
    else if( who == board.player ) {
      var position = algorithm.nextMove(board, board.player)
      // already recursive, and this isn't even the real algorithm!
      makeMove(position, board.opponent)
    }
  }

  // Helper UI function to display end game message
  function endGame(winner) {
    if( winner == board.player )
      $('.alert-success').show()
    else if( winner == board.opponent )
      $('.alert-error').show()
    // this 'if' is extraneous, but good for error checks
    else if( board.tie() ) 
      $('.alert-info').show()

    highlightWin(board.winning_sequence)
  }

  // Helper UI function to highlight the winning sequence 
  function highlightWin(sequence) {

    var $td = $('.board td')
    _.each(sequence, function(i){
      $td.eq(i).addClass('win')
    })
  }

});

