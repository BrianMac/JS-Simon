//JS Simon game

//Current Score
var currentScore = 0;

//High Score
var highScore;

//delay between rounds in seconds
var roundDelay = 2.5;

//delay between tones in sequence
var sequenceDelay = 0.5;

//length of tone in sequence
var toneLength = 0.5;

//amount of time allowed for player input
var guessTime = 3;

//----------------------------------------------------

const sequence = [];
const highScoreList = [];
var introHasPlayed = false;
var message = "";
var timerId = null;
var gameInProgress = true;
var playersTurn = false;
var buttonStatus = true;
var sequenceCounter = -1;
var guessTimer;

//Local Storage Stuff
//window.localStorage.removeItem('highscore');

if (window.localStorage.getItem('highscore') != null)
{
    highScore = window.localStorage.getItem('highscore');
} else {
    window.localStorage.setItem('highscore', 0);
    highScore = window.localStorage.getItem('highscore');
}

document.getElementById("HighScoreLabel").innerHTML = "High Score: " + highScore;

lockButtons();

x = {
    aInternal: 0,
    aListener: function(val) {},
    set a(val) {
      this.aInternal = val;
      this.aListener(val);
    },
    get a() {
      return this.aInternal;
    },
    registerListener: function(listener) {
      this.aListener = listener;
    }
  }
  
  x.registerListener(function(val) {
    if (x.a == "wrong") {
        lockButtons();
        playTone(4);
        document.getElementById("StartButton").innerHTML = "Restart Game";
        document.getElementById("StartButton").disabled = false;
        document.getElementById("PlayerTurnLabel").innerHTML = "Sorry, you made a mistake!";
        document.getElementById("PlayerTurnLabel").style.color = "red";
        if (currentScore == highScore && currentScore > 0){
            NewHighScore();
        }
      }
      else if (x.a == "overtime") {
        lockButtons();
        playTone(4);
        document.getElementById("StartButton").innerHTML = "Restart Game";
        document.getElementById("StartButton").disabled = false;
        document.getElementById("PlayerTurnLabel").innerHTML = "Sorry, you took too long";
        document.getElementById("PlayerTurnLabel").style.color = "red";
        if (currentScore == highScore && currentScore > 0){
            NewHighScore();
        }
      }
      else {
        CheckSequence();
      }
  });

document.getElementById("UL").addEventListener("click", function () {
    if (buttonStatus) {
        if (gameInProgress) {
            //console.log("UL Clicked!");
            playerInput = 0;
            playTone(playerInput);
            x.a++;
        }
    };
});

document.getElementById("UR").addEventListener("click", function () {
    if (buttonStatus) {
        if (gameInProgress) {
            //console.log("UR Clicked!");
            playerInput = 1;
            playTone(playerInput);
            x.a++;
        }
    };
});

document.getElementById("LL").addEventListener("click", function () {
    if (buttonStatus) {
        if (gameInProgress) {
            //console.log("LL Clicked!");
            playerInput = 2;
            playTone(playerInput);
            x.a++;
        }
    };
});

document.getElementById("LR").addEventListener("click", function () {
    if (buttonStatus) {
        if (gameInProgress) {
            //console.log("LR Clicked!");
            playerInput = 3;
            playTone(playerInput);
            x.a++;
        }
    };
});

document.getElementById("StartButton").addEventListener("click", function () {
    document.getElementById("StartButton").disabled = true;
    StartGame();
});

function StartGame() {
    // Clear sequence array
    document.getElementById("newHighScore").style.visibility = "hidden";
    UpdateScore();
    sequence.splice(0, sequence.length);
    document.getElementById("PlayerTurnLabel").innerHTML = "SIMON'S Turn";
    document.getElementById("PlayerTurnLabel").style.color = "red";

    // Play intro music only per page load
    var delayStart = 1500;
    // disable buttons until player's turn
    lockButtons();
    gameInProgress = true;
    if (!introHasPlayed) {
        const intro = new Audio('audio/intro.mp3');
        intro.play();
        intro.loop = false;
        intro.playbackRate = 1;
        introHasPlayed = true;
        delayStart = 6000;
    }

    setTimeout(function () {
        ComputerTurn();
    }, delayStart);
}

function NewHighScore() {
    document.getElementById("newHighScore").style.visibility = "initial";
}

function lockButtons() {
    buttonStatus = false;
}

