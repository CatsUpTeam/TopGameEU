"use strict;"

var L_TUBE  = [true  ,true  ,false ,false];
var I_TUBE  = [true  ,false ,true  ,false];
var T_TUBE  = [true  ,true  ,true  ,false];
var X_TUBE  = [true  ,true  ,true  ,true];
var NO_TUBE = [false ,false ,false ,false];

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
    this.parent.HTML == undefined ?
        this.parent.appendChild(this.HTML)
      : this.parent.HTML.appendChild(this.HTML); 
};

var notAbleToMove = function(offPoint, branch, board) {
    return !inBorders(offPoint, board.width, board.height)
        || board.tubes[offPoint.y][offPoint.x] == undefined
        || board.tubes[offPoint.y][offPoint.x].branch[branch] == false;
};

function checkPathExistence(board, sPos, ePos, cameFrom) {
    if (board.tubes[sPos.y][sPos.x] == board.tubes[ePos.y][ePos.x]) {
        return true;
    }
    var directions = [[0, -1, 2], [1, 0, 3], [0, 1, 0], [-1, 0, 1]];
    for (var i = 0; i < 4; i++) {
        if (board.tubes[sPos.y][sPos.x].branch[i] == true && i != cameFrom) {
            var dx     = directions[i][0];
            var dy     = directions[i][1];
            var branch = directions[i][2];
            if (notAbleToMove(sPos.addXY(dx, dy), branch, board)) {
                continue;
            }
            if (checkPathExistence(board, sPos.addXY(dx, dy), ePos, branch)) {
                return true;
            }
        }
    }
    return false;
}

function checkWinCondition(board) {
    var connectedBegins = [];
    var connectedEnds = [];
    for (var i = 0; i < board.begins.length; i++) {
        connectedBegins[i] = false;
        connectedEnds[i] = false;
    }
    for (i = 0; i < board.begins.length; i++) {
        for (var j = 0; j < board.ends.length; j++) {
            if (checkPathExistence(board, board.begins[i], board.ends[i], -1)) {
                connectedBegins[i] = connectedEnds[j] = true;
            }
        }
    }
    for (i = 0; i < board.begins.length; i++) {
        if (!connectedBegins[i] || !connectedEnds[i]) {
            return false;
        }
    }
    return true;
}

Tube.prototype = new GameObject();

function Tube(parent, branch, tubeType, x, y) {
    GameObject.call(this, parent, "tube");
    this.HTML.classList.add(tubeType);
    this.tubeType = tubeType;
    this.locked = false;
    this.angle = 0;
    this.branch = new Array(4);
    
    for (var i = 0; i < 4; i++){
        this.branch[i] = branch[i];
    }
    if (tubeType != "tubeStart" && tubeType != "tubeFinish") {
        this.HTML.oncontextmenu = function () {
            this.rotateLeft();
            return false;
        }.bind(this);
        this.HTML.onclick = this.rotateRight.bind(this);
    }
    this.attachObject();
    this.setPosition(x, y);
}

Tube.prototype.rotate = function (angle) {
    var shiftRight = function(branch) {
        branch.unshift(branch[3]);
    };
    var shiftLeft = function(branch) {
        branch.push(branch[0]);
        branch.shift();
    };
    
    this.angle += angle;
    this.HTML.style.transform = "rotate(" + this.angle + "deg)";
    angle < 0 ? shiftLeft(this.branch) : shiftRight(this.branch);
    if (!this.branch.locked && checkWinCondition(this.parent)) {
        game.stopTimer();
        showWinLoseBlock("congratulations", "rgb(252, 240, 5)");
    }
};

Tube.prototype.rotateRight = function () {
    this.rotate(90);
};

Tube.prototype.rotateLeft = function () {
    this.rotate(-90);
};

Board.prototype = new GameObject();

