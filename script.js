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
        var cellDiv = document.createElement('div');
        cell.appendChild(cellDiv);
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
    translateMapToWindow(mapPosition.cellNum);
  });
}

//Object mapPosition and methods

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
  if (newPosition == 6){
    confirm("You Solved The Maze!!!");
    location.reload();
  }
  if (document.querySelector("#bc" + newPosition).classList.contains("wall") == true) {
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

//Maze window sections

function section1(blockColor,splitColor1,splitColor2){
  paintCells(2,24,1,blockColor);
  paintCells(28,48,1,blockColor);
  //borderCells(28,48,1,"bottom","black");
  splitCells(25,49,24,splitColor1,splitColor2);
}

function section2(blockColor,splitColor1,splitColor2){
  paintCells(54,72,1,blockColor);
  paintCells(80,96,1,blockColor);
  paintCells(106,120,1,blockColor);
  paintCells(132,144,1,blockColor);
  //borderCells(132,144,1,"bottom","black");
  splitCells(73,145,24,splitColor1,splitColor2);
}

function section3(blockColor,splitColor1,splitColor2){
  paintCells(158,168,1,blockColor);
  paintCells(184,192,1,blockColor);
  paintCells(210,216,1,blockColor);
  //borderCells(210,216,1,"bottom","black");
  splitCells(169,217,24,splitColor1,splitColor2);
}

function section4(blockColor,splitColor1,splitColor2){
  paintCells(236,240,1,blockColor);
  paintCells(262,264,1,blockColor);
  //borderCells(262,264,1,"bottom","black");
  splitCells(241,265,24,splitColor1,splitColor2);
}

function section5(blockColor,splitColor1,splitColor2){
  paintCells(288,288,1,blockColor);
  //borderCells(288,288,1,"bottom","black");
  splitCells(289,289,1,splitColor1,splitColor2)
}

function section6(blockColor,splitColor1,splitColor2){
  paintCells(338,338,1,blockColor);
  //borderCells(338,338,1,"top","black");
  splitCells(337,337,1,splitColor1,splitColor2);
}

function section7(blockColor,splitColor1,splitColor2){
  paintCells(362,364,1,blockColor);
  paintCells(386,390,1,blockColor);
  //borderCells(362,364,1,"top","black");
  splitCells(361,385,24,splitColor1,splitColor2)
}

function section8(blockColor, splitColor1, splitColor2){
  paintCells(410,416,1,blockColor);
  paintCells(434,442,1,blockColor);
  paintCells(458,468,1,blockColor);
  //borderCells(410,416,1,"top","black");
  splitCells(409,457,24,splitColor1,splitColor2);
}

function section9(blockColor, splitColor1, splitColor2){
  paintCells(482,494,1,blockColor);
  paintCells(506,520,1,blockColor);
  paintCells(530,546,1,blockColor);
  paintCells(554,572,1,blockColor);
  //borderCells(482,494,1,"top","black");
  splitCells(481,553,24,splitColor1,splitColor2);
}

function section10(blockColor, splitColor1, splitColor2){
  paintCells(578,598,1,blockColor);
  paintCells(602,624,1,blockColor);
  //borderCells(578,598,1,"top","black");
  splitCells(577,601,24,splitColor1,splitColor2);
}

function section11(blockColor, splitColor1, splitColor2){
  paintCells(26,26,1,blockColor);
  splitCells(1,27,26,splitColor1,splitColor2);
}

function section12(blockColor){
  paintCells(51,551,25,blockColor);
  paintCells(52,552,25,blockColor);
  //borderCells(52,552,25,"right","black")
}

function section13(blockColor){
  paintCells(576,576,1,blockColor);
}

function section14(blockColor,splitColor1,splitColor2){
  paintCells(78,78,1,blockColor);
  paintCells(103,104,1,blockColor);
  paintCells(128,130,1,blockColor);
  splitCells(53,131,26,splitColor1,splitColor2);
}

function section15(blockColor){
  paintCells(153,453,25,blockColor);
  paintCells(154,454,25,blockColor);
  paintCells(155,455,25,blockColor);
  paintCells(156,456,25,blockColor);
  //borderCells(156,456,25,"right","black");
}

function section16(blockColor,splitColor1,splitColor2){
  paintCells(478,480,1,blockColor);
  paintCells(503,504,1,blockColor);
  paintCells(528,528,1,blockColor);
}

function section17(blockColor,splitColor1,splitColor2){
  paintCells(182,182,1,blockColor);
  paintCells(207,208,1,blockColor);
  splitCells(157,209,26,splitColor1,splitColor2);
}

function section18(blockColor){
  paintCells(232,382,25,blockColor);
  paintCells(233,383,25,blockColor);
  paintCells(234,384,25,blockColor);
  //borderCells(234,384,25,"right","black");
}

function section19(blockColor){
  paintCells(407,408,1,blockColor);
  paintCells(432,432,1,blockColor);
}

function section20(blockColor,splitColor1,splitColor2){
  paintCells(260,260,1,blockColor);
  splitCells(235,261,26,splitColor1,splitColor2);
}

function section21(blockColor){
  paintCells(285,335,25,blockColor);
  paintCells(286,336,25,blockColor);
  //borderCells(286,336,25,"right","black");
}

function section22(blockColor){
  paintCells(360,360,1,blockColor);
}

function section23(blockColor,splitColor1,splitColor2){
  splitCells(287,287,1,splitColor1,splitColor2);
}

function section24(blockColor){
  paintCells(312,312,1,blockColor);
}

function section25(blockColor){
  paintCells(314,314,1,blockColor);
}

function section26(blockColor,splitColor1,splitColor2){
  splitCells(339,339,1,splitColor1,splitColor2);
}

function section27(blockColor){
  paintCells(266,266,1,blockColor);
}

function section28(blockColor){
  paintCells(290,340,25,blockColor);
  paintCells(291,341,25,blockColor);
  //borderCells(290,340,25,"left","black");
}

function section29(blockColor,splitColor1,splitColor2){
  paintCells(366,366,1,blockColor);
  splitCells(365,391,26,splitColor1,splitColor2);
}

function section30(blockColor){
  paintCells(218,218,1,blockColor);
  paintCells(194,219,25,blockColor);
}

function section31(blockColor){
  paintCells(242,392,25,blockColor);
  paintCells(243,393,25,blockColor);
  paintCells(244,394,25,blockColor);
  //borderCells(242,392,25,"left","black");
}

function section32(blockColor,splitColor1,splitColor2){
  paintCells(418,418,1,blockColor);
  paintCells(419,444,25,blockColor);
  splitCells(417,469,26,splitColor1,splitColor2);
}

function section33(blockColor){
  paintCells(146,146,1,blockColor);
  paintCells(122,147,25,blockColor);
  paintCells(98,148,25,blockColor);
}

function section34(blockColor){
    paintCells(170,470,25,blockColor);
    paintCells(171,471,25,blockColor);
    paintCells(172,472,25,blockColor);
    paintCells(173,473,25,blockColor);
    //borderCells(170,470,25,"left","black");
}

function section35(blockColor,splitColor1,splitColor2){
  paintCells(496,496,1,blockColor);
  paintCells(497,522,25,blockColor);
  paintCells(498,548,25,blockColor);
  splitCells(495,573,26,splitColor1,splitColor2);
}

function section36(blockColor){
  paintCells(50,50,1,blockColor);
}

function section37(blockColor){
  paintCells(74,574,25,blockColor);
  paintCells(75,575,25,blockColor);
  //borderCells(74,574,25,"left","black");
}

function section38(blockColor, splitColor1, splitColor2){
  paintCells(600,600,1,blockColor);
  splitCells(599,625,26,splitColor1,splitColor2);
}

function section39(blockColor){
  paintCells(313,313,1,blockColor);
}

//maze window functions

function paintCells(num1, num2, num3, paintColor){
  for (num1; num1<=num2; num1+=num3){
    var targetCell = document.querySelector('#ac' + num1);
    targetCell.className = " acell " + paintColor;
  }
}

function borderCells(num1, num2, num3, whichBorder, borderColor){
  for (num1; num1<=num2; num1 += num3){
    var targetCell = document.querySelector('#ac' + num1);
    switch(whichBorder){
      case "right":
      targetCell.style.borderRightWidth = "1px";
      targetCell.style.borderRightColor = borderColor;
      break;
      case "left":
      targetCell.style.borderLeftWidth = "1px";
      targetCell.style.borderLeftColor = borderColor;
      break;
      case "bottom":
      targetCell.style.borderBottomWidth = "1px";
      targetCell.style.borderBottomColor = borderColor;
      break;
      case "top":
      targetCell.style.borderTopWidth = "1px";
      targetCell.style.borderTopColor = borderColor;
      break;
      default:
      confirm("Error")
    }
  }
}

function splitCells(num1,num2,num3,color1,color2){
  for (num1; num1<=num2; num1+=num3){
    var targetCell = document.querySelector('#ac' + num1);
    var splitCell = document.createElement('div');
    splitCell.className = " " + color1 + ' ' + color2;
    var replacedDiv = targetCell.childNodes[0];
    targetCell.replaceChild(splitCell, replacedDiv);
  }
}

//blockColors are skyblue, floorgray, and wallgray
//splitColors are topSky, leftSky, rightSky, bottomFloor, leftFloor, rightFloor,
//leftWall, rightWall, topWall, and bottomWall

function translateMapToWindow(cellNum){

  section39("wallgray");
  section24("wallgray");
  section25("wallgray");

  if (wallCheck(cellNum,4,"left") == true){
    section6("floorgray","leftWall","bottomFloor");
    section23("wallgray","leftWall","topSky");
  } else {
    section6("floorgray","bottomFloor","leftFloor");
    section23("wallgray","topSky","leftSky");
  }
  if (wallCheck(cellNum,4,"right") == true){
    section5("skyblue","topSky","rightWall");
    section26("floorgray","rightWall","bottomFloor");
  } else {
    section5("skyblue","topSky","rightSky");
    section26("floorgray","bottomFloor","rightFloor");
  }
  if (wallCheck(cellNum,4,"center") == true){
    wallSection1();
  }
  if (wallCheck(cellNum,3,"left") == true){
    section7("floorgray","bottomFloor","leftWall");
    section20("wallgray","topSky","leftWall");
    section21("wallgray");
    section22("wallgray");
  } else {
    section7("floorgray","bottomFloor","leftFloor");
    section20("skyblue","topSky","leftSky");
    section21("wallgray");
    section22("floorgray");
  }
  if (wallCheck(cellNum,3,"right") == true){
    section4("skyblue","topSky","rightWall");
    section27("wallgray");
    section28("wallgray");
    section29("wallgray","bottomFloor","rightWall");
  } else {
    section4("skyblue","topSky","rightSky");
    section27("skyblue");
    section28("wallgray");
    section29("floorgray","bottomFloor","rightFloor");
  }
  if (wallCheck(cellNum,3,"center") == true){
    wallSection2();
  }
  if (wallCheck(cellNum,2,"left") == true){
    section8("floorgray","bottomFloor","leftWall");
    section17("wallgray","topSky","leftWall");
    section18("wallgray");
    section19("wallgray");
  } else {
    section8("floorgray","bottomFloor","leftFloor");
    section17("skyblue","topSky","leftSky");
    section18("wallgray");
    section19("floorgray");
  }
  if (wallCheck(cellNum,2,"right") == true){
    section3("skyblue","topSky","rightWall");
    section30("wallgray");
    section31("wallgray");
    section32("wallgray","bottomFloor","rightWall");
  } else {
    section3("skyblue","topSky","rightSky");
    section30("skyblue");
    section31("wallgray");
    section32("floorgray","bottomFloor","rightFloor");
  }
  if (wallCheck(cellNum,2,"center") == true){
    wallSection3();
  }
  if (wallCheck(cellNum,1,"left") == true){
    section9("floorgray","bottomFloor","leftWall");
    section14("wallgray","topSky","leftWall");
    section15("wallgray");
    section16("wallgray");
  } else {
    section9("floorgray","bottomFloor","leftFloor");
    section14("skyblue","topSky","leftSky");
    section15("wallgray");
    section16("floorgray");
  }
  if (wallCheck(cellNum,1,"right") == true){
    section2("skyblue","topSky","rightWall");
    section33("wallgray");
    section34("wallgray");
    section35("wallgray","bottomFloor","rightWall");
  } else {
    section2("skyblue","topSky","rightSky");
    section33("skyblue");
    section34("wallgray");
    section35("floorgray","bottomFloor","rightFloor");
  }
  if (wallCheck(cellNum,1,"center") == true){
    wallSection4();
  }
  if (wallCheck(cellNum,0,"left") == true){
    section10("floorgray","bottomFloor","leftWall");
    section11("wallgray","topSky","leftWall");
    section12("wallgray");
    section13("wallgray");
  } else {
    section10("floorgray","bottomFloor","leftFloor");
    section11("skyblue","topSky","leftSky");
    section12("wallgray");
    section13("floorgray");
  }
  if (wallCheck(cellNum,0,"right") == true){
    section1("skyblue","topSky","rightWall");
    section36("wallgray");
    section37("wallgray");
    section38("wallgray","bottomFloor","rightWall");
  } else {
    section1("skyblue","topSky","rightSky");
    section36("skyblue");
    section37("wallgray");
    section38("floorgray","bottomFloor","rightFloor");
  }
  if (wallCheck(cellNum,0,"center") == true){
    wallSection5();
  }
}

function wallSection1(){
  section5("wallgray","topWall","rightWall");
  section6("wallgray","leftWall","bottomWall");
  section23("wallgray","topWall","leftWall");
  section24("wallgray");
  section25("wallgray");
  section26("wallgray","bottomWall","rightWall");
}

function wallSection2(){
  wallSection1();
  section4("wallgray","topWall","rightWall");
  section7("wallgray","bottomWall","leftWall");
  section20("wallgray","topWall","leftWall");
  section21("wallgray");
  section22("wallgray");
  section27("wallgray");
  section28("wallgray");
  section29("wallgray","bottomWall","rightWall");
}

function wallSection3(){
  wallSection2();
  section3("wallgray","topWall","rightWall");
  section8("wallgray","bottomWall","leftWall");
  section17("wallgray","topWall","leftWall");
  section18("wallgray");
  section19("wallgray");
  section30("wallgray");
  section31("wallgray");
  section32("wallgray","bottomWall","rightWall");
}

function wallSection4(){
  wallSection3();
  section2("wallgray","topWall","rightWall");
  section9("wallgray","bottomWall","leftWall");
  section14("wallgray","topWall","leftWall");
  section15("wallgray");
  section16("wallgray");
  section33("wallgray");
  section34("wallgray");
  section35("wallgray","bottomWall","rightWall");
}

function wallSection5(){
  wallSection4();
  section1("wallgray","topWall","rightWall");
  section10("wallgray","bottomWall","leftWall");
  section11("wallgray","topWall","leftWall");
  section12("wallgray");
  section13("wallgray");
  section36("wallgray");
  section37("wallgray");
  section38("wallgray","bottomWall","rightWall");
}
//checking whether there is a wall at depth 1-5, and if it is on the left, right, or straight ahead

function wallCheck(cellNum,depth,leftRightOrCenter){
  var checkPosition;
  if (leftRightOrCenter == "left"){
    checkPosition = document.querySelector("#bc" + (cellNum - (15*depth+1)));
  } else if (leftRightOrCenter == "right"){
    checkPosition = document.querySelector("#bc" + (cellNum - (15*depth-1)));
  } else {
    checkPosition = document.querySelector("#bc" + (cellNum - (15*depth)));
  }
  if (checkPosition != null){
    return (checkPosition.classList.contains("wall"));
  } else {
    return false;
  }
}

function main(){
  buildMazeMap(mazeArray);
  mapPosition.state();
  translateMapToWindow(218);
  mazeMove();
}

main();
