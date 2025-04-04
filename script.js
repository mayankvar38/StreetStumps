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
        tossChoice: ""
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

function recordBall(value) {
    const output = document.getElementById("scoreOutput");
    output.innerHTML += `<span>${value}</span> `;
}
