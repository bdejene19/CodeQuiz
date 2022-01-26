// when quiz starts, create containers questions and answers;
// global reusable variables
let highScoresOpen = false;
let userScore = 0;
// questions object containing question, possibilities, and correct answer
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

// target timeLeft and start btn html elents
let timeLeft = document.getElementById('timeLeft');
let startBtn = document.getElementById('start-btn');
let timer = 90;
let slideValue = 0;

// calculates score after game finishes => returns user score
const calculateScore = () => {
    // additional points based on time
    let additionalPoints = 0;

    // validating time didnt run out to add additional pinters
    if (timer > 0) {
        additionalPoints =  timer * 50
    } else {
        additionalPoints = 0;
    }

    userScore += additionalPoints;
    return userScore;
}

// updates UI and displays calculated user score to dom 
const displayScore = () => {
    // hides quizz questions
    document.getElementById('game-content').style.display = 'none';

    // target highscores and userscore html elements
    let highScoreContainer = document.getElementById('highscore-container');
    let showUserScore = document.getElementById('user-score');

    // set user score to calculated score and display to the UI
    showUserScore.textContent = calculateScore();
    highScoreContainer.style.display = 'block';

    // also shows form to save score => also enables highscores btn again
    let scoreForm = document.getElementById('scoreSubmission');
    scoreForm.style.display = 'block';

    let highScoresBtn = document.getElementById('viewHighscores');
    highScoresBtn.disabled = false;
    
}

// slides game board to the right for next question
const slideGameBoardLeft = () => {
    // subtracts from global slide value variable => then translates all .question containers to the left 100%;
    slideValue -= 100;
    let gameContainer = document.querySelectorAll('.question');
    gameContainer.forEach(quest => quest.style.cssText= `transform: translateX(${slideValue}%); transition: 1s ease-in-out;`);
}

// takes in click event, validates input
// updates user score and timer
const submitAnswer = (event) => {
    // target parent element of btn clicked and submission value of btn
    let parentEl = event.target.parentElement;
    let submissionValue = event.target.value;

    // retrieve answer from parent element and retrieve user answer
    let questionAnswer = parentEl.dataset.answer
    let userAnswer = event.target;

    // common styling regardless of outcome
    let commonStyling = 'opacity: 0.8; font-weight: 700';

    // validate if user got question got answer right
    // updates UI, user score and/or timer depending on outcome
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

        // update UI of timer but returns back to normal after 2s
        timeLeft.style.color = 'red';
        setTimeout(() => {
            timeLeft.style.color = 'white';
        }, 2000)
    }

    // return btns back to normal color => purpose of changing is to confirm if user got question right or wrong
    setTimeout(() => {
        userAnswer.style.cssText = `background-color: ##7900FF; ${commonStyling} border: inherit;`;
    }, 2000)

    // slide to next question
    slideGameBoardLeft();
}

// create questions from game object, setting attributes of elements that are created through JS
const createQuestions = () => {
    // target parent
    let game = document.getElementById('game-content')
   
    // loop through each item in questions object
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

// resets game values to allow repeated play
const resetGame = () => {
    timer = 90;
    slideValue = 0;
    highScoresOpen = false;

    // move questions back to original position and make it visible again
    let gameContainer = document.querySelectorAll('.question');
    gameContainer.forEach(quest => quest.style.cssText= `transform: translateX(${slideValue}); transition: 1s ease-in-out;`);
    document.getElementById('game-content').style.display = 'flex';
}

// hides home page when quiz starts 
const hideBgContent = () => {
    let homeContent = document.getElementById('quiz-home');
    homeContent.style.display = 'none';
}

// core function => used when user starts game
/**
 * Resets game, hides start game bg and creates list of questions;
 */
const startQuiz = () => {
    let highScoresBtn = document.getElementById('viewHighscores');
    highScoresBtn.disabled = true;
    resetGame();
    hideBgContent();
    createQuestions();

    // begin timer for quiz
    /**
     * edge cases:
     *  a) user finishes game before timer ends or timer runs out
     *  b) if the user is still playing with time remaining
     *  c) any other situation
     * 
     * Displays score if game ends and clears interval
     */
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

// giving start-game btn a click event handled with startQuiz function
startBtn.addEventListener('click', startQuiz)


// saves user gamer tag to local storage
/*
 * creates object called userNameAndScore using gamer tag and generated score
 * then retrieve local storage and parse string => then push new score to list
 * Then set items to override past local storage
 */
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
    } 
}

/**
 * displays leader boards from local storage
 * local storage data is sorted from highest to lowest scores
 */
const displayLeaderBoards = () => {
    let allPlayers = localStorage.getItem('past-players');
    let allPlayersList = JSON.parse(allPlayers);
    let sortedPlayerList = allPlayersList.sort((a,b) => {
        if (a.score > b.score) {
            return -1;
        }
    })

    let allScores = document.getElementById('all-scores');
    // create special styling for medal winners => otherwise just update UI with new score in place
    sortedPlayerList.forEach((item,index)  => {
        let newListItem = document.createElement('li');

        if (index < 3) {
            newListItem.setAttribute('class', 'medalWinner')
        }
        newListItem.textContent = `${index + 1}. ${item.userName}: ${item.score}`;
        allScores.append(newListItem);
    })

    // display scores on screen => previously none;
    allScores.style.display = 'flex';

    // hide form to submit name and score again
    let scoreForm = document.getElementById('scoreSubmission');
    scoreForm.style.display = 'none';

    // let other functions know highscores component is open
    highScoresOpen = true;
}


/**
 * Targets user input for gamer tag => saves to local storage and displays leader board
 * clears text input for next game played
 * @param {click} event 
 */
const submitScore = (event) => {

    event.preventDefault();

    let gamerId = document.querySelector('#gamer-tag');

    // validated gamer id is not empty
    if (gamerId.value.includes('')) {
        gamerId.style.border = 'solid red 3px'
    } else {
        saveScoreToLocalStorage();
            // retrieve local storage
        displayLeaderBoards();
    }

    gamerId.value = "";

   
}


// adding event listener to submist score
let scoreSubmission = document.getElementById('submit-score');
scoreSubmission.addEventListener('click', submitScore)


let viewScores = document.getElementById('viewHighscores');
/**
 * Present leader boards when 'View Highscores' is clicked
 * Hides home page and displays highscore-container
 */
const viewHighScores = () => {
    let quizHome = document.getElementById('quiz-home');
    let scoresContainer = document.getElementById('highscore-container');

    // handles opening and closing depending on if highScoresOpen is true or not;
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

// add event listener to view highscores through btn
viewScores.addEventListener('click', viewHighScores)

/**
 * hides other screens and displays home screen
 */
const navigateHome = () => {
    let scoresContainer = document.getElementById('highscore-container');
    let allScores = document.getElementById('all-scores');

    allScores.style.display = 'none';
    scoresContainer.style.display = 'none';

    let quizHome = document.getElementById('quiz-home');
    quizHome.style.display = 'flex';


}

// apply navigateHome function to goBack event listener
let goBack = document.getElementById('go-back')

goBack.addEventListener('click', navigateHome)