function Board(level) {
    GameObject.call(this, document.getElementById("groundBlockId"), "board");
    this.tubes = new Array(level.height);
    for (var i = 0; i < level.height; i++) {
        this.tubes[i] = new Array(level.width);
    }
    this.width = level.width;
    this.height = level.height;
    this.HTML.style.width  = this.width  * 45 + "px";
    this.HTML.style.height = this.height * 45 + "px";
    this.level = level;
    this.begins = [];
    this.ends = [];
    for (i = 0; i < level.startPoints.length; i++) {
        var tA = this.begins[i] = new Point(0, level.startPoints[i]);
        var tB = this.ends[i]   = new Point(this.width - 1, level.endPoints[i]);
        this.tubes[tA.y][tA.x] = new Tube(this.HTML, X_TUBE, "tubeStart",  tA.x, tA.y);
        this.tubes[tB.y][tB.x] = new Tube(this.HTML, X_TUBE, "tubeFinish", tB.x, tB.y);
        startTop  = this.tubes[tA.y][tA.x].HTML.style.top;
        finishTop = this.tubes[tB.y][tB.x].HTML.style.top;
    }
    this.locked = true;
    this.attachObject();
}

var fieldLeft, fieldRight;

Board.prototype.centrify = function () {
    // this.HTML.style.left = Math.floor(window.innerWidth  / 2 - this.width * 45 / 2) + "px";
    // this.HTML.style.top = "90px";
    this.HTML.style.left = Math.floor(window.innerWidth  / 2 - this.width * 45 / 2) + "px";
    fieldLeft = Math.floor(window.innerWidth  / 2 - this.width * 45 / 2);
    fieldRight = fieldLeft + parseInt(this.width * 45);
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
            return NO_TUBE;
    }
}

Game.prototype.loadLevel = function (level) {
    if (this.board != null) {
        this.board.removeObject();
    }
    this.board = new Board(level);
    for (var i = 0; i < level.height; i++) {
        for (var j = 0; j < level.width; j++) {
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
            showWinLoseBlock("You lose", "rgb(252, 0, 0)");
            clearInterval(tick);
        }
        setProgress(Math.floor(currentTime / timeLeft * 100));
    }, 1000);
    this.tick = tick;
};

Game.prototype.stopTimer = function() {
    clearInterval(this.tick);
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
    for (var i = 0; i < this.board.height; i++) {
        for (var j = 0; j < this.board.width; j++) {
            var labTubeData = this.board.level.tubeData[i][j];
            if (equalTubeData(labTubeData, NO_TUBE)) {
                continue;
            }
            var tubeData = this.board.tubes[i][j].branch;
            while (!equalTubeData(labTubeData, tubeData)) {
                this.board.tubes[i][j].rotateRight();
                tubeData = this.board.tubes[i][j].branch;
            }
        }
    }
};

Game.prototype.restart = function () {
    var level  = game.board.level;
    this.loadLevel(level);
    action();
};

Game.prototype.randomize = function () {
    var tubes = this.board.tubes;
    for (var i = 0; i < this.board.height; i++) {
        for (var j = 0; j < this.board.width; j++) {
            if (tubes[i][j] != undefined && tubes[i][j].tubeType != "tubeStart" 
                && tubes[i][j].tubeType != "tubeFinish") {
                var rnd = randomInt(4);
                for (var k = 0; k <= rnd; k++) {
                    tubes[i][j].rotateRight();
                }
            }
        }
    }
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
    game.loadLevel(randomLevel(fieldWidth, fieldHeight, 1));
    cleanTubes();
    tubeToStart();
    tubeToFinsish();
    action();
}

function addToScoreBoard(username, score) {
    firebase.database().ref('users/'+ username).set({
        name : username,
        score: score
    });
}

function checkUserExistence(username, score) {
    var value = 0;
    var user = firebase.database().ref('users/' + username).once('value', function(snapshot){
        //console.log(snapshot.val());
        value = snapshot.val();
        if (value == null){
            addToScoreBoard(username, score);
        }
        else{
            var updates = {};
            updates['users/' + username +"/score"] = score;
            updates["users/" + username + "/name"] = username;
            firebase.database().ref().update(updates);
        }
    });
    if (value == null) {
        addToScoreBoard(username, score);
        return;
    }
    
}

function getHighScores() {
    var data = null;
    console.log(firebase.database().ref("users").once("value", function (snapshot) {
        console.log(snapshot.val();
        data = snapshot.val();)
    }));
    
}

