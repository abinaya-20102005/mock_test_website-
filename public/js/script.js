// Global variables to track progress
let questions = [];
let index = 0;
let score = 0;

async function loadQuiz(subject) {
    try {
        // Use the full URL if your HTML is running on a different port (like 5500)
        const res = await fetch(`http://localhost:3000/questions/${subject}`);
        questions = await res.json();

        if (questions.length === 0) {
            document.getElementById("questionBox").innerHTML = "<h3>No questions found.</h3>";
            return;
        }

        show();
    } catch (err) {
        console.error("Fetch error:", err);
        document.getElementById("questionBox").innerHTML = "<h3>Error loading quiz.</h3>";
    }
}

function show() {
    let q = questions[index];
    
    // Display the Question
    document.getElementById("questionBox").innerHTML = `<h3>Q${index + 1}: ${q.question}</h3>`;

    // Display the Options
    let optionsHTML = "";
    q.options.forEach((opt) => {
        optionsHTML += `
            <div class="option-item">
                <input type="radio" name="quiz-opt" value="${opt}" id="${opt}">
                <label for="${opt}">${opt}</label>
            </div>
        `;
    });
    document.getElementById("optionsBox").innerHTML = optionsHTML;
}

// This function is called by the "Next" button in your HTML
function nextQuestion() {
    const selected = document.querySelector('input[name="quiz-opt"]:checked');

    if (!selected) {
        alert("Please select an answer!");
        return;
    }

    // Check Answer
    if (selected.value === questions[index].answer) {
        score++;
    }

    index++;

    if (index < questions.length) {
        show();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    document.querySelector(".card").innerHTML = `
        <h2>Quiz Over!</h2>
        <p>You scored ${score} out of ${questions.length}</p>
        <button onclick="location.href='dashboard.html'">Return to Dashboard</button>
    `;
}

// Auto-start based on URL
const params = new URLSearchParams(window.location.search);
const currentSubject = params.get("subject") || "maths";
loadQuiz(currentSubject);