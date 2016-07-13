/**/
"use strict;"

var L_TUBE = [true, true, false, false];
var I_TUBE = [true, false, true, false];
var T_TUBE = [true, true, true, false];
var X_TUBE = [true, true, true, true];
var NO_TUBE = [false, false, false, false];

function GameObject(parent, cssClass) {
    this.HTML = document.createElement("div");
    this.parent = parent;
    this.HTML.classList.add(cssClass);
}

GameObject.prototype.setPosition = function (x, y) {
    this.HTML.style.left = x * 45 + "px";
    this.HTML.style.top  = y * 45 + "px";
};

GameObject.prototype.removeObject = function () {
    this.HTML.remove();
};

GameObject.prototype.attachObject = function () {
    if (this.parent.HTML != undefined) {
        this.parent.HTML.appendChild(this.HTML);
    }
    else{
        this.parent.appendChild(this.HTML);
    }
};

Tube.prototype = new GameObject();

function notAbleToMove(offsetX, offsetY, branch, board) {
    return offsetX < 0 || offsetX >= board.width || offsetY < 0 || offsetY >= board.height
        || board.tubes[offsetY][offsetX] == undefined || board.tubes[offsetY][offsetX].branch[branch] == false;
}

function chechPathExistence(b, si, sj, ei, ej, cameFrom) {
    if (b.tubes[si][sj] == b.tubes[ei][ej]){
        return true;
    }
    for (let i = 0; i < 4; i++){
        if (b.tubes[si][sj].branch[i] == true && i != cameFrom){
            switch (i){
                case 0:
                    if (notAbleToMove(sj, si - 1, 2, b)){
                        break;
                    }
                    if (chechPathExistence(b, si - 1, sj, ei, ej, 2)){
                        return true;
                    }
                    break;
                case 1:
                    if (notAbleToMove(sj + 1, si, 3, b)){
                        break;
                    }
                    if (chechPathExistence(b, si, sj + 1, ei, ej, 3)){
                        return true;
                    }
                    break;
                case 2:
                    if (notAbleToMove(sj, si + 1, 0, b)){
                        break;
                    }
                    if (chechPathExistence(b, si + 1, sj, ei, ej, 0)) {
                        return true;
                    }
                    break;
                case 3:
                    if (notAbleToMove(sj - 1, si, 1, b)){
                        break;
                    }
                    if (chechPathExistence(b, si, sj - 1, ei, ej, 1)){
                        return true;
                    }
                    break;
            }
        }
    }
    return false;
}

function shiftRight(branch) {
    let tmp = branch[3];
    for (let i = 3; i > 0; --i){
        branch[i] = branch[i - 1];
    }
    branch[0] = tmp;
}

function shiftLeft(bracnh) {
    let tmp = bracnh[0];
    for (let i = 0; i < 3; i++){
        bracnh[i] = bracnh[i + 1];
    }
    bracnh[3] = tmp;
}

function checkWinCondition(board) {
    let connectedBegins = [];
    let connectedEnds = [];
    for (let i = 0; i < board.begins.length; i++){
        connectedBegins[i] = false;
        connectedEnds[i] = false;
    }
    let b = board;
    for (let i = 0; i < board.begins.length; i++){
        for (let j = 0; j < board.ends.length; j++){
            if (chechPathExistence(b, b.begins[i].i, b.begins[i].j, b.ends[j].i, b.ends[j].j, -1)){
                connectedBegins[i] = connectedEnds[j] = true;
            }
        }
    }
    for (let i = 0; i < b.begins.length; i++){
        if (!connectedBegins[i] || !connectedEnds[i]){
            return false;
        }
    }
    return true;
}

Tube.prototype.rotate = function (angle) {
    this.angle += angle;
    this.HTML.style.transform = "rotate(" + this.angle + "deg)";
    if (angle < 0){
        shiftLeft(this.branch);
    }
    else {
        shiftRight(this.branch);
    }
    if (!this.branch.locked){
        if (checkWinCondition(this.parent)){
            game.stopTimer();
            showWinBlock();
        }
    }
};

Tube.prototype.rotateRight = function () {
    this.rotate(90);
};

Tube.prototype.rotateLeft = function () {
    this.rotate(-90);
};


function Tube(parent, branch, tubeType, x, y) {
    GameObject.call(this, parent, "tube");
    this.HTML.classList.add(tubeType);
    this.tubeType = tubeType;
   
    this.branch = new Array(4);
    for (let i = 0; i < 4; i++){
        this.branch[i] = branch[i];
    }
    this.locked = false;
    this.angle = 0;
    if (tubeType != "tubeStart" && tubeType != "tubeFinish") {
        this.HTML.oncontextmenu = function () {
            this.rotateLeft();
            return false;
        }.bind(this);
        this.HTML.onclick = this.rotateRight.bind(this);
    }
    this.attachObject();
    this.setPosition(x, y);
    this.i = y;
    this.j = x;
}

Board.prototype = new GameObject();

function Board(width, height, startPoints, finishPoints) {
    GameObject.call(this, document.getElementById("groundBlockId"), "board");
    this.tubes = new Array(height);
    for (let i = 0; i < height; i++){
        this.tubes[i] = new Array(width);
    }
    this.width = width;
    this.height = height;
    this.level = null;
    this.HTML.style.width  = width * 45 + "px";
    this.HTML.style.height = height * 45 + "px";
    this.begins = [];
    this.ends = [];
    for (var i = 0; i < startPoints.length; i++) {
        var tmpA = this.begins[i] = {i: startPoints[i], j: 0 };
        var tmpB = this.ends[i] = {i: finishPoints[i], j: width - 1 };
        this.tubes[tmpA.i][tmpA.j] = new Tube(this.HTML, [true, true, true, true], "tubeStart", tmpA.j, tmpA.i);
        this.tubes[tmpB.i][tmpB.j] = new Tube(this.HTML, [true, true, true, true], "tubeFinish", tmpB.j, tmpB.i);
    }
    this.locked = true;
    this.attachObject();
}

