/* globals require */
console.log("Hello, Airtable");

// load the airtable library, call it "Airtable"
var Airtable = require("airtable");
console.log(Airtable);

// use the airtable librar to get a variable that represents one of our bases
var base = new Airtable({ apiKey: "keyFs7Zk2PBOmwekT" }).base(
  "app9lgiFmyzrAzu5L"
);

//get the "captions" table from the base, select ALL the records, and specify the functions that will receive the data
base("captions").select({}).eachPage(gotPageOfLines, gotAllLines);

// an empty array to hold our data
var lines= [];

// callback function that receives our data
function gotPageOfLines(records, fetchNextPage) {
  console.log("gotPageOfLines()");
  // add the records from this page to our captions array
  lines.push(...records);
  // request more pages
  fetchNextPage();
}

// call back function that is called when all pages are loaded
function gotAllLines(err) {
  console.log("gotAllLines()");

  // report an error, you'd want to do something better than this in production
  if (err) {
    console.log("error loading captions");
    console.error(err);
    return;
  }

  // call functions to log and show the books
  consoleLogLines();
  showLines();
}

// just loop through the books and console.log them
function consoleLogLines() {
  console.log("consoleLogLines()");
  lines.forEach((line) => {
    console.log("Line:", line);
  });
}

// loop through the lines, create elements for each one, and add it to the scrollbox
function showLines() {
  console.log("showCaptions()");
  lines.forEach((line) => {
    var linePart1 = document.createElement("li");
    linePart1.classList.add("item");
    linePart1.innerText = line.fields.part_1;
    document.querySelector(".top").append(linePart1);

    // set the li element's height to be equal to the scrollbox height
    // unfortunately, a fixed height is needed for your design to work with this slot machine library
    linePart1.style.height = `${linePart1.parentNode.offsetHeight}px`;

    var linePart2 = document.createElement("li");
    linePart2.classList.add("item");
    linePart2.innerText = line.fields.part_2;
    document.querySelector(".middle").append(linePart2);
    linePart2.style.height = `${linePart2.parentNode.offsetHeight}px`;

    var linePart3 = document.createElement("li");
    linePart3.classList.add("item");
    linePart3.innerText = line.fields.part_3;
    document.querySelector(".buttom").append(linePart3);
    linePart3.style.height = `${linePart3.parentNode.offsetHeight}px`;
  });

  var button = document.getElementById('randomizeButton');

  // create slot machines from scrollboxes
  // 'active' is the index of the visible words. so if the 'active's of all 3 slot machines are equal, then you win
  // delay is... the delay for starting. self-explanatory
  // id is a value we'll use to identify each slot machine
  var scrollboxTop = new SlotMachine(document.querySelector('.top'), { active: 0, id: 0 });
  var scrollboxMiddle = new SlotMachine(document.querySelector('.middle'), { active: 0, delay: 500, id: 1 });
  var scrollboxBottom = new SlotMachine(document.querySelector('.buttom'), { active: 0, delay: 1000, id: 2 });

  button.addEventListener('click', () => {
    var indexes = [0, 0, 0]; // an array of 'active' values from each slot machine
    var message = document.getElementById('message');

    // clear the message text
    while (message.childNodes.length > 0) {
      message.removeChild(message.firstChild);
    }

    // for each slot machine, spin the slot 5 times
    // afterwards, execute onComplete()
    scrollboxTop.shuffle(5, onComplete);
    scrollboxMiddle.shuffle(5, onComplete);
    scrollboxBottom.shuffle(5, onComplete);

    // callback function to be executed after each slot machine finishes
    function onComplete(active, id) {
      // update indexes array with a number corresponding to the currently visible part of the line
      // remember: this.id is used to identify the slot machine
      /*
        0: scrollboxTop
        1: scrollboxMiddle
        2: scrollboxBottom
      */
      indexes[this.id] = this.active;

      // if it's scrollboxBottom (the last slot machine), then execute checkIndexes()
      if (this.id === 2) {
        checkIndexes();
      }
    }

    // callback function to be executed after the last slot machine finishes
    function checkIndexes() {
      // check if every value in the array is equal to each other
      // if it is, then you win. otherwise, try again
      if (indexes.every(i => i === indexes[0])) {
        message.textContent = 'You\u2019ve found the original line.';
      } else {
        message.textContent = 'Try again.';
      }
    }
  }, false);
}
