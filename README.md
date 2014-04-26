tic tac toe
=========
This is the stuff coding challenges are made of.

### What
Javascript-based tic tac toe game.

Given my target user is someone whose goal is to evaluate my coding competency, I stuck to the basics to demonstrate fundamental coding ability in building a robust UI via the front-end. My methods were to complete the coding challenge in the minimum time possible while closely mimicking the process, tools, and abilities I'd use in my day-to-day work.

### Where
Play with the finished product here: http://rajunov.com/tictactoe/index.html

#### Screenshots
If you're seriously too lazy to click the link above, here's what it looks like:
![tictactoe](https://cloud.githubusercontent.com/assets/78626/2808246/62900888-cd1a-11e3-8f56-c36b662c2e34.png)

### Process
Since this is a coding challenge, I assume you're more interested in knowing _how_ I got here than the fact that I got here at all, so here's the play-by-play.

(Moreover, I'm a big fan of documenting the process, since it gives transparency to why decisions were made, what options have already been considered, and how we arrived at the current implementation, thus avoiding duplication of work down the line. It's even more important when this is all we have to communicate with each other. Hence the overkill.)


##### Set up
Before googling anything (except for syntax lookups), I built a basic UI structure sans algorithm, as a testament to what I know off the bat.

##### Research
Then I looked up a few ticky tacky toey implementations. Minimax seems to be the algorithm of choice. [This guy](http://www.neverstopbuilding.com/minimax) has an already impressive [web app](http://perfecttictactoe.herokuapp.com/), and an even more impressive explanation. You should probably hire him, I promise mine is not as stellar.

His implementation supposedly comes with an API. Hooking into APIs sums up most of my job, so I wouldn't have considered this "cheating" but rather, being clever. Unfortunately the API is not exposed (but I got to learn about this neat error: ```XMLHttpRequest cannot load http://bla. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.```) So short of cloning that repo and setting it up on my own server, I had to bite the bullet, put on my college hat, and write an actual algorithm.

##### Gettin' my hands dirty
I laid out my "MVC" to keep track of data and game state, until everything except the actual solver were ready. Ran into some sneaky JS reference issues, which were taken care of with some deep copying using ```$.extend()``` and creating new instances of objects.

##### Reverse engineering
Turns out Negamax is a more efficient version of Minimax for this particular case. It was useful to follow along with the aforementioned implementation and [this JS version](http://mkuklis.github.io/tictactoe/docs/tictactoe.html), as well as the [programming bible](http://en.wikipedia.org/wiki/Negamax), and other articles for reference.

I coded first, then tried to understand what the algorithm was doing as I tested and debugged.

At this point, the game worked consistently. Conceptually I understood the algorithm, but I couldn't really explain to you what the code was doing 100% of the time. This is what I get for "liberally applying" someone else's code.

##### Further research
We all know that when code just "works" without full comprehension of _why_ it'll come back to bite you, hard. So, I dove deeper into Minimax, Negamax, and alpha-beta pruning. I felt incorporating the last optimization would be important to signal competence and leave my own mark, since I couldn't find any other examples that do that yet.

##### End result
Finally, it works. And much faster than my previous attempt given the alpha-beta optimization.

##### Still puzzled...
However, I noticed a few holes, which are either in my knowledge or in the true accuracy of this algorithm to solve for tic tac toe.

One of the examples I looked at randomized the next move when there were multiple equally "best" scores. I thought this was a nice touch, otherwise the moves are entirely predictable. But, including this with the current implementation resulted in the opponent not always picking the center square as the second move, which is apparently the best move.
````
  o | 1 | 2
  3 | x | 5
  6 | 7 | 8

  // Randomization wouldn't always choose the center square for x, position 4
````
It turns out, all positions (save one) from the center on have the same score. The center just happens to be the _first_ position that has the maximum score. On the surface, therefore, there doesn't seem to be a valid reason for _why_ the center square is the best move in this scenario, if scores are the same.

The randomization (randomly) resulted in several win scenarios for me, which shouldn't technically happen ever.

So I took out the randomization, but I'm still puzzled by how this can be incorporated. My guess is that there is a way to optimize scores based on depth (which I tried, but did not yield different results) or some other variable, so that the score at the top of the stack is meaningfully the "best" out of all the ones traversed.


### Limitations and Considerations

Yes, you always go first. Yes, you are always 'o'. Yes, the UI is not exactly gorgeous.Yes, you can always optimize further. To avoid scope creep, I aimed for a presentable MVP with a minimum threshold of standards.

Since I'm usually working within an existing framework like Angular, it's been a long time since I used raw OO JS classes. I had to [brush up](http://yehudakatz.com/2011/08/12/understanding-prototypes-in-javascript/), but honestly they've always been little confusing to me. I realize my code is a mixed bag with this.


### Other Stuff
- Time to completion: 12 hours.
  - 8 to a "working" version, and 4 more to a confident version
- Not tested in IE or other non-browsers.
- Published as a (public) submodule off of my main (private) repo so my commit-based progress can be scrutinized if so desired. Please feel free to comment.
- Possible optimizations include a leaner implementation of Board and Minimax classes so as not to overload the call stack, better UI such as pretty icons, player customization such as ability to choose who goes first and what marker you are, a list of your wins and losses in this session using Local Storage, ad infinitum.


### Closing Remarks

My primary focus as a developer is on UI. In 5+ years of mostly front-end coding, the only time I've ever had the need to implement anything remotely resembling an algorithm, I thankfully realized all I needed was [_.shuffle()](http://underscorejs.org/#shuffle) before diving into my own custom Fisher-Yates. So this exercise was a change of pace for me.

Hopefully this shows you that I can code up a decent web app. I also offer a range of product-building services on top of programming, such as design, snark, and fun.


