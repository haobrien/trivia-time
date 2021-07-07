console.log('game.js loaded');

// doc elements
const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');

// game variables
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

// decode text from API
function decodeHtml(html) {
    let txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// fetch questions
let questions = [];
// fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple")
fetch("https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple")
    .then(res => {
        return res.json();
    }).then(loadedQuestions => {
        // load questions
        console.log(loadedQuestions);
        questions = loadedQuestions.results.map(question => {
            const formattedQuestion = {
                question: question.question,
            }
            const answerChoices = [...question.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 4);
            answerChoices.splice(formattedQuestion.answer - 1, 0, question.correct_answer);

            answerChoices.forEach((choice, index) => {
                formattedQuestion['choice' + (index + 1)] = choice;
            })
            return formattedQuestion;
        })

        // start game
        startGame();
    }).catch(err => {
        console.error(err);
    });

// CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

getNewQuestion = () => {
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.assign('end.html');
    }

    // increment question # and update HUD
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    // update progress bar
    const barWidth = (questionCounter / MAX_QUESTIONS) * 100;
    progressBarFull.style.width = barWidth + '%';

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = decodeHtml(currentQuestion.question);

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = decodeHtml(currentQuestion['choice' + number]);
    });

    availableQuestions.splice(questionIndex, 1);

    acceptingAnswers = true;
}

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();

    // hide loader / show game
    game.classList.remove("hidden");
    loader.classList.add("hidden");
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        console.log(e.target);
        if (!acceptingAnswers) return;
        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        // determine right or wrong answer
        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);

        // add to score if correct
        if (classToApply === 'correct') {
            incrementScore(CORRECT_BONUS);
        }
    })
})

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
}