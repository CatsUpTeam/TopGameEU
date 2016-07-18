var clouds = [];
var tubes = [];
var stopTimer = false;

window.onload = function () {
    tuneLandscape();
    createClouds();
    createLevelSelectionMenu();
    cloudTimer(1,random(1,8),0);
};


var init = function() {
    document.getElementById('button').addEventListener('click', function(){
        document.getElementById('card').toggleClassName('flip');
    }, false);
};

window.addEventListener( 'DOMContentLoaded', init, false);
function showHiddenMenu() {
    var subMenu = document.getElementById("levelId");
    if (subMenu.style.display == 'none'){
        subMenu.style.display = 'block';
    } 
    else {
        subMenu.style.display = 'none';
    }
}

function cloudTimer(startTime, randomCoefficient, pushed) {
    if (startTime == 9) {
        startTime = 1;
        randomCoefficient = random(2,8);
    }
    else if (startTime % randomCoefficient  == 0) {
        clouds[pushed].style.transition = '80s';
        clouds[pushed].style.transitionTimingFunction = 'linear';
        pushCloud(clouds[pushed]);
        
        startTime = 1;
        randomCoefficient = random(2,8);
        pushed++;
        
        if (pushed == clouds.length){
            mixCloudsArr(clouds);
            pushed = 0;
        }
    }
    else {
        startTime++;
    }
    setTimeout(function () {
        cloudTimer(startTime,randomCoefficient,pushed);
    }, 3000);

}

var timer;

function gameTimer() {
    var tmp = document.getElementById("time").innerHTML.split(':');
    var seconds = parseInt(tmp[1]);

    if (stopTimer) {
        return;
    }

    if (seconds == 0) {
        showWinLoseBlock("You lose","rgb(252, 0, 0)");
        return;
    }
    seconds--;
    document.getElementById("time").innerHTML = "Time left: " + seconds;

    timer = setTimeout(function () {
        gameTimer(); }, 1000);
}

function startTimer() {
    
    stopTimer = false;
    document.getElementById("time").innerHTML = "Time Left: 60";
    gameTimer();
}

function mixCloudsArr(CloudsArr) {
    for (var i = 0; i < CloudsArr.length; i++) {
        var r = (random(2,7) * 50)*-1;
        var num = Math.floor(Math.random() * (i + 1));
        var d = CloudsArr[num];
        CloudsArr[num] = CloudsArr[i];
        CloudsArr[i] = d;
    }
}

function createClouds() {
    for (var i = 1; i <= 9; ++i) {
        var cloud = document.createElement('div');
        with (cloud.style) {
            background = "url(res/clouds/cloud" + i + ".png)";
            backgroundRepeat = 'no-repeat';
            top = random(0, 3) * 10 + 'px';
            zIndex = 2;
        }
        cloud.className = 'cloud';
        document.getElementById("skyBlockId").appendChild(cloud);
        clouds.push(cloud);
    }
    mixCloudsArr(clouds);
}

function pushCloud(cloud) {
    cloud.style.left = window.innerWidth + 2 + 'px';
    var transitionEvent = whichTransitionEvent();
    transitionEvent && cloud.addEventListener(transitionEvent, function() {
        if (parseInt(cloud.style.left) >= window.innerWidth) {
            cloud.style.transition = '0s';
            cloud.style.left = '-100px';
        }
    });
}

function tuneLandscape() {
    tuneSkyBlock();
    tuneGroudBlock()
}

function tuneSkyBlock() {
    var skyBlock = document.getElementById("skyBlockId");
    skyBlock.style.height = window.innerHeight * 0.3 + "px";
    tuneSkyBlockObjects(skyBlock);
}

function tuneSkyBlockObjects(parent) {
    
}

function tuneGroudBlock() {
    var grounBlock = document.getElementById("groundBlockId");
    grounBlock.style.height = window.innerHeight * 0.7 + "px";
    with (document.getElementById("skyBlockId")) {
        grounBlock.style.top = parseInt(style.height) + "px";

        var obj; 
        
        obj =  document.getElementById("houseId");
        with (obj.style) {
            height = '120px';
            top = parseInt(style.height) - parseInt(obj.style.height) + "px";
        }
        
        obj =  document.getElementById("wellId");
        with (obj.style) {
            height = '50px';
            top = parseInt(style.height) - parseInt(obj.style.height) + "px";
        }
    }
    tuneMenu();
}

