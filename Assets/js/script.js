// when quiz starts, create containers questions and answers;

let questions = {
    q1: {
        question: 'Forgetting a bracket in your code will lead to a ____ error',
        possibleAnswers: ['Syntax', 'Run-Time', 'Logic', 'Compilation'],
        correctAnswer: 'Compilation',
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
let slideValue = 0;
let userAnswers = [];

const submitAnswer = (event) => {
    let submissionValue = event.target.value;
    userAnswers.push(submissionValue);

    let gameContainer = document.querySelectorAll('.question');
    slideValue -= 100;
    console.log(slideValue);
    gameContainer.forEach(quest => quest.style.cssText= `transform: translateX(${slideValue}%); transition: 0.5s ease-in-out;`);

}
const createQuestions = () => {
    let game = document.getElementById('game-content')
   
    Object.entries(questions).forEach(item => {
        const questionContainer = document.createElement('article');
        questionContainer.setAttribute('class', 'question');
    
        let questionTitle = document.createElement('h2');
        let possibleAnswersContainer = document.createElement('ol');

        questionTitle.textContent = `${item[0].toUpperCase()}. ${item[1].question}`;
        let answers = item[1].possibleAnswers;

        answers.forEach((questionAnswers,index) => {
            
            let newListItem = document.createElement('button');
            newListItem.setAttribute('class', 'answer-choice')
            newListItem.setAttribute('value', `${questionAnswers}`)

            newListItem.textContent = `${index + 1}. ${questionAnswers}`;
            possibleAnswersContainer.appendChild(newListItem);

            newListItem.addEventListener('click', submitAnswer)

        })
        


        questionContainer.appendChild(questionTitle);
        questionContainer.appendChild(possibleAnswersContainer);
        game.appendChild(questionContainer);

    })

}

let timeLeft = document.getElementById('timeLeft');
let startBtn = document.getElementById('start-btn');

const startQuiz = () => {
    let homeContent = document.getElementById('quiz-home');
    // let timeLeft = document.getElementById('');
    homeContent.style.display = 'none';
    createQuestions();
    let timer = 90;

    let quizStarted = setInterval(() => {
        // console.log('started interval')
        if (timer > 0) {
            // console.log('entered if statement');
            timeLeft.textContent = timer;
            timer--;

        } else {
            clearInterval(quizStarted);
        }
    }, 1000)
}


startBtn.addEventListener('click', startQuiz)







