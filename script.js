let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timer;
let timeLeft = 30;

const fetchQuestions = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();
  questions = data.slice(0, 10).map((q, index) => ({
    question: q.title,
    choices: [
      q.body.slice(0, 20),
      q.body.slice(20, 40),
      q.body.slice(40, 60),
      q.body.slice(60, 80),
    ],
    correctAnswer: 0,
  }));
  startQuiz();
};

const startQuiz = () => {
  showQuestion();
  startTimer();
};

const showQuestion = () => {
  const question = questions[currentQuestionIndex];
  document.getElementById("question-title").innerText = question.question;
  document.getElementById("choiceA").innerText = "A)" + question.choices[0];
  document.getElementById("choiceB").innerText = "B)" + question.choices[1];
  document.getElementById("choiceC").innerText = "C)" + question.choices[2];
  document.getElementById("choiceD").innerText = "D)" + question.choices[3];

  disableChoices(true);

  setTimeout(() => {
    disableChoices(false);
  }, 10000);
};

const startTimer = () => {
  timeLeft = 30;
  document.getElementById("time-left").innerText = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time-left").innerText = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
};

const nextQuestion = () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    showQuestion();
    startTimer();
  } else {
    showSummary();
  }
};

const selectAnswer = (answerIndex) => {
  const correctAnswer = questions[currentQuestionIndex].correctAnswer;
  userAnswers.push({
    question: questions[currentQuestionIndex].question,
    selected: questions[currentQuestionIndex].choices[answerIndex],
    correct: questions[currentQuestionIndex].choices[correctAnswer],
  });
  clearInterval(timer);
  nextQuestion();
};

const disableChoices = (disable) => {
  document.getElementById("choiceA").disabled = disable;
  document.getElementById("choiceB").disabled = disable;
  document.getElementById("choiceC").disabled = disable;
  document.getElementById("choiceD").disabled = disable;
};

const showSummary = () => {
  document.getElementById("quiz-container").style.display = "none";
  const summary = document.getElementById("summary");
  const tableBody = summary.querySelector("tbody");

  userAnswers.forEach((answer, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${answer.selected}</td>
            <td>${answer.correct}</td>
        `;
    tableBody.appendChild(row);
  });

  summary.style.display = "block";
};

document
  .getElementById("choiceA")
  .addEventListener("click", () => selectAnswer(0));
document
  .getElementById("choiceB")
  .addEventListener("click", () => selectAnswer(1));
document
  .getElementById("choiceC")
  .addEventListener("click", () => selectAnswer(2));
document
  .getElementById("choiceD")
  .addEventListener("click", () => selectAnswer(3));

fetchQuestions();