Board.prototype.centrify = function () {
    this.HTML.style.left = Math.floor(window.innerWidth  / 2 - this.width * 45 / 2) + "px";
    this.HTML.style.top = "90px";
};

function Game() {
    this.timeLeft;
    this.board;
}

function tubeDataToCSS(tubeData) {
    if (tubeSize(tubeData) == 4) {
        return "tubeX";
    }
    if (tubeSize(tubeData) == 3) {
        return "tubeT";
    }
    if (tubeData[0] == true && tubeData[0] == tubeData[2]
        || tubeData[1] == true && tubeData[1] == tubeData[3]) {
        return "tubeI";
    }
    else if (tubeSize(tubeData) == 0) {
        return "";
    }
    else {
        return "tubeL";
    }
}

function cssToTube(cssData) {
    switch (cssData){
        case "tubeX":
            return X_TUBE;
        case "tubeL":
            return L_TUBE;
        case "tubeT":
            return T_TUBE;
        case "tubeI":
            return I_TUBE;
        default:
            return [false, false, false, false];
    }
}

Game.prototype.loadLevel = function (width, height, level) {
    if (this.board != null) {
        this.board.removeObject();
    }
    this.board = new Board(width, height, level.startPoints, level.endPoints);
    this.board.level = level;
    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var tubeData = level.tubeData[i][j];
            var cssData = tubeDataToCSS(tubeData);
            if (cssData == "") {
                continue;
            }
            this.board.tubes[i][j] = new Tube(this.board, cssToTube(cssData), cssData, j, i);
        }
    }
    this.randomize();
    this.stopTimer();
    this.startTimer(level.complexity * 30);
    this.board.centrify();
    this.board.locked = false;
};

Game.prototype.startTimer = function(timeLeft) {
    var currentTime = 0;
    var tick = setInterval(function() {
        currentTime++;
        if (currentTime == timeLeft) {
            alert('you lose');
            clearInterval(tick);
        }
        setProgress(Math.floor(currentTime / timeLeft * 100));
    }, 1000);
    this.tick = tick;
};

Game.prototype.stopTimer = function() {
    clearInterval(this.tick);
};

Game.prototype.isOver = function() {
    if (this.doCheckWinCondition == false) {
        return;
    }
    var b = this.board;
    for (let i = 0; i < b.begins.length; i++){
        checkWinCondition(b, b.begins[i].i, b.begins[i].j, b.ends[i].i, b.ends[i].j);
    }
};

Game.prototype.createRandomLevel = function(width, height, complexity) {

};

Game.prototype.solve = function () {
    action();
    if (this.board.level == null) {
        return;
    }
    var equalTubeData = function (a, b) {
        for (var i = 0; i < a.length; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    };
    var emptyData = [false, false, false, false];
    for (var i = 0; i < this.board.height; i++) {
        for (var j = 0; j < this.board.width; j++) {
            var labTubeData = this.board.level.tubeData[i][j];
            if (equalTubeData(labTubeData, emptyData)) {
                continue;
            }
            var tubeData = this.board.tubes[i][j].branch;
            while (!equalTubeData(labTubeData, tubeData)) {
                this.board.tubes[i][j].rotateRight();
                tubeData = this.board.tubes[i][j].branch;
            }
        }
    }
    this.doCheckWinCondition = true;
};

Game.prototype.lockUserActions = function () {

};

Game.prototype.unlockUserActions = function () {

};

Game.prototype.restart = function () {
    action();
    var width = game.board.width;
    var height = game.board.height;
    var level  = game.board.level;
    this.loadLevel(width, height, level);
};

Game.prototype.randomize = function () {
    //let b = this.board;
    for (let i = 0; i < this.board.height; i++){
        for (let j = 0; j < this.board.width; j++){
            if (this.board.tubes[i][j] != undefined && this.board.tubes[i][j].tubeType != "tubeStart" 
                && this.board.tubes[i][j].tubeType != "tubeFinish"){
                let rnd = randomInt(4);
                for (let k = 0; k <= rnd; k++){
                    this.board.tubes[i][j].rotateRight();
                }
            }
        }
    }
};

Game.prototype.createTestLevel = function () {
    console.log("Creating test level" );
    this.board = new Board(3, 3, 0, [{i: 0, j: 0}], [{i: 2, j: 2}]);
    this.board.setPosition(parseInt(this.board.parent.style.right) / 2, parseInt(this.board.parent.style.bottom) / 2);
    console.log("Creating Tubes");
    this.board.tubes[0][1] = new Tube(this.board, [true, true, true, false], "tubeT", 1, 0);
    this.board.tubes[0][2] = new Tube(this.board, [true, true, true, true], "tubeX", 2, 0);
    this.board.tubes[1][2] = new Tube(this.board, [true, false, true, false], "tubeI", 2, 1);
    
};


var game = new Game();
window.onresize = function () { game.board.centrify() };

var fieldWidth  = 5;
var fieldHeight = 5;

function chooseLevel(w, h){
    document.getElementById("levelId").style.display = 'none';
    fieldWidth = w;
    fieldHeight = h;
    newGame();
}

function newGame() {
    action();
    game.loadLevel(fieldWidth, fieldHeight, randomLevel(fieldWidth, fieldHeight, 1));
}
