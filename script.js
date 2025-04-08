// script.js

let ballCount = 0;
let currentOverScore = 0;
let currentScore = 0;
let currentOver = 1;
let totalScore = 0;
let wickets = 0;
let overScores = [];
let currentTeam = 1;
let teamScores = [[], []];

function goToSection2() {
    const teamA = document.getElementById("teamA").value.trim();
    const teamB = document.getElementById("teamB").value.trim();
    const playersCount = document.getElementById("playersCount").value;
    const maxOversPerBowler = document.getElementById("maxOversPerBowler").value;
    const totalOvers = document.getElementById("totalOvers").value;

    if (!teamA || !teamB || !playersCount || !maxOversPerBowler || !totalOvers) {
        alert("Please fill out all fields in Section 1.");
        return;
    }

    document.getElementById("section1").classList.add("hidden");
    document.getElementById("section2").classList.remove("hidden");

    document.getElementById("teamAName1").innerText = teamA;
    document.getElementById("teamBName1").innerText = teamB;

    window.matchData = {
        teamA,
        teamB,
        playersCount: parseInt(playersCount),
        maxOversPerBowler: parseInt(maxOversPerBowler),
        totalOvers: parseInt(totalOvers),
        tossWinner: "",
        tossChoice: "",
        bowler: "",
        batsman1: "",
        batsman2: ""
    };
}

function goToSection3() {
    const tossWinner = document.querySelector('input[name="tossWinner"]:checked');
    const tossChoice = document.querySelector('input[name="tossChoice"]:checked');

    if (!tossWinner || !tossChoice) {
        alert("Please select toss winner and choice.");
        return;
    }

    window.matchData.tossWinner = tossWinner.value;
    window.matchData.tossChoice = tossChoice.value;

    document.getElementById("section2").classList.add("hidden");
    document.getElementById("section3").classList.remove("hidden");
}

function startMatch() {
    const bowler = document.getElementById("bowler").value.trim();
    const batsman1 = document.getElementById("batsman1").value.trim();
    const batsman2 = document.getElementById("batsman2").value.trim();

    if (!bowler || !batsman1 || !batsman2) {
        alert("Please enter names for bowler and both batsmen.");
        return;
    }

    window.matchData.bowler = bowler;
    window.matchData.batsman1 = batsman1;
    window.matchData.batsman2 = batsman2;

    document.getElementById("playerInputs").classList.add("hidden");
    document.getElementById("scoringButtons").classList.remove("hidden");
}

function addBall(type) {
    const maxWickets = window.matchData.playersCount - 1;
    if (wickets < maxWickets && ballCount < 6) {
        const ball = document.createElement("div");
        ball.classList.add("ball");
        ball.innerText = type === "dot" ? "." : type;
        document.getElementById("balls-container").appendChild(ball);
        ballCount++;

        if (type !== "dot") {
            if (type !== "wicket") {
                const runs = parseInt(type);
                currentOverScore += runs;
                currentScore += runs;
            } else {
                wickets++;
                if (wickets === maxWickets) {
                    endOver();
                    return;
                }
            }
        }

        if (ballCount === 6) {
            endOver();
        }

        updateTeamScore();
        displayCurrentScore();
    }
}

function addExtraBall(type) {
    const maxWickets = window.matchData.playersCount - 1;
    if (wickets < maxWickets) {
        const ball = document.createElement("div");
        ball.classList.add("ball");
        if (type === "wide" || type === "no") {
            ball.innerText = type === "wide" ? "WD1" : "NB1";
            currentOverScore += 1;
            currentScore += 1;
        }
        document.getElementById("balls-container").appendChild(ball);
        updateTeamScore();
        displayCurrentScore();
    }
}

function displayCurrentScore() {
    document.getElementById("current-score").innerText = `Current Score: ${currentScore} Runs and ${wickets} wickets`;
}

function updateTeamScore() {
    const team1Score = teamScores[0].reduce((total, score) => total + score, 0);
    const team2Score = teamScores[1].reduce((total, score) => total + score, 0);

    if (currentTeam === 2 && team2Score > team1Score) {
        declareWinner(2, window.matchData.playersCount - 1 - wickets, "wickets");
    }
}

function endOver() {
    overScores.push(currentOverScore);
    teamScores[currentTeam - 1].push(currentOverScore);
    totalScore += currentOverScore;

    const overScoreElement = document.createElement("div");
    overScoreElement.innerText = `Team ${currentTeam}, Over ${currentOver}: ${currentOverScore} runs`;
    document.getElementById("cumulative-score").appendChild(overScoreElement);

    currentOver++;
    ballCount = 0;
    currentOverScore = 0;

    document.getElementById("score-display").innerText = `Team ${currentTeam} Total Score: ${totalScore} runs, Wickets: ${wickets}`;

    if (currentOver > window.matchData.totalOvers || wickets === (window.matchData.playersCount - 1)) {
        endInnings();
    } else {
        alert("Over Ended!");
        disableButtons();
        showNewOverButton();
    }

    displayCurrentScore();
}

function endInnings() {
    if (currentTeam === 1) {
        currentTeam = 2;
        resetForNextTeam();
    } else {
        declareWinner();
    }
}

function resetForNextTeam() {
    overScores = [];
    totalScore = 0;
    wickets = 0;
    currentOver = 1;
    ballCount = 0;
    currentOverScore = 0;
    currentScore = 0;

    document.getElementById("balls-container").innerHTML = "";
    document.getElementById("cumulative-score").innerHTML = "";
    document.getElementById("score-display").innerText = `Team ${currentTeam} starts their innings`;

    const buttons = document.querySelectorAll(".buttons-container button");
    buttons.forEach((button) => {
        button.disabled = false;
    });
}

function declareWinner(winningTeam, margin, unit) {
    const scoreDisplay = document.getElementById("score-display");
    let winnerText;
    if (winningTeam === 1) {
        winnerText = `Team 1 wins by ${margin} ${unit}!`;
    } else {
        winnerText = `Team 2 wins by ${margin} ${unit}!`;
    }
    scoreDisplay.innerText = `Match complete! ${winnerText}`;
    disableButtons();

    setTimeout(() => {
        localStorage.clear();
    }, 5000);
}

function disableButtons() {
    const buttons = document.querySelectorAll(".buttons-container button");
    buttons.forEach((button) => {
        button.disabled = true;
    });
}

function showNewOverButton() {
    const newOverButton = document.createElement("button");
    newOverButton.innerText = "Start New Over";
    newOverButton.id = "newOverButton";
    newOverButton.onclick = resetOver;
    document.querySelector(".buttons-container").appendChild(newOverButton);
}

function resetOver() {
    document.getElementById("balls-container").innerHTML = "";
    const buttons = document.querySelectorAll(".buttons-container button");
    buttons.forEach((button) => {
        button.disabled = false;
    });
    const newOverBtn = document.getElementById("newOverButton");
    if (newOverBtn) newOverBtn.remove();
    document.getElementById("score-display").innerText = "";
}

document.addEventListener("DOMContentLoaded", () => {
    ["1", "2", "3", "4", "5", "6", "dot", "wicket"].forEach((val) => {
        const btn = document.getElementById(`button-${val}`);
        if (btn) btn.onclick = () => addBall(val);
    });

    ["wide", "no"].forEach((val) => {
        const btn = document.getElementById(`button-${val}`);
        if (btn) btn.onclick = () => addExtraBall(val);
    });
});