function unlockButtons() {
    buttonStatus = true;
}

function CheckNextTurn() {
    if (playersTurn) {
        PlayerTurn();
    }
    else {
        ComputerTurn();
    }
}

function ComputerTurn() {
    lockButtons();
    currentScore = sequence.length;
    UpdateScore();
    document.getElementById("PlayerTurnLabel").innerHTML = "SIMON'S Turn";
    document.getElementById("PlayerTurnLabel").style.color = "red";
    //console.log("Simon's Turn");
    sequenceCounter = -1;
    var rndNum = Math.random();
    rndNum = rndNum * 4;
    rndNum = Math.floor(rndNum);
    addToArray(rndNum);
    playersTurn = true;
    setTimeout(function () {
        PlaySequence();
      }, 1000);
}

function PlayerTurn() {
    // Begin player's turn to enter sequence
    //console.log("Player's Turn");
    document.getElementById("PlayerTurnLabel").innerHTML = "Player's Turn";
    document.getElementById("PlayerTurnLabel").style.color = "green";
    unlockButtons();
    StartGuessTimer();
}

function StartGuessTimer() {
    guessTimer = setTimeout(function () {
        lockButtons();
        x.a = "overtime";
      }, guessTime * 1000);
}

function CheckSequence() {
    sequenceCounter++;
    clearTimeout(guessTimer);
    if (playerInput == sequence[sequenceCounter]) {
        //console.log("Correct! sequence:" + sequence[sequenceCounter] + "   counter:" + sequenceCounter);
        clearTimeout(guessTimer);
        if (sequence.length == (sequenceCounter + 1)) {
        playersTurn = false;
        CheckNextTurn();
        }
        else {
        CheckNextTurn();
        }
    }    
    else {
        //console.log("Wrong! sequence:" + sequence[sequenceCounter] + "   counter:" + sequenceCounter);
        x.a = "wrong";
    }
}

function addToArray(num) {
    sequence.push(num);
    //console.log(sequence);
}

function UpdateScore() {
    document.getElementById("PlayerScoreLabel").innerHTML = "Player Score: " + currentScore;
    if (currentScore > highScore){
        highScore = currentScore;
        document.getElementById("HighScoreLabel").innerHTML = "High Score: " + highScore;
        window.localStorage.setItem('highscore', highScore);
    }
}

function PlaySequence() {
    clearTimeout(guessTimer);
        sequence.forEach(function (sequenceIndex, index) {
            setTimeout(function () {
                playTone(sequenceIndex);
            }, index * (sequenceDelay * 1000));
        });
        setTimeout(function () {
            CheckNextTurn();
        }, sequence.length * (sequenceDelay * 1000));
}

function playTone(num) {
    tone = new Audio('audio/tone0.mp3');
    switch (num) {
        case 0:
            tone = new Audio('audio/tone0.mp3');
            break;
        case 1:
            tone = new Audio('audio/tone1.mp3');
            break;
        case 2:
            tone = new Audio('audio/tone2.mp3');
            break;
        case 3:
            tone = new Audio('audio/tone3.mp3');
            break;
        case 4:
            tone = new Audio('audio/gameover.mp3');
            break;
    }
    buttonLightUp(num);
    tone.play();
    tone.loop = false;
    tone.playbackRate = 1;
}

function buttonLightUp(num) {

    switch (num) {
      case 0:
        document.getElementById("UL").style.backgroundImage = "url('img/UL1.png')";
        break;
      case 1:
        document.getElementById("UR").style.backgroundImage = "url('img/UR1.png')";
        break;
      case 2:
        document.getElementById("LL").style.backgroundImage = "url('img/LL1.png')";
        break;
      case 3:
        document.getElementById("LR").style.backgroundImage = "url('img/LR1.png')";
        break;
    }
  
    setTimeout(function () {
      switch (num) {
        case 0:
          document.getElementById("UL").style.backgroundImage = "url('img/UL2.png')";
          break;
        case 1:
          document.getElementById("UR").style.backgroundImage = "url('img/UR2.png')";
          break;
        case 2:
          document.getElementById("LL").style.backgroundImage = "url('img/LL2.png')";
          break;
        case 3:
          document.getElementById("LR").style.backgroundImage = "url('img/LR2.png')";
          break;
      }
    }, (sequenceDelay * 900));
  
  }