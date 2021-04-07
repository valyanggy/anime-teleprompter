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

// loop through the books, create elements for each one, and add it to the page
function showLines() {
  console.log("showCaptions()");
  lines.forEach((line) => {
    //   var linePartA = document.createElement("p");
    // //   linePartA.classList.add("song-title");
    //   linePartA.innerText = line.fields.part_1;
    //   document.body.append(linePartA);

    //   var linePartB = document.createElement("p");
    //   linePartB.innerText = line.fields.part_2;
    //   document.body.append(linePartB);



    var linePart1 = document.createElement("li");
    linePart1.classList.add("item");
    linePart1.innerText = line.fields.part_1;
    document.querySelector(".top").append(linePart1);

    var linePart2 = document.createElement("li");
    linePart2.classList.add("item");
    linePart2.innerText = line.fields.part_2;
    document.querySelector(".middle").append(linePart2);

    var linePart3 = document.createElement("li");
    linePart3.classList.add("item");
    linePart3.innerText = line.fields.part_3;
    document.querySelector(".buttom").append(linePart3);

  });
}
