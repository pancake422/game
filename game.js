//runs on load of sounds and images
function gameStart() {
    window.onkeydown = function(e) {
        if(e.keyCode == "87") {
            UP = true;
        }
        if(e.keyCode == "83") {
            DOWN = true;
        }
        if(e.keyCode == "65") {
            LEFT = true;
        }
        if(e.keyCode == "68") {
            RIGHT = true;
        }
        if(e.keyCode == "38") {
            UP = true;
        }
        if(e.keyCode == "40") {
            DOWN = true;
        }
        if(e.keyCode == "37") {
            LEFT = true;
        }
        if(e.keyCode == "39") {
            RIGHT = true;
        }
    }
    window.onkeyup = function(e) {
        if(e.keyCode == "87") {
            UP = false;
        }
        if(e.keyCode == "83") {
            DOWN = false;
        }
        if(e.keyCode == "65") {
            LEFT = false;
        }
        if(e.keyCode == "68") {
            RIGHT = false;
        }
        if(e.keyCode == "38") {
            UP = false;
        }
        if(e.keyCode == "40") {
            DOWN = false;
        }
        if(e.keyCode == "37") {
            LEFT = false;
        }
        if(e.keyCode == "39") {
            RIGHT = false;
        }
    }
    initLevel(0);
    loop();
}


//platformer physics engine code=================================================================================================================



//level elements-----------------------------------------------------------------
//each item of rects is: [xpos, ypos, width, height, surface_friction, surface_bounciness, imageTextureSource (if any, otherwise will be black)]
var rects = [];
//undefined = white background, otherwise use image name
var background = undefined;
var backgroundScrollMultiplier = 1;

//list of list of stored rects (each list of stored rects makes one level)
var levels = [
    [[0, 700, 1000, 100, 1, 0, "lemon"], [0, 0, 100, 800, 1, -0, undefined]],
];
function initLevel(levelnum) {
    rects = [];
    for(var i = 0; i < levels[levelnum].length; i++) {
        rects.push(levels[levelnum][i]);
    }
}
//player and camera position vars--------------------------
var player_x = 600;
var player_y = 400;
var player_mx = 0;
var player_my = 0;
var camera_x = 600;
var camera_y = 400;

var playerStartX = 600;
var playerStartY = 400;

//input vars---------------------------------------------
var UP = false;
var DOWN = false;
var LEFT = false;
var RIGHT = false;
//collision variables(tells which surfaces are in contact)----------------------------------------------
var touchingU = false;
var touchingD = false;
var touchingL = false;
var touchingR = false;

//player stats and variables affecting physics----------------------------------
var gravity = 2;

var playerWidth = 50;
var playerHeight = 75
var playerJumpVel = -30;
var playerXAccel = 2;
var playerMaxSpeed = 15;

var airStrafing = 0.5;

function createRect(xpos, ypos, width, height, friction, bounciness, imgsource) {
    rects.push([xpos, ypos, width, height, friction, bounciness, imgsource]);
}

