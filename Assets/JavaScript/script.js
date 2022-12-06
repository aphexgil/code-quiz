//grabbing elements from html file
var startButton = document.querySelector("#start-game");
var highScoresButton = document.querySelector("#high-scores");
var answerButtons = document.querySelectorAll(".answer-button");
var submitButton = document.querySelector("#submit-score");
var playAgainButton = document.querySelector("#play-again");
var mainEl = document.querySelector("main");
var timerEl = document.querySelector("#timer");
var scoreEl = document.querySelector(".score-box");
var winLossMessage = document.querySelector("#win-loss-message");
var nameInput = document.querySelector("#name-input");
var playerName = document.querySelector("#player-name");
var leaderBoardEl = document.querySelector("#leaderboard");

//setting global variables and constants
var playerScore;
var timeLeft = 60;
var pageIndex = 0;
var currentPage = document.querySelector("#greeting");
var mainChildrenCount = mainEl.children.length;
var numQuestions = mainChildrenCount - 4;
var timerInterval;
var leaderBoard;
var indexArray; 

//pops a random remining index from indexArray and returns it to nextPage
//used to randomly go to a question that the user hasn't seen so far this game
function getRandIndex(){
    var rand = Math.floor(Math.random()*indexArray.length);
    var index = indexArray.splice(rand, 1);
    index ++;
    return index;
}

//prints the word correct in green into the win-loss-message box
//when the player picks the right answer for a half second.
function correctMessage(){
    winLossMessage.setAttribute("style", "color: green;");
    winLossMessage.textContent = "correct";
    var msgInterval = setInterval(function(){
        winLossMessage.textContent = "";
        clearInterval(msgInterval);
    }, 500);
}

//prints the word incorrent in red into the win-loss-message box
//when the player picks the wrong for a half second.
function incorrectMessage(){
    winLossMessage.setAttribute("style", "color: red;");
    winLossMessage.textContent = "incorrect";
    var msgInterval = setInterval(function(){
        winLossMessage.textContent = "";
        clearInterval(msgInterval);
    }, 500);
}

//displays the player's score in the score box every time nextPage() is called
function displayScore(){

    //conditionals move where score is being displayed from top of the page to the
    //box just above form input, or vice versa.
    if(pageIndex === (mainChildrenCount-2)){
        scoreEl = document.querySelector(".score-box");
    }else if( indexArray.length === 0 || timeLeft === 0){
        scoreEl.textContent = "";
        scoreEl = document.querySelectorAll(".score-box")[1];
    }
    scoreEl.textContent = "score: " + playerScore;
    
}

//starts the game when the player clicks 'start game' or 'play again?'
function startGame() {

    //resets indexArray, moves to first randomly chosen question
    indexArray = Array.from(Array(numQuestions).keys());
    nextPage();

    //resets score to zero, displays in header.
    playerScore = 0;
    displayScore();

    //resets timer to 60, starts countdown.
    timerEl.textContent = "time left: " + 60;
    startTimer();

}

//skips to high score leadeboard, called when 'high scores' button is clicked
function skipToScores() {
    //if you're already on high scores page, button does nothing
    if(pageIndex===mainChildrenCount-2){
        return;
    }
    //wipes score box, stops countdown, displays leader board
    scoreEl.textContent = "";
    clearInterval(timerInterval);
    displayLeaderBoard();
}

//start 60 second countdown
function startTimer(){
    timeLeft = 60;
    timerInterval = setInterval(function() {
        timeLeft--;
        timerEl.textContent = "time left: " + timeLeft;
        if(timeLeft === 0){
            clearInterval(timerInterval);
            displayScore();
            submitScorePage();
        }
    }, 1000);
}

//shuffles order of answer button <li> elements every time question page is displayed
function shuffleAnswers() {
    var ul = document.querySelectorAll("ul")[pageIndex-1];
    console.log(ul);
    var offset = (pageIndex-1)*4;
    var a1 = document.querySelectorAll("li")[offset];
    var a2 = document.querySelectorAll("li")[offset+1];
    var a3 = document.querySelectorAll("li")[offset+2];
    var a4 = document.querySelectorAll("li")[offset+3];
    var answers = [a1,a2,a3,a4];
    ul.innerHTML = '';
    for(i=0;i<4;i++){
        var rand = Math.floor(Math.random()*answers.length);
        var answer = answers.splice(rand, 1);
        ul.appendChild(answer[0]);
    }
}

