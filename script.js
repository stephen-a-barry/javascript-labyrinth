//makes the maze window table and the maze key table

var theBody = document.querySelector('body');
var myTable = makeTable(25,25,'a');
theBody.appendChild(myTable);
var myTable2 = makeTable(15,15,'b');
theBody.appendChild(myTable2);


function makeTable(numRows, numCols, tableID) {
  var myDiv = document.createElement('div');
  var myTable = document.createElement('table');
  myTable.id = tableID + 't';

  for (i = 0; i < numRows; i++){
    var row = document.createElement('tr');
    row.className += ' ' + tableID + 'row';
    row.id = tableID + 'r' + i;

      for (j = 0; j < numCols; j++){
        var cell = document.createElement('td');
        cell.className += ' ' + tableID + 'cell';
        cell.id = tableID + 'c' + cellInfo(i, j+1, numCols);
      //cell.innerHTML = cellInfo(i, j+1, numCols);
        row.appendChild(cell);
      }
    myTable.appendChild(row);
  }
  myDiv.appendChild(myTable);
  return(myDiv);

  function cellInfo(fac1, fac2, fac3) {
    return (fac1 * fac3 + fac2);
  }
}

//Builds the maze map

var mazeArray = [1,2,3,4,5,7,8,9,10,11,12,13,14,15,16,22,24,30,31,33,34,35,36,
      37,39,41,42,43,45,46,48,56,58,60,61,63,65,66,67,68,69,71,73,75,76,82,88,
      90,91,93,94,95,97,99,100,101,103,104,105,106,112,114,120,121,122,123,125,
      126,127,129,131,132,133,135,136,138,144,150,151,153,155,157,158,159,160,
      161,163,165,166,168,170,178,180,181,183,184,185,187,189,190,191,192,193,
      195,196,202,204,210,211,212,213,214,215,216,217,219,220,221,222,223,224,225];

function buildMazeMap(mazeArray){
  for (var i = 0; i<mazeArray.length; i++) {
    var target = document.querySelector('#' + 'bc' + mazeArray[i]);
    target.className += ' wall';
  }
}

//Rotates the maze map

function rotateMazeMap(){
  var count = 0;
  var cellNum = 1;
  var mapFactor = Math.floor(numberOfColumns('b')/2);
  var mapFactorShift = Math.ceil(numberOfColumns('b')/2) * mapFactor;

  while (count < numberOfCells('b')){
    var target = document.querySelector('#bc' + cellNum);
    var holdPlace = document.querySelector('#ac' + numberOfCells('a'));
    if (target.className.match(/wall/g) == "wall"){
      holdPlace.className = "bcell wall";
    } else {
      holdPlace.className = "bcell";
    }

    for(var j = 0; j<3; j++){
      var target = document.querySelector('#bc' + cellNum);
      var destinationTarget = document.querySelector('#bc' + nextDestination('b', cellNum));
      if (destinationTarget.className.match(/wall/g) == "wall"){
        target.className = "bcell wall";
      } else {
        target.className = "bcell";
      }
      cellNum = nextDestination('b', cellNum);
      count++;
      }
    if (holdPlace.className.match(/wall/g) == "wall"){
      destinationTarget.className = "bcell wall";
    } else {
      destinationTarget.className = "bcell";
    }
    count++;

    if (count % 4 == 0){
        cellNum = nextDestination('b', cellNum);
        cellNum++;
    }

    if (count == mapFactorShift){
      cellNum += 2*rowNumber('b', cellNum);
      mapFactor--;
      mapFactorShift += Math.ceil(numberOfColumns('b')/2) * mapFactor;
    }

  }
}

function numberOfColumns(tableID){
  return document.querySelector('.' + tableID + 'row').children.length;
}

function numberOfRows(tableID){
  return document.querySelector('#' + tableID + 't').children.length;
}

function numberOfCells(tableID){
  return numberOfRows(tableID)*numberOfColumns(tableID);
}

function rowNumber(tableID, num){
  return Math.ceil(num/numberOfColumns(tableID))
}

function columnNumber(tableID, num){
  if (num % numberOfColumns(tableID) === 0){
    return numberOfColumns(tableID);
  } else {
    return num % numberOfColumns(tableID);
  }
}

function nextDestination(tableID, num){
  return ((numberOfColumns(tableID) + 1) - rowNumber(tableID, num)) + ((columnNumber(tableID, num) - 1) * numberOfColumns(tableID));
}

function left(){
  //this is the default rotate; I just put it in for congruency
}

function right(){
  for(var i=0; i<2; i++){
    rotateMazeMap(left());
  }
}

function mazeMove(){
  document.addEventListener("keydown", function(evt){
    switch (evt.keyCode){
      case 38:
        evt.preventDefault();
        mapPosition.cellNum = mapPosition.moveForward(mapPosition.cellNum);
        break;
      case 39:
        rotateMazeMap(left());
        mapPosition.cellNum = mapPosition.turnRight(mapPosition.cellNum);
        break;
      case 37:
        rotateMazeMap(right());
        mapPosition.cellNum = mapPosition.turnLeft(mapPosition.cellNum);
        break;
      case 40:
        evt.preventDefault();
        break;
      default:
        break;
    }
  });
}

var mapPosition = {
  cellNum: 218,
  direction: "north",
};

mapPosition.state = function(){
  document.querySelector("#bc" + mapPosition.cellNum).innerHTML = "\u21D1";
}

mapPosition.moveForward = function(oldPosition){
  if (oldPosition == 218){
    document.querySelector("#bc218").className = "bcell wall";  //Encloses user into the maze
  }
  var newPosition = oldPosition - numberOfColumns('b');
  if (newPosition < 1){
    confirm("You Solved The Maze!!!");
    location.reload();
  }
  if (document.querySelector("#bc" + newPosition).className === " bcell wall" ||
      document.querySelector("#bc" + newPosition).className === "bcell wall") {
    return oldPosition;
    } else {
      document.querySelector("#bc" + oldPosition).innerHTML = '';
      document.querySelector("#bc" + newPosition).innerHTML = "\u21D1";
      return newPosition;
    }
}

mapPosition.turnRight = function(oldPosition){
  var newPosition = nextDestination('b', oldPosition); //Three left turns
  newPosition = nextDestination('b', newPosition);     //make a right turn
  newPosition = nextDestination('b', newPosition);
  document.querySelector("#bc" + oldPosition).innerHTML = '';
  document.querySelector("#bc" + newPosition).innerHTML = "\u21D1";
  switch(mapPosition.direction){
    case "north":
      mapPosition.direction = "east";
      break;
    case "east":
      mapPosition.direction = "south";
      break;
    case "south":
      mapPosition.direction = "west";
      break;
    case "west":
      mapPosition.direction = "north";
      break;
    default:
      break;
  }
  return newPosition;
}

mapPosition.turnLeft = function(oldPosition){
  var newPosition = nextDestination('b', oldPosition);
  document.querySelector("#bc" + oldPosition).innerHTML = '';
  document.querySelector("#bc" + newPosition).innerHTML = "\u21D1";
  switch(mapPosition.direction){
    case "north":
      mapPosition.direction = "west";
      break;
    case "west":
      mapPosition.direction = "south";
      break;
    case "south":
      mapPosition.direction = "east";
      break;
    case "east":
      mapPosition.direction = "north";
      break;
    default:
      break;
  }
  return newPosition;
}

function main(){
  buildMazeMap(mazeArray);
  mapPosition.state();
  mazeMove();
}

main();
