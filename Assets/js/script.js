// when quiz starts, create containers questions and answers;
let highScoresOpen = false;
let userScore = 0;
let questions = {
    q1: {
        question: 'Forgetting a bracket in your code will lead to a ____ error',
        possibleAnswers: ['Syntax', 'Run-Time', 'Logic', 'Compilation'],
        answer: 'Compilation',
    },

    q2: {
        question: 'Which of the following is NOT a higher order array method?',
        possibleAnswers: ['forEach', 'filter', 'map', 'splice'],
        answer: 'splice',
    },

    q3: {
        question: 'Which of the following is a must for a good Git repository?',
        possibleAnswers: ['ReadME.md', 'Multiple Github Branches', 'Multiple Owners', 'empyy'],
        answer: 'ReadME.md',
    },

    q4: {
        question: 'Express is considered a _____ framework',
        possibleAnswers: ['HTML', 'CSS', 'JavaScript', 'MongoDB'],
        answer: 'JavaScript',
    },

    q5: {
        question: 'After creating a new blank github repository, what is the command to that gives your local machine access to your repo?',
        possibleAnswers: ['git remote','git push', 'git pull', 'git clone', ],
        answer: 'git remote',
    },
}
let timeLeft = document.getElementById('timeLeft');
let startBtn = document.getElementById('start-btn');
let timer = 90;
let slideValue = 0;
// slides game board to the right for next question
const calculateScore = () => {
    let additionalPoints = 0;

    if (timer > 0) {
        additionalPoints =  timer * 50

    } else {
        additionalPoints = 0;
    }
    userScore += additionalPoints;
    return userScore;
}
const displayScore = () => {
    document.getElementById('game-content').style.display = 'none';

    let highScoreContainer = document.getElementById('highscore-container');
    let showUserScore = document.getElementById('user-score');

    showUserScore.textContent = calculateScore();
    highScoreContainer.style.display = 'block';

}
const slideGameBoardLeft = () => {
    slideValue -= 100;
    let gameContainer = document.querySelectorAll('.question');
    gameContainer.forEach(quest => quest.style.cssText= `transform: translateX(${slideValue}%); transition: 1s ease-in-out;`);
}
const submitAnswer = (event) => {
    let parentEl = event.target.parentElement;
    let submissionValue = event.target.value;

    let questionAnswer = parentEl.dataset.answer
    let userAnswer = event.target;

    let commonStyling = 'opacity: 0.8; font-weight: 700'
    if (submissionValue === questionAnswer) {
        userAnswer.style.cssText = `background-color: lime; ${commonStyling} border: lime;`
      
        userScore += 100;
    } else {
        userAnswer.style.cssText = `background-color: red; ${commonStyling} border: red;`;
        if (timer - 10 <= 0) {
            timer = 0;
        } else {
            timer -= 10;
        }
        timeLeft.style.color = 'red';

        setTimeout(() => {
            timeLeft.style.color = 'white';
        }, 2000)
    }

    setTimeout(() => {
        userAnswer.style.cssText = `background-color: ##7900FF; ${commonStyling} border: inherit;`;

    }, 2000)

    slideGameBoardLeft();
}


const createQuestions = () => {
    let game = document.getElementById('game-content')
   
    Object.entries(questions).forEach(item => {
        // create container for question
        const questionContainer = document.createElement('article');
        questionContainer.setAttribute('class', 'question');
        
        // create header and ol containers for question title and possible answers
        let questionTitle = document.createElement('h2');
        let possibleAnswersContainer = document.createElement('ol');

        // store answer as attribute in ol holding possible answers for question
        possibleAnswersContainer.setAttribute('data-answer', item[1].answer);

        // set h2 content for question => question number and question
        questionTitle.textContent = `${item[0].toUpperCase()}. ${item[1].question}`;

        // get potential answers for question and create button for each possible answer
        let answers = item[1].possibleAnswers;

        // loop through possible answers
        answers.forEach((questionAnswers,index) => {
            // creating button
            let newListItem = document.createElement('button');
            // set class and value attributes for button
            newListItem.setAttribute('class', 'answer-choice')
            newListItem.setAttribute('value', `${questionAnswers}`)

            // create question answer text for button
            newListItem.textContent = `${index + 1}. ${questionAnswers}`;

            // append to ol
            possibleAnswersContainer.appendChild(newListItem);

            // create click events for answers => could be refactored using delegation
            newListItem.addEventListener('click',submitAnswer)

        })

        // append question and possible answers to question container
        questionContainer.appendChild(questionTitle);
        questionContainer.appendChild(possibleAnswersContainer);

        // append questioncontainer to DOM
        game.appendChild(questionContainer);

    })

}

