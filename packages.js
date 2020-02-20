//basic canvas load----------------------------------------------------------
var c;
var ctx;
var cw;
var ch;
window.onload = function() {
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    cw = c.width;
    ch = c.height;
    loadSounds();
}
//image load/render code-----------------------------------------------------
var ImageFiles = ["image1.jpg", "image2.jpg", "angry_emoji.jpg", "green_square.png", "lemon.jpg"];
var Images = {};
var startupFunction = gameStart;
function loadImages() {
    loadImage(0);
}
function loadImage(id) {
    imgloadscreen(id, ImageFiles.length, 0);
    //get image name without end tags
    var imgName = ImageFiles[id];
    if(imgName.includes(".")) {
        while(imgName.charAt(imgName.length - 1) != ".") {
            imgName = imgName.slice(0, imgName.length - 1);
        }
        imgName = imgName.slice(0, imgName.length - 1);
        Images[imgName] = new Image();
        Images[imgName].src = "Images/" + ImageFiles[id];
    } else {
        console.log("Error: " + imgName + " is not a valid image file (" + id + ")");
    }
    if(id + 1 < ImageFiles.length) {
        Images[imgName].onload = function() {loadImage(id + 1)}
    } else {
        imgloadscreen(id + 1, ImageFiles.length, 0);
        startupFunction.call(globalThis);
    }
}
//note: xpos and ypos are the center of the image in this case because thats how I like it
function drawImage(imgName, xpos, ypos, width, height, rotation) {
    ctx.translate(xpos, ypos);
    ctx.rotate(rotation);
    ctx.drawImage(Images[imgName], width / -2, height / -2, width, height);
    ctx.rotate(-rotation);
    ctx.translate(-xpos, -ypos);
}
//sound loading--------------------------------------------------------------
var soundFiles = ["Test1.wav", "Test2.wav", "The Box.mp3"];
var Sounds = {};
var loadCount = 0;
function loadSounds() {
    loadSound(0);
}
function loadSound(id) {
    imgloadscreen(id, soundFiles.length, 1);
    //get sound name without end tags
    var soundName = soundFiles[id];
    if(soundName.includes(".")) {
        while(soundName.charAt(soundName.length - 1) != ".") {
            soundName = soundName.slice(0, soundName.length - 1);
        }
        soundName = soundName.slice(0, soundName.length - 1);
        Sounds[soundName] = new Audio();
        Sounds[soundName].src = "Sounds/" + soundFiles[id];
    } else {
        console.log("Error: " + soundName + " is not a valid sound file (" + id + ")");
    }
    if(id + 1 < soundFiles.length) {
        Sounds[soundName].oncanplaythrough = function() {
            if(loadCount < soundFiles.length - 1) {
                loadSound(id + 1);
                loadCount++;
            }
        }
    } else {
        loadImage(0);
    }
}
function playSound(name) {
    Sounds[name].pause();
    Sounds[name].currentTime = 0;
    Sounds[name].play();
}
function pauseSound(name) {
    Sounds[name].pause();
}
function unpauseSound(name) {
    if(Sounds[name].currentTime != 0 && Sounds[name].currentTime != Sounds[name].duration) {
        Sounds[name].play();
    }
}
function setVolume(name, val) {
    Sounds[name].volume = val
}
//custom text rendering------------------------------------------------------
//uses a 7*7 grid input
var horizTextAlign = "left";
var vertTextAlign = "top";
var chars = {
    " ": "",
    1: "32414243444546374757",
    2: "2226313537414447515457626367",
    3: "222631343741444751545762636566",
    4: "2324323441445152535455565764",
    5: "2122232427313437414447515457616566",
    6: "2223242526313437414447515457616566",
    7: "2131414647515455616263",
    8: "2223252631343741444751545762636566",
    9: "22233134374144475154576263646566",
    0: "22232425263135374144475153576263646566",
    "+": "243442434445465464",
    "-": "2535455565",
    "*": "3335445355",
    "/": "24344244465464",
    "(": "222324252631374147",
    ")": "414751576263646566",
    "=": "23253335434553556365",
    "^": "2534435465",
    "!": "212223242627",
    ".": "27",
    "?": "22313537414551546263",
    ",": "283637",
    "_": "2737475767",
    "<": "2433354246",
    ">": "4246535564",
    "@": "1213141516212731414445465153576163677273747576",
    "#": "23253233343536434552535455566365",
    "$": "222324263234364142434445464752545662646566",
    "%": "22263544536266",
    "&": "2223252631343741444547515253565767",
    "~": "2435445364",
    "'": "2122",
    '"': "31325152",
    a: "2526343744475456656667",
    b: "2122232425263437444754576566",
    c: "2526343744475457",
    d: "2526343744475457616263646566",
    e: "242526333537434547535457",
    f: "333435363742445262",
    g: "252634373944474954575965666768",
    h: "22232425262735455657",
    i: "4244454657",
    j: "2839495355565758",
    k: "212223242526273544465357",
    l: "3141424344454657",
    m: "25262734454654656667",
    n: "242526273444555657",
    o: "25263437444754576566",
    p: "25262728293437444754576566",
    q: "2526343744475457656667686979",
    r: "2324252627344455",
    s: "24273335374345475356",
    t: "3442434445465457",
    u: "24252637475664656667",
    v: "24253647566465",
    w: "24252637454657646566",
    x: "232734364554566367",
    y: "2425263739474957596465666768",
    z: "232627333537434547535557636467",
    A: "222324252627313441445154626364656667",
    B: "2122232425262731343741444751545762636566",
    C: "22232425263137414751576167",
    D: "212223242526273137414751576263646566",
    E: "212223242526273134374144475154576167",
    F: "2122232425262731344144515461",
    G: "222324252631374147515557616566",
    H: "2122232425262734445461626364656667",
    I: "212731374142434445464751576167",
    J: "21263137414751525354555661",
    K: "212223242526273444535561626667",
    L: "2122232425262737475767",
    M: "12131415161721314142434445465161727374757677",
    N: "2122232425262731415161626364656667",
    O: "22232425263137414751576263646566",
    P: "2223242526273134414451546263",
    Q: "2223242526313741475157626364656677",
    R: "2223242526273134414451546263656667",
    S: "222326313437414447515457626566",
    T: "2131414243444546475161",
    U: "212223242526374757616263646566",
    V: "21222324353647555661626364",
    W: "11121314151627374243444546475767717273747576",
    X: "21222627333544535561626667",
    Y: "21223344454647536162",
    Z: "212627313537414447515357616267"
    
    
    
}
function drawChar(char, xpos, ypos, width, height, s) {
    for(var i = 0; i < chars[char].length / 2; i++) {
        ctx.fillRect(xpos + Math.floor(width / 7 * (parseFloat(chars[char].charAt(2 * i)) - 1 - s)), ypos + Math.floor(height / 7 * (parseFloat(chars[char].charAt(2 * i + 1)) - 1)), width / 7 + 1, height / 7 + 1);
    }
}
function write(text, xpos, ypos, fontSize, maxWidth) {
    //get width in pixels of all chars in this string
    var charW = [];
    for(var i = 0; i < text.length; i++) {
        var minval = Infinity;
        var maxval = -1 * Infinity;
        var curr = chars[text.charAt(i)];
        for(var j = 0; j < curr.length; j += 2) {
            if(parseFloat(curr.charAt(j)) > maxval) {
                maxval = parseFloat(curr.charAt(j));
            }
            if(parseFloat(curr.charAt(j)) < minval) {
                minval = parseFloat(curr.charAt(j));
            }
        }
        if(text.charAt(i) != " ") {
            charW.push([minval - 1, maxval - minval + 1]);
        } else {
            charW.push([0, 3]);
        }
    }
    //sum all char width to check total width
    var numBoxes = -1;
    for(var i = 0; i < charW.length; i++) {
        numBoxes += charW[i][1] + 1;
    }
    var charWidth = fontSize;
    if(numBoxes * fontSize / 7 > maxWidth) {
        charWidth = maxWidth / numBoxes * 7;
    }
    //draw characters
    var currX = xpos;
    var currY = ypos;
    if(horizTextAlign == "right") {
        currX -= numBoxes * charWidth / 7;
    }
    if(horizTextAlign == "center") {
        currX -= numBoxes * charWidth / 14;
    }
    if(vertTextAlign == "bottom") {
        currY -= fontSize;
    }
    if(vertTextAlign == "center") {
        currY -= fontSize / 2;
    }
    for(var i = 0; i < text.length; i++) {
        drawChar(text.charAt(i), currX, currY, charWidth, fontSize, charW[i][0]);
        currX += (charW[i][1] + 1) * charWidth / 7;
    }
}
//graphics for the image/sound loader-----------------------------------------------------------------------------------
var sound_backgroundcolor = "rgb(54, 128, 73)";
var load_backgroundcolor = "rgb(45, 145, 71)";
var load_textcolor = "rgb(0,0,0)";
function imgloadscreen(complete, total, mode) {
    if(mode == 0) {
        vertTextAlign = "center";
        horizTextAlign = "center";
        ctx.fillStyle = sound_backgroundcolor;
        ctx.fillRect(0,0,cw,ch);
        ctx.fillStyle = load_backgroundcolor;
        ctx.fillRect(0,0,cw,complete / total * ch);
        ctx.fillStyle = load_textcolor;
        write("Loading images, " + Math.ceil(complete / total * 100) + "% complete", cw / 2, ch/2, 28);
    } else {
        vertTextAlign = "center";
        horizTextAlign = "center";
        ctx.fillStyle = sound_backgroundcolor;
        ctx.clearRect(0,0,cw,ch);
        ctx.fillRect(0,0,cw,complete / total * ch);
        ctx.fillStyle = load_textcolor;
        write("Loading sounds, " + Math.ceil(complete / total * 100) + "% complete", cw / 2, ch/2, 28);
    }
}
//graphics for solid color transitions and fade transitions--------------------------------------------------------------
//(only supports rgb and hexidecimal color)
function slideTransition(color, direction, duration) {
    //bottom to top slide
    if(direction == "up") {
        var interval;
    }
}
function getRGB(inp) {
    var input = "";
    for(var i = 0; i < inp.length; i++) {
        if(inp.charAt(i) != " ") {
            input = input + inp.charAt(i);
        }
    }
    input = input.toLowerCase();
    var hexConverter = {0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9, a: 10, b: 11, c: 12, d: 13, e: 14, f: 15}
    if(input.includes("(") == false || input.includes(")") == false) {
        //must be in hex :(
        output = [hexConverter[input.charAt(1)] * 16 + hexConverter[input.charAt(2)],
                  hexConverter[input.charAt(3)] * 16 + hexConverter[input.charAt(4)],
                  hexConverter[input.charAt(5)] * 16 + hexConverter[input.charAt(6)],
                 ];
        return output;
    }
    var startp = false;
    var curr = "";
    var output = [];
    for(var i = 0; i < input.length; i++) {
        if(startp == false) {
            if(input.charAt(i) == "(") {
                startp = true;
            }
        } else {
            if(input.charAt(i) == "," || input.charAt(i) == ")") {
                output.push(curr);
                curr = "";
            } else {
                curr = curr + input.charAt(i);
            }
        }
    }
    return output;
}