//takes player from one page to another, using getRandIndex() to randomly
//show players questions until no new ones remain at which point it takes them to
//name entry form
function nextPage(){

    //if there are no indexes left in the indexArray, we are out of questions
    //stop timer and take player to name entry form
    if(indexArray.length === 0){
        clearInterval(timerInterval);
        pageIndex = mainChildrenCount - 3;

    //otherwise go to a random new question and shuffle the answers
    }else{
        pageIndex = getRandIndex();
        shuffleAnswers();
    }

    //hide old page
    currentPage.setAttribute("style", "display: none;");
    currentPage = mainEl.children[pageIndex];
    //show new plage
    currentPage.setAttribute("style", "display: block;");
}

//go to submit score page––triggered if timer runs out
function submitScorePage(){

    currentPage.setAttribute("style", "display: none;");
    pageIndex = mainChildrenCount - 3;
    currentPage = mainEl.children[pageIndex];
    currentPage.setAttribute("style", "display: block;");

}

//go to high scores leader board. called by high scores button.
function leaderBoardPage(){

    currentPage.setAttribute("style", "display: none;");
    pageIndex = mainChildrenCount - 2;
    currentPage = mainEl.children[pageIndex];
    currentPage.setAttribute("style", "display: block;");
}

//handle form submission and add player/name pair to the leaderboard.
function submitHighScore(){

    //prevent form submission from refreshing page
    event.preventDefault();
    if(playerName.value==""){
        playerName.setAttribute("value", "null");
    }
    //create new high score element with name and highscore
    var highScore = {
        name: playerName.value,
        score: playerScore
    }
    //read leaderboard from local storage
    leaderBoard = JSON.parse(localStorage.getItem("leaderBoard"));
    //if it's not there, start it with current name/highscore
    if (leaderBoard == null){
        leaderBoard = [highScore];
    //else, leaderboard was loaded. add high score into the leaderboard
    }else{
        var beatSomeone  = false;
        for(var i=0;i<leaderBoard.length;i++){
            if(highScore.score > leaderBoard[i].score){
                leaderBoard.splice(i,0,highScore);
                beatSomeone = true;
                break;
            }
        }
        if(!beatSomeone){
            leaderBoard.push(highScore);
        }
    }
    //save updated leaderboard to local storage
    localStorage.setItem("leaderBoard", JSON.stringify(leaderBoard));
    //display the leadebaord
    displayLeaderBoard();
}

function displayLeaderBoard(){

    //load leaderboard from local storage
    leaderBoard = JSON.parse(localStorage.getItem("leaderBoard"));

    //if load fails, display name 'null', score 0.
    if (leaderBoard == null){
        var highScore = {
            name: "null",
            score: 0
        }
        leaderBoard = [highScore];
    }

    //header line in table
    leaderBoardEl.innerHTML = '<tr><th>name</th><th>score</th></td>';

    //constructs table rows from leaderBoard highScore elements
    for(var i=0; i<leaderBoard.length; i++){

        var newRow = document.createElement("tr");

        var nameRow = document.createElement("td");
        nameRow.textContent = leaderBoard[i].name;
        nameRow.setAttribute("class", "leaderboard-name");
        var scoreRow = document.createElement("td");
        scoreRow.setAttribute("class", "leaderboard-score");
        scoreRow.textContent = leaderBoard[i].score;
        
        newRow.appendChild(nameRow);
        newRow.appendChild(scoreRow);

        leaderBoardEl.appendChild(newRow);
    }

    leaderBoardPage();
}

//high scores button skips straight to the leader board
highScoresButton.addEventListener("click", skipToScores);
//start button loads startGame() method
startButton.addEventListener("click", startGame);

//event listeners for answer buttons. displays response, tallies score, changes page.
for(var i=0; i<answerButtons.length; i++){
    answerButtons[i].addEventListener("click",function(){
        var btnClass = event.target.getAttribute("class");
        if(btnClass=="answer-button correct"){
            correctMessage();
            playerScore++;
        }else{
            incorrectMessage();
        }
        displayScore();
        nextPage();
    });
}

//form submit and clicking 'submit score' button both trigger same function
nameInput.addEventListener("submit", submitHighScore);
submitButton.addEventListener("click", submitHighScore);

//play again loads startGame() method
playAgainButton.addEventListener("click", startGame);