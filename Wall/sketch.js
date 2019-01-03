// Hardcoded text for now. 
var search = ["lalaland", "sexy", "kiss", "pyar", "humtum", "whatsup", "whatsapp", "internet", "machines", "you"];

// Display.
var numGifs = numRows = 10; // # gifs/row and # of rows.  
var divs = [];
var parentDiv; 
var gifWidth, gifHeight; 

// API Controller. 
var giphy; 

function setup() {
  noCanvas();

  // Create the controller instance. 
  giphy = new Giphy();
  queryGifs();

  // Setup parent gif. 
  parentDiv = createDiv();
  parentDiv.mousePressed(onClick)

  // Gif dimensions
  gifWidth = screen.width/numGifs; 
  gifHeight = screen.height/numGifs; 
}


function onClick() {
  print("Removing old divs.");
  for (var i = 0; i < divs.length; i++) {
    divs[i].remove();
  }
  queryGifs();
}

function createDivs() {
  print("Creating Divs. ");
  // Create all the divs. 
  for (var i = 0; i < numRows; i++) {
    var div = createDiv();
    div.position(0, i*gifHeight);
    divs[i] = div;
    parentDiv.child(divs[i]);
  }
}

function queryGifs() {
  // Query gifs.
  let randIdx = floor(random(search.length));
  giphy.query(search[randIdx], giphyData);
}

// Callback function called when the service returns the result. 
function giphyData(gData) {
  print("Data received.");
  print(gData); 

  createDivs(); 
  showImages(gData);
}

function showImages(gData) {
  // Only show the number of search results not all the ones I need to show
  print("show images");
  var divNum = 0; var numImages = gData.data.length;
  for (var i = 0; i < numImages; i++) {
    var img = createImg(gData.data[i].images.fixed_width_small_still.url);
    img.size(gifWidth, gifHeight);

    // Add image in the div. 
    divs[divNum].child(img);

    var mod = i % 10; 
    if (mod == 9) {
      print(divNum + ": Next row"); 
      divNum++; 
    }
  }
}

/*
function populateGifs() {
  print("populating gifs");
  // Create a collection of giphys
  var divNum = 0; 

  for (var i = 0; i < numRows * numGif; i++) {
    img = createImg(g.data[i].images.fixed_width.url);
    img.size(gifWidth, gifHeight);
    divs[divNum].child(img);

    var mod = i % numRows; 
    if (mod == 9) {
      divNum++; 
    }
  }
}
*/