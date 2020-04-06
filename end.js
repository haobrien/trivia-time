const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener('keyup', () => {
    // endable save button if user has typed username
    saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
    console.log('saved');
    e.preventDefault();

    const score = {
        score: mostRecentScore,
        name: username.value
    }
    highScores.push(score);
    highScores.sort((a, b) => b-a);
    highScores.splice(MAX_HIGH_SCORES);

    localStorage.setItem('highScores', JSON.stringify(highScores));
    window.location.assign('highscores.html');
}