function createLevelSelectionMenu(){
    var topvalue = 20,leftvalue = 20;
    
    function makeButton(name,buttonid) {
        var button = document.createElement('a');
        document.getElementById("chooselevelId").appendChild(button);
        with (button.style){
            position = 'inherit';
            width = '10px';
            height = '10px';

            if(buttonid % 6 == 0){
                topvalue += 50;
                leftvalue = 20
            }
            left = leftvalue + 'px';
            fontSize = '16px';
            top = topvalue + 'px';
            id = 'levelNumber:' + buttonid;
            leftvalue+=50;
        }
        button.className = 'menuButtons';
        button.innerHTML = name;
        
        button.onclick = function (event) {
            var sourceElem = event.target || event.srcElement;
            action();
            var tmp = sourceElem.id.split(':');
            var id = parseInt(tmp[1]);
        }
        
    }
    var obj = document.getElementById("chooselevelId");
    obj.style.left = (window.innerWidth / 2) - 200 + 'px';
    
    makeButton(1,1);
    makeButton(2,2);
    makeButton(3,3);
    makeButton(4,4);
    makeButton(5,5);
    makeButton(6,6);
    makeButton(7,7);
    makeButton(8,8);
    makeButton(9,9);
    makeButton('←',10);
}
function tuneMenu() {
    var children = document.getElementById("backId").childNodes;
    for (var i = 0; i < children.length;++i) {
        if (children[i].className == "menuButtons") {
            var id = children[i].id.split('_');
            children[i].style.top = (id[0] * 45) + 'px';
        } 
        else if (children[i].className == "level") {
            var submenu = document.getElementById("levelId");
            submenu.style.display = 'none';
            submenu.style.top = children[i - 4].style.top;
            
            for (var j = 0; j < submenu.childNodes.length;++j) {
                if (submenu.childNodes[j].className == "menuButtons") {
                    var id = submenu.childNodes[j].id.split('_');
                    submenu.childNodes[j].style.top = (id[1] * 45) + 'px';
                }
            }
        }
    }
}

var startTop,finishTop;

function action() {
    clearTimeout(timer);
    document.getElementById("time").innerHTML = "";
    stopTimer = true;
    
    document.getElementById("houseId").style.left = fieldLeft - 48  + 'px';
    document.getElementById("wellId").style.left = fieldRight - 5 + 'px';
    document.getElementById("levelId").style.display = 'none';
    blockAway("chooselevelId");
    blockAway("resultsId");
    blockAway("winDivId");
}

function cleanTubes() {
    for (var i = 0;i < tubes.length;++i){
        tubes[i].remove();
    }
    tubes = [];
}

function tubeToStart() {
    tuneStaticTubes(parseInt(startTop) + 90,fieldLeft - 45,0);
}

function tubeToFinsish() {
    tuneStaticTubes(parseInt(finishTop) + 90,fieldLeft + (fieldWidth*45),-90);
}

function tuneStaticTubes(ftop, fleft, rotate){
    var tube = document.createElement('div');
    tube.className = 'tube tubeL';
    with (tube.style) {
        transform = "rotate("+rotate+"deg)";
        position = 'absolute';
        left = fleft + 'px';
        top = ftop + 'px';
    }
    tubes.push(tube);
    document.getElementById("groundBlockId").appendChild(tube);

    for (var i =  0; i < ftop / 45; ++i){
        var tube = document.createElement('div');
        with (tube) {
            className = 'tube tubeI';
            style.position = 'absolute';
            style.left = fleft + 'px';
            style.top = i * 45 + 'px';
        }
        tubes.push(tube);
        document.getElementById("groundBlockId").appendChild(tube);
    }
}

function blockAway(idName) {
    var obj = document.getElementById(idName).style.top = '-300px';
}

function fillTable(data) {
    var table = document.getElementById("leaderBoardId");
    for (var keks in data) {
        if (data.hasOwnProperty(keks)) {
            var row = table.insertRow(1);
            var user = row.insertCell(0);
            var score = row.insertCell(1);
            user.innerHTML  =  data[keks].name;
            score.innerHTML = data[keks].score;   
        }
    }
}

function refreshTable() {
    var tab = document.getElementById("leaderBoardId");
    var rowAmount = tab.getElementsByTagName("tr").length;
    for (var i = 1; i < rowAmount; i++) {
        tab.deleteRow(1);
    }
    getHighScores();
}

function showlevelSelectionMenu(){
    tuneDropdownBlock("chooselevelId",290);
    action();
    var obj = document.getElementById("chooselevelId");
    document.getElementById("levelId").style.display = 'none';
    obj.style.top = '200px';
}

function showWinLoseBlock(text,fcolor){
    tuneDropdownBlock("winDivId",400);
    var obj = document.getElementById("winDivId");
    obj.childNodes[0].innerHTML = text;
    with (obj.style) {
        color = fcolor;
        transition = '1s';
        top = '50px';
    }
}

function showResultBlock(){
    tuneDropdownBlock("resultsId",290);
    action();
    refreshTable();
    var obj = document.getElementById("resultsId");
    with (obj.style) {
        top = '200px';
        height = '200px';
        overflowY = 'scroll';
    }
    
    var okBut = document.getElementById("addDataId");
    okBut.onclick = function () {
        checkUserExistence(document.getElementById("nameText").value,score);
        refreshTable();
    };

    var backBut = document.getElementById("fromTableId");
    backBut.onclick = function () { 
        action() 
    };
}

function tuneDropdownBlock(id,fwidth) {
    var obj = document.getElementById(id);
    obj.style.width = fwidth + 'px';
    obj.style.left = (window.innerWidth / 2) - parseInt(obj.style.width) / 2 + 'px';
}