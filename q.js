const QUIZ_DATA = {
    Programming: [
        { question: "Which language is used for web styling?", options: ["HTML", "CSS", "Java", "Python"], correct: 1 },
        { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], correct: 1 },
        { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Machine Learning", "Home Tool Markup Language", "Hyperlink Text Management Language"], correct: 0 },
        { question: "Which tag is used for line break in HTML?", options: ["<br>", "<b>", "<hr>", "<i>"], correct: 0 },
        { question: "What is a 'data structure' used for?", options: ["A programming language ", " A collection of algorithms", " store and organize data", "A type of computer hardware"], correct: 2 }
    ],
    "G.K": [
        { question: "Which bird is known for its colorful tail feathers?", options: ["Peacock", "Parrot", "Pigeon", "Sparrow"], correct: 0 },
        { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correct: 2 },
        { question: "Who invented the telephone?", options: ["Edison", "Newton", "Bell", "Tesla"], correct: 2 },
        { question: "Which is the largest ocean?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], correct: 3 },
        { question: "Which organ in the human body pumps blood?", options: ["Liver", "Lungs", "Heart", "Kidneys"], correct: 2 },
        { question: "Who is known as the 'Father of Computers' for his early mechanical computer designs?", options: ["Alan Turing", "Charles Babbage", "Steve Jobs", "Tim Berners-Lee"], correct: 1 },
        { question: "What is H2O commonly known as?", options: ["Salt", "Water", "Hydrogen Peroxide", "Oxygen"], correct: 1 },
    ]
};


let currentCategory = "Programming";
let currentLimit = 4;
let quizQuestions = [];
let questionIndex = 0;
let quizScore = 0;
let quizTimer;
let timerSeconds = 30;
let playerName = "";


const DOM = {
    setupContainer: document.querySelector(".quiz-container"),
    quizArea: document.querySelector(".quis-container"), 
    questionText: document.querySelector(".question-text"),
    answerOptionsList: document.querySelector(".answer-options"),
    nextQuestionButton: document.querySelector(".arrow"),
    restartButton: document.querySelector(".restart-button"),
    statusDisplay: document.querySelector(".question-status"),
    timerDisplay: document.querySelector(".quis-timer"),
    playerNameInput: document.getElementById("player-name"),
    categoryOptions: document.querySelectorAll(".category-option"),
    questionCounts: document.querySelectorAll(".question-count"),
    startQuizButton: document.querySelector(".start-quiz-button")
};



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function updateTimerDisplay() {
    DOM.timerDisplay.textContent = `⏱ ${String(timerSeconds).padStart(2, '0')}`;
}

function startTimer() {
    clearInterval(quizTimer);
    timerSeconds = 30;
    updateTimerDisplay();

    quizTimer = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        if (timerSeconds <= 0) {
            clearInterval(quizTimer);
            // Simulate answering when time runs out
            disableOptions();
            showCorrectAnswer();
            setTimeout(handleNextQuestion, 1000);
        }
    }, 1000);
}

function disableOptions() {
    DOM.answerOptionsList.querySelectorAll(".answer-option").forEach(opt => opt.style.pointerEvents = "none");
}

function showCorrectAnswer() {
    const correctIndex = quizQuestions[questionIndex].correct;
    const correctOption = DOM.answerOptionsList.children[correctIndex];
    if (correctOption) {
        correctOption.classList.add("correct");
    }
}



function loadQuestion(index) {
    if (index >= quizQuestions.length) {
        showResult();
        return;
    }
    
    startTimer();

    const q = quizQuestions[index];
    DOM.questionText.textContent = q.question;
    DOM.answerOptionsList.innerHTML = "";

    q.options.forEach((option) => {
        const li = document.createElement("li");
        li.classList.add("answer-option");
        li.textContent = option;
        li.style.pointerEvents = "auto"; 
        DOM.answerOptionsList.appendChild(li);
    });

    DOM.statusDisplay.innerHTML = `${index + 1} of ${quizQuestions.length} questions`;
}


function handleAnswerSelection(event) {
    const selectedOption = event.target;
    if (!selectedOption.classList.contains('answer-option') || selectedOption.style.pointerEvents === 'none') {
        return;
    }

    const currentQuestion = quizQuestions[questionIndex];
    const selectedIndex = Array.from(DOM.answerOptionsList.children).indexOf(selectedOption);
    
   
    disableOptions();
    clearInterval(quizTimer); 

    if (selectedIndex === currentQuestion.correct) {
        selectedOption.classList.add("correct");
        quizScore++;
    } else {
        selectedOption.classList.add("incorrect");
        showCorrectAnswer(); 
    }
}

function handleNextQuestion() {
    questionIndex++;
    if (questionIndex < quizQuestions.length) {
        loadQuestion(questionIndex);
    } else {
        showResult();
    }
}




function showResult() {
    clearInterval(quizTimer); 
    DOM.timerDisplay.textContent = `⏱ 00`;
    
    DOM.questionText.textContent = `Quiz Finished, ${playerName}! You scored ${quizScore} out of ${quizQuestions.length}.`;
    
    
    DOM.answerOptionsList.innerHTML = "";
    
    DOM.nextQuestionButton.style.display = "none";
    DOM.restartButton.style.display = "inline-block";
    DOM.statusDisplay.innerHTML = "Quiz Complete!";
}

function restartQuiz() {
    DOM.setupContainer.classList.add("active"); 
    DOM.quizArea.style.display = "none";
    DOM.playerNameInput.value = ""; 
    
  
    questionIndex = 0;
    quizScore = 0;
    currentLimit = 4;
}



function setupListeners() {
   
    DOM.categoryOptions.forEach(button => {
        button.addEventListener("click", () => {
            DOM.categoryOptions.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentCategory = button.textContent.trim();
        });
    });

    
    DOM.questionCounts.forEach(button => {
        button.addEventListener("click", () => {
            DOM.questionCounts.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            const countText = button.textContent.trim();
            currentLimit = (countText === "All") ? -1 : parseInt(countText);
        });
    });


    DOM.startQuizButton.addEventListener("click", () => {
        playerName = DOM.playerNameInput.value.trim();

        if (playerName === "") {
            alert("Please enter your name to start the quiz!");
            DOM.playerNameInput.focus();
            return;
        }

        quizQuestions = [...QUIZ_DATA[currentCategory]];
        shuffleArray(quizQuestions);
        
        
        let actualLimit = (currentLimit === -1) ? quizQuestions.length : Math.min(currentLimit, quizQuestions.length);
        quizQuestions = quizQuestions.slice(0, actualLimit);

        DOM.setupContainer.classList.remove("active");
        DOM.quizArea.style.display = "block";
        DOM.nextQuestionButton.style.display = "inline-block";
        DOM.restartButton.style.display = "none";
        
        
        loadQuestion(0);
    });


    DOM.answerOptionsList.addEventListener("click", handleAnswerSelection);
    DOM.nextQuestionButton.addEventListener("click", handleNextQuestion);
    DOM.restartButton.addEventListener("click", restartQuiz);
}


setupListeners();