
// "Model"
var Board = function(config_board) {
  this.board = [0,0,0,0,0,0,0,0,0];

  this.player = 'o'
  this.opponent = 'x'

  // Option to start the board with preset configuration
  // Useful for sub-board sequence calculation
  if( _.isArray(config_board) )
    $.extend(true, this.board, config_board) // lose the reference
}

Board.prototype = {

  win_sequences : [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6] // diagonals
  ],
  resetBoard : function() {
    this.board = [0,0,0,0,0,0,0,0,0]
  },
  // Player-agnostic function, returns opposite player
  otherPlayer : function(who) {
    if( who == this.player )
      return this.opponent
    else if( who == this.opponent )
      return this.player
    else
      console.log('cannot find otherPlayer of "'+who+'". broken code?')
  },
  isFull : function() {
    return _.indexOf(this.board, 0) == -1
  },
  // Returns winning player
  getWinner : function() {
    if( this.findWinningSequence(this.player) )
      return this.player
    else if( this.findWinningSequence(this.opponent) )
      return this.opponent
    else
      return false
  },
  // Returns winning sequence if "who" is a winner, false otherwise
  // Stores winning sequence and winner
  findWinningSequence : function(who) {

    var win_seq = false
    var that = this
    
    // use jQuery's .each since it allows breaks
    $.each(this.win_sequences, function(i, seq){
      if( that._matchThree(seq, who) ) {
        win_seq = seq
        return false // break
      }
    })

    return win_seq
  },
  // Makes a move on the board
  move : function(pos, who) {
    if( pos === undefined || pos === null || pos < 0 || pos > 8 )
      console.log('pos='+pos+'. this should not happen. micah made a boo boo')
    else
      this.board[pos] = who
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
  // They can be anything really
  this.MAX_VALUE = 10
  this.MIN_VALUE = -this.MAX_VALUE
}

// Negamax, a more efficient variation of minimax that assumes
//  a zero-sum game (the losses of one player equal the gains of another)
//  w/ alpha-beta pruning, where is breaks from diving into next branch
//  if next moves cannot be better than previous ones
Negamax.prototype = {

  // Called recursively
  // The meat between the bread
  _solve : function(board, player, depth, alpha, beta) {

    // Winner or board is full is a terminal condition
    var winner = board.getWinner()
    var opponent = board.otherPlayer(player)
    if( winner == player )
      return this.MAX_VALUE
    else if( winner == opponent )
      return this.MIN_VALUE
    else if( board.isFull() )
      return 0

    // Assign local variables for current node
    var possible_moves = board.getEmptySpaces()
    var scores = []
    var node_value = this.MIN_VALUE
    var that = this

    // use jQuery's $.each since it allows break
    $.each(possible_moves, function(i, position){
      // Copy current board and make this move
      var subboard = new Board(board.board)
      subboard.move(position, player)

      // Traverse all possible child boards recursively
      // Negamax: Negate the score because it'll be optimized for opponent
      //   note also alpha and beta are negated and swapped
      var child_value = -1 * that._solve(subboard, opponent, 
                                         depth+1, -beta, -alpha)

      // If this is a better value for node, record score and position
      if( child_value >= node_value ) {
        node_value = child_value
        scores.push({'position': position, 'score': node_value})
      }

      // Alpha is the max value so far of all child nodes
      alpha = Math.max(child_value, alpha)
      // Pruning: no need to examine the rest of the possible_moves
      //   because the best value we have so far is already the maximum score
      if( alpha >= beta )
        return false;
    })

    // Find the first maximum score and corresponding position
    var max = _.max(scores, function(s){ return s.score })
    this.next_move = max.position
    return node_value
  },

  // Public function to call
  // Returns position id of next move
  nextMove : function(board, player) {
    this.next_move = -1
    
    // Alpha starts off as the worst possible value, beta as the best
    var alpha = this.MIN_VALUE
    var beta = this.MAX_VALUE

    var score = this._solve(board, player, 0, alpha, beta)
    return this.next_move
  }
};


// Angular would've been overkill here...
// showing off jQuery Skillz instead
$(function() {

  // Init new game and algo instance
  var game = new Board()
  var algorithm = new Negamax(game.board, game.player)
  var game_ended = false

  // Player "plays" click handler
  $('.board td').on('click', function(){
    if( game_ended ||
        $(this).hasClass(game.player) || $(this).hasClass(game.opponent) )
      return

    makeMove($(this).data('position'), game.player)
  })

  // Reset click handler
  $('.reset').on('click', function(){
    $('.board td').removeClass(game.player).removeClass(game.opponent)
                  .removeClass('win')
    $('.alert').hide()

    game_ended = false
    game.resetBoard()
  })

  // Records move on game board and calls computer to make next move
  function makeMove(position, who) {

    $('.board td:eq('+position+')').addClass(who)
    game.move(position, who)

    // Are we done?
    var winner = game.getWinner()
    if( game.isFull() || winner )
      return endGame(winner)

    // Not done, make computer move
    else if( who == game.player ) {
      var calculate_game = new Board(game.board)
      var position = algorithm.nextMove(calculate_game, game.opponent)
      // already recursive, and this isn't even the real algorithm!
      makeMove(position, game.opponent)
    }
  }

  // Helper UI function to display end game message
  function endGame(winner) {
    game_ended = true

    if( winner == game.player )
      $('.alert-success').show()
    else if( winner == game.opponent )
      $('.alert-error').show()
    else  // A tie!!
      $('.alert-info').show()

    highlightWin( game.findWinningSequence(winner) )
  }

  // Helper UI function to highlight the winning sequence
  function highlightWin(sequence) {

    var $td = $('.board td')
    _.each(sequence, function(i){
      $td.eq(i).addClass('win')
    })
  }

});

