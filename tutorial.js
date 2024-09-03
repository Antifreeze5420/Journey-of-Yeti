/*
@title: getting_started
@tags: ['beginner', 'tutorial']
@addedOn: 2022-07-26
@author: leo, edits: samliu, belle, kara

Check the tutorial in the bottom right, the run button is in the top right.
Make sure to remix this tutorial if you want to save your progress!
*/

// define the sprites in our game
const player = "p";
const box = "b";
const goal = "g";
const wall = "w";
const pusha = "o"
const melody = tune`
500,
500: G4-500,
500: B4/500,
500,
500: F4/500,
500: D5-500,
500: A4-500,
500,
500: E5-500,
500: A4/500,
500,
500: B4^500,
500,
500: C5/500,
500,
500: D5^500,
500: A4^500,
500: E5^500,
500: G5^500,
500: G4/500,
500: E4~500,
500: F4~500,
500: A4/500,
500: D4~500,
500: E5/500,
500,
500: G4~500,
500: A4~500,
500: B4/500,
500,
500: C5~500,
500`
const playback = playTune(melody, Infinity)
// assign bitmap art to each sprite
setLegend(
  [ player, bitmap`
................
................
................
.......0........
.....00.000.....
....0.....00....
....0.0.0..0....
....0......0....
....0......0....
....00....0.....
......00000.....
......0...0.....
....000...000...
................
................
................`],
  [ box, bitmap`
................
................
................
...88888888888..
...8....8....8..
...8....8....8..
...8....8....8..
...8....8....8..
...88888888888..
...8....8....8..
...8....8....8..
...8....8....8..
...8....8....8..
...88888888888..
................
................`],
  [ goal, bitmap`
................
................
................
....444444......
...44....44.....
...4......4.....
...4.......4....
...4.......4....
...4.......4....
...44......4....
....4......4....
....44....44....
.....444444.....
................
................
................`],
  [ wall, bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000`],
    [ pusha, bitmap`
................
.H.H.H.H.H.H.H..
.......0........
......070.......
.....07770......
....0.070.0.....
...7..070..7....
......070.......
......070.......
......000.......
.....00000......
....0.....0.....
...00.....00....
...00.....00....
.H.H.H.H.H.H.H..
................`]
);

// create game levels
let level = 0; // this tracks the level we are on
const levels = [

  map`
..p.
.b.g
....`,
  map`
p..
.b.
..g`,
  map`
p..g
.bw.
..w.
..w.`,
  map`
p...
...b
...b
.bbg`,
  map`
.....
..b..
.p.b.
...g.`,
  map`
p.w.
bbwg
....
g...`,
    map`
....
.g.p
.b.w
pw..`,
  map`
p...
..b.
g.ww
.g..
.b..
w..p`,
  map`
p..w.
...wo
...w.
...w.
gb.wb
...wg`

];

// set the map displayed to the current level
const currentLevel = levels[level];
setMap(currentLevel);

setSolids([ player, box, wall, pusha ]); // other sprites cannot go inside of these sprites

// allow certain sprites to push certain other sprites
setPushables({
  [player]: [box,pusha],
  [box]: [box],
  [pusha]:[goal]
  
});

// inputs for player movement control
onInput("w", () => {
  for (i=0;i< getAll(player).length;i++){             
    getAll(player)[i].y -= 1; // positive y is downwards
  }});

onInput("a", () => {
  for (i=0;i< getAll(player).length;i++){              
    getAll(player)[i].x -= 1; // positive y is downwards
}});

onInput("s", () => {
  for (i=0;i< getAll(player).length;i++){              
    getAll(player)[i].y += 1; // positive y is downwards
}});

onInput("d", () => {
  for (i=0;i< getAll(player).length;i++){             
    getAll(player)[i].x += 1; // positive y is downwards
}});

// input to reset level
onInput("j", () => {
  const currentLevel = levels[level]; // get the original map of the level

  // make sure the level exists before we load it
  if (currentLevel !== undefined) {
    clearText("");
    setMap(currentLevel);
  }
});
onInput("i", () => {
  if (getAll(pusha).length !=0){
    const a = getFirst(pusha).y;
    const b = getFirst(pusha).x;
    getFirst(pusha).y = -1;
    getFirst(pusha).x = -1;
    getFirst(player).x = b;
    getFirst(player).y = a;
  }  
});  

// these get run after every input
afterInput(() => {
  // count the number of tiles with goals
  const targetNumber = tilesWith(goal).length;
  
  // count the number of tiles with goals and boxes
  const numberCovered = tilesWith(goal, box).length;

  // if the number of goals is the same as the number of goals covered
  // all goals are covered and we can go to the next level
  if (numberCovered === targetNumber) {
    // increase the current level number
    level = level + 1;

    const currentLevel = levels[level];

    // make sure the level exists and if so set the map
    // otherwise, we have finished the last level, there is no level
    // after the last level
    if (currentLevel !== undefined) {
      setMap(currentLevel);
    } else {
      addText("you win!", { y: 4, color: color`3` });
    }
  }
});
