const bugImages = ["bug1.png", "bug2.png", "bug3.png", "bug4.png"];
let gameDiv = document.getElementById("gameDiv");
// let playerName = document.getElementById("playerName").innerHTML;
let countdownSpan = document.getElementById("countdownSpan");
let scoreSpan = document.getElementById("scoreSpan")
let countdown = 1, score = 0;
let startTime;
const scoresURL = "http://localhost:3000/scores";

function gameOver() {
    // This is the function that gets called when the game is over.
    // Update this to post the new score to the server.
    let playerName = document.getElementById("playerName").value;
    
    const newScore = {
        name: playerName,
        finalscore: score
    }
    const postRequestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newScore),
    }

    fetch(scoresURL, postRequestOptions)
        .then(response => response.json())
        .then(topThreeScores => {
            console.log(topThreeScores);
            const json = JSON.stringify(topThreeScores);
            displayScores(JSON.parse(json));
        })
        .catch(error => {
            console.log("A network error has occurred when attempting to perform the POST request:", error);
        })


    setMessage("You squashed " + score + " bugs!", "blue");
}

function setMessage(str, color){
    let messageEl = document.getElementById("message");
    messageEl.style.color = color;
    messageEl.innerHTML = str;
}

function displayScores(json){
console.log("Number of scores: " + json.length);
    let scoreDiv = document.getElementById("displayscores");
    // Create dynamic table
    let table = document.createElement("table");
    let tr = table.insertRow(-1);
    let th = document.createElement("th"); 
    th.innerHTML = "Top 3 Scores";
    tr.appendChild(th);
    // Add JSON as data to table as rows      
        for (x in json){  
            tr = table.insertRow(-1);
            let tabCell1 = tr.insertCell(-1);
            tabCell1.innerHTML = json[x].name;
            let tabCell2 = tr.insertCell(-1);
            tabCell2.innerHTML = json[x].finalscore;
        }
    scoreDiv.innerHTML = "";
    // const text = document.createTextNode("Top 3 scores: " + json);
    scoreDiv.appendChild(table);
}

// Get top scores when View Top Scores link is clicked
document.getElementById("topscoreslink").onclick = function viewScores(){
    fetch(scoresURL)
        .then(response => response.json())
        .then(scores => {      
            console.log(scores);
            const json = JSON.stringify(scores);
            displayScores(JSON.parse(json));
        })
        .catch(error => {
            console.log("A network error has occurred when attempting to perform the GET request:", error)
        })

}

function playGame() {
    playerName = document.getElementById("playerName").value;
    console.log("playerName: " + playerName);
    if(playerName.length<3) {
        setMessage("You must enter your name before playing.", "red");
        return;
    }    
    document.getElementById("startButton").style.display = "none";

    startTime = Date.now();
    score = 0;
    onTick();
}

function bugholeHTML(left, top, imgUrl) {
    return `
    <div class="bugOuter" style="left: ${left}px; top: ${top}px;">
        <div class="bugHole"></div>
        <div class="bug" style="background-image: url('${imgUrl}')"></div>
    </div>`;
}

for(let row = 0; row < 4; row++) {
    for(let column = 0; column < 4; column++) {
        let bugImg = bugImages[Math.floor(Math.random()*bugImages.length)];
        gameDiv.innerHTML += bugholeHTML(column*100, row*90, bugImg);
    }
}
const bugs = document.getElementsByClassName("bug");

for(let i = 0; i<bugs.length; i++) {
    bugs[i].onclick = splat;
}

function splat(event) {
    let obj = event.currentTarget;
    if(!obj.classList.contains("splat")) {
        obj.classList.add("splat");
        score ++;
        setTimeout(function() {
            obj.classList.remove("splat")
        }, 2000);
    }
}

function animate(obj) {
    obj.style.top = "0px";
    obj.classList.add("popup");
    setTimeout(function() {
        obj.classList.remove("popup");
        obj.style.top = "70px";
        obj.classList.add("hideagain");
        setTimeout(function() {
            obj.classList.remove("hideagain");
        }, 1500);
    }, 2000);
}

function onTick() {
    let elapsed = (Date.now() - startTime)/1000;
    //console.log(elapsed);
    countdown = 20 - Math.floor(elapsed);
    if(countdown >= 0) {
        countdownSpan.innerHTML = countdown;
        scoreSpan.innerHTML = score;

        // start animations
        for(let i = 0; i < bugs.length; i++) {
            if(elapsed < 19.0 && Math.floor(Math.random()*16 < 0.1)) {
                if(!bugs[i].classList.contains("popup") && !bugs[i].classList.contains("hideagain")) {
                    console.log("animating " + i);
                    animate(bugs[i]);    
                }
            }
        }
        setTimeout(onTick, 50);
    } else {
        document.getElementById("startButton").style.display = "inline-block";
        gameOver();
    }
}

document.getElementById("startButton").onclick = playGame;