const resetGame = () => {
    timer = 90;
    slideValue = 0;
    highScoresOpen = false;

    let gameContainer = document.querySelectorAll('.question');
    gameContainer.forEach(quest => quest.style.cssText= `transform: translateX(${slideValue}); transition: 1s ease-in-out;`);
    document.getElementById('game-content').style.display = 'flex';
}
const hideBgContent = () => {
    let homeContent = document.getElementById('quiz-home');

    homeContent.style.display = 'none';
}
const startQuiz = () => {
    resetGame();
    hideBgContent();
    createQuestions();

    let quizStarted = setInterval(() => {
        // console.log('started interval')
        if (slideValue === (-100 * Object.keys(questions).length) || timer < 0) {
            displayScore();
            clearInterval(quizStarted);
        } else  if (timer >= 0) {

            timeLeft.textContent = timer;            
            timer--;

        } else {
            console.log('hitting else statement');
            displayScore();
            clearInterval(quizStarted);
        }
    }, 1000)
}


startBtn.addEventListener('click', startQuiz)


const saveScoreToLocalStorage = () => {
    let gamerId = document.querySelector('#gamer-tag').value;
    let userNameAndScore = {
        userName: gamerId,
        score: userScore,
    }    
    if (localStorage.getItem('past-players')) {
        let pastPlayers = localStorage.getItem('past-players');
        let pastPlayersJSON = JSON.parse(pastPlayers);
        pastPlayersJSON.push(userNameAndScore);
        localStorage.setItem('past-players', JSON.stringify(pastPlayersJSON))
        console.log(localStorage.getItem('past-players'))
    } 


}
const displayLeaderBoards = () => {
    let allPlayers = localStorage.getItem('past-players');
    let allPlayersList = JSON.parse(allPlayers);
    let sortedPlayerList = allPlayersList.sort((a,b) => {
        if (a.score > b.score) {
            return -1;
        }
    })

    let allScores = document.getElementById('all-scores');

    sortedPlayerList.forEach((item,index)  => {
        let newListItem = document.createElement('li');

        if (index < 3) {
            newListItem.setAttribute('class', 'medalWinner')
        }
        newListItem.textContent = `${index + 1}. ${item.userName}: ${item.score}`;
        allScores.append(newListItem);
    })

    allScores.style.display = 'flex';

    let scoreForm = document.getElementById('scoreSubmission');
    scoreForm.style.display = 'none';

    highScoresOpen = true;

}
const submitScore = (event) => {

    event.preventDefault();

    let gamerId = document.querySelector('#gamer-tag').value;

    console.log('error')

    if (gamerId === "") {
        document.querySelector('#gamer-tag').style.border = 'solid red 3px'
    } else {
        saveScoreToLocalStorage();
            // retrieve local storage
        displayLeaderBoards();
    }

   
}



let scoreSubmission = document.getElementById('submit-score');
scoreSubmission.addEventListener('click', submitScore)

    let viewScores = document.getElementById('viewHighscores');

const viewHighScores = () => {
    let quizHome = document.getElementById('quiz-home');
    let scoresContainer = document.getElementById('highscore-container');

    if (!highScoresOpen) {
        scoresContainer.style.display = 'block';
        quizHome.style.display = 'none';
        displayLeaderBoards();
    } else {
        quizHome.style.display = 'flex';
        scoresContainer.style.display = 'none';

    }

    highScoresOpen = !highScoresOpen   
}

viewScores.addEventListener('click', viewHighScores)

const navigateHome = () => {
    let scoresContainer = document.getElementById('highscore-container');
    let allScores = document.getElementById('all-scores');

    allScores.style.display = 'none';
    scoresContainer.style.display = 'none';

    let quizHome = document.getElementById('quiz-home');
    quizHome.style.display = 'flex';


}

let goBack = document.getElementById('go-back')

goBack.addEventListener('click', navigateHome)

