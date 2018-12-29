var api = "http://api.giphy.com/v1/gifs/search?";
var apiKey = "&api_key=6HvwgH0NUx4sWULd71ICf2VHbZU3D0R9";
var q = "&q=";
var limit = "&limit=100";

var img; var g; 
var divs = [];
var numGif= 10; 
var gifWidth; var gifHeight; 
var texts = ["ryan+gosling", "valentines", "bollywood", "galaxy", "universe", "hi", "robots", "death", "shows", "love"];
var parentDiv; 

function setup() {
  noCanvas();

  // Calculate the width of each gi
  gifWidth = screen.width/numGif; 
  gifHeight = screen.height/numGif; 

  parentDiv = createDiv();
  parentDiv.mousePressed(clbk);
  parentDiv.style('background-color', color(0));

  // Query gif
  queryGif();
}

function clbk() {
  for (var i = 0; i < divs.length; i++) {
    divs[i].remove();
  }
  queryGif();
}

function queryGif() {
  // Clear all the divs. 
  var t = texts[floor(random(texts.length))];
  print("Quering for " + t);
  var url = api + apiKey + q + t + limit; 
  loadJSON(url, gotData);
}

function gotData(giphy) {
  print("Got data");
  g = giphy;

  createDivs(); 
  populateGifs();
}

function createDivs() {
  // Create all the divs. 
  for (var i = 0; i < 10; i++) {
    var div = createDiv();
    div.position(0, i*gifHeight);
    divs[i] = div;
    parentDiv.child(divs[i]);
  }
}

function populateGifs() {
  // Create a collection of giphys
  var divNum = 0; 
  for (var i = 0; i < 100; i++) {
    img = createImg(g.data[i].images.fixed_width.url);
    img.size(gifWidth, gifHeight);
    divs[divNum].child(img);

    var mod = i % 10; 
    if (mod == 9) {
      divNum++; 
    }
  }
}