function drawLevel() {
    ctx.clearRect(0,0,cw,ch);
    ctx.fillStyle = "rgb(0,0,0)";
    for(var i = 0; i < rects.length; i++) {
        if(rects[i][6] == undefined) {
            ctx.fillRect(rects[i][0] - camera_x + cw / 2, rects[i][1] - camera_y + ch / 2, rects[i][2], rects[i][3]);
        } else {
            drawImage(rects[i][6], rects[i][0] - camera_x + cw / 2  + 0.5 * rects[i][2] , rects[i][1] - camera_y + ch / 2 + 0.5 * rects[i][3], rects[i][2], rects[i][3]);
        }
    }
    ctx.fillStyle = "rgb(255,0,0)";
    ctx.fillRect(player_x + cw / 2 - camera_x, player_y + ch / 2 - camera_y, playerWidth, playerHeight);
}
function physicsStep() {
    //gravity!
    player_my += gravity;
    //jumping
    if(touchingD !== false && UP) {
        player_my = playerJumpVel;
    }
    //running L/R
    if(touchingD !== false) {
        //i can run
        if(LEFT) {
            player_mx -= playerXAccel;
        }
        if(RIGHT) {
            player_mx += playerXAccel;
        }
    } else {
        if(LEFT) {
            player_mx -= playerXAccel * airStrafing;
        }
        if(RIGHT) {
            player_mx += playerXAccel * airStrafing;
        }
    }
    if(player_mx > playerMaxSpeed) {
        player_mx = playerMaxSpeed;
    }
    if(player_mx < -playerMaxSpeed) {
        player_mx = -playerMaxSpeed;
    }
    //friction if on ground
    if(touchingD !== false) {
        var friction = rects[touchingD][4];
        if(player_mx != 0) {
            player_mx -= (player_mx / Math.abs(player_mx)) * friction;
        }
        if(Math.abs(player_mx) < friction) {
            player_mx = 0;
        }
    }
    //friction on walls
    if(touchingL) {
       var friction = rects[touchingL][4];
        if(player_my != 0) {
            player_my -= (player_my / Math.abs(player_my)) * friction;
        }
        if(Math.abs(player_my) < friction) {
            player_my = 0;
        } 
    }
    if(touchingR) {
       var friction = rects[touchingR][4];
        if(player_my != 0) {
            player_my -= (player_my / Math.abs(player_my)) * friction;
        }
        if(Math.abs(player_my) < friction) {
            player_my = 0;
        } 
    }
    doCollisions();
    player_x += player_mx;
    player_y += player_my;
}
function loop() {
    drawLevel();
    physicsStep();
    cameraMovement();
    requestAnimationFrame(loop, 20);
}
function doCollisions() {
    touchingU = false;
    touchingD = false;
    touchingL = false;
    touchingR = false;
    //check horizontal collisions
    for(var i = 0; i < rects.length; i++) {
        if((player_x < rects[i][0] + rects[i][2] || player_x + player_mx < rects[i][0] + rects[i][2]) && (player_x - playerWidth > rects[i][0] || player_x + player_mx - playerWidth > rects[i][0])) {
            //floor collisions
            if(player_y + playerHeight <= rects[i][1] && player_y + player_my + playerHeight > rects[i][1]) {
                player_my = player_my * rects[i][5];
                player_y = rects[i][1] - playerHeight;
                touchingD = i;
            }
            //ceiling collisions
            if(player_y >= rects[i][1] + rects[i][3] && player_y + player_my < rects[i][1] + rects[i][3]) {
                player_my = player_my * rects[i][5];
                player_y = rects[i][1] + rects[i][3];
                touchingU = i;
            }
        }
        if((player_y + playerHeight > rects[i][1] || player_y + playerHeight + player_my > rects[i][1]) && (player_y < rects[i][1] + rects[i][3] || player_y + player_my > rects[i][1] + rects[i][3])) {
            if(player_x >= rects[i][0] + rects[i][2] && player_x + player_mx < rects[i][0] + rects[i][2]) {
                touchingL = i;
                player_mx = player_mx * rects[i][5];
                player_x = rects[i][0] + rects[i][2]
            }
            if(player_x + playerWidth <= rects[i][0] && player_x + player_mx + playerWidth > rects[i][0]) {
                touchingR = i;
                player_mx = player_mx * rects[i][5];
                player_x = rects[i][0] - playerWidth;
            }
        }
    }
}
function cameraMovement() {
    var xshift = player_x - camera_x;
    var yshift = player_y - camera_y;
    if(xshift != 0) {
        camera_x += Math.ceil(Math.abs(xshift)) * xshift / Math.abs(xshift) / 10;
    }
    if(yshift != 0) {
        camera_y += Math.ceil(Math.abs(yshift)) * yshift / Math.abs(yshift) / 10;
    }
}