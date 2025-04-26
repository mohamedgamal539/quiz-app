// Selectors
let welcomeMsg = document.querySelector('.welcome-msg');
let lang_One = document.querySelector('.langs .one');
let lang_Two = document.querySelector('.langs .two');
let lang_Three = document.querySelector('.langs .three');
let category = document.querySelector('.category span');
let heading = document.querySelector('h1');
let labels = document.querySelectorAll('label');
let questions = document.querySelector('.questions span');
let minutes = document.querySelector('.timer .minutes');
let seconds = document.querySelector('.timer .seconds');
let submitBtn = document.querySelector('input[type="submit"]');
let circlesDiv = document.querySelector('.circles');
let count = 0;
let count_2 = 0;
let count_3 = 0;
var counter;
var numberOfSeconds = 50;

let mySet = new Set();

function changeBodyBackgroundColor() {
    document.querySelector('.bg-colors .white').onclick = function () {
        document.body.style.backgroundColor = '#FFF';
    }
    
    document.querySelector('.bg-colors .black').onclick = function () {
        document.body.style.backgroundColor = '#000';
    }
    
    document.querySelector('.bg-colors .rebeccapurple').onclick = function () {
        document.body.style.backgroundColor = 'rebeccapurple';
    }
}

changeBodyBackgroundColor();

// Setting Initial Values
seconds.textContent = `${numberOfSeconds}`;

// Check On Timer
function checkTimer() {
    if (minutes.textContent >= 10) {
        minutes.textContent = minutes.textContent;
    } else if (minutes.textContent === '00') {
        minutes.textContent = minutes.textContent
    } else {
        minutes.textContent = '0' + minutes.textContent;
    }

    if (seconds.textContent >= 10) {
        seconds.textContent = seconds.textContent;
    } else if (seconds.textContent === '00') {
        seconds.textContent = seconds.textContent;
    } else {
        seconds.textContent = '0' + seconds.textContent;
    }
}

checkTimer();

lang_One.onclick = function () {
    showContainerBox();
    category.textContent = this.textContent;
    fetch('html.json')
    .then((resolvedValue) => returnDataFromJs(resolvedValue))
    .then((resolvedValue) => generateResultOfThen(resolvedValue));
}

lang_Two.onclick = function () {
    showContainerBox();
    category.textContent = this.textContent;
    fetch('css.json')
    .then((resolvedValue) => returnDataFromJs(resolvedValue))
    .then((resolvedValue) => generateResultOfThen(resolvedValue));
}

lang_Three.onclick = function () {
    showContainerBox();
    category.textContent = this.textContent;
    fetch('js.json')
    .then((resolvedValue) => returnDataFromJs(resolvedValue))
    .then((resolvedValue) => generateResultOfThen(resolvedValue));
}

function showContainerBox() {
    welcomeMsg.style.display = 'none';
    document.querySelector('.container').style.display = 'block';
}

function returnDataFromJs(resolvedValue) {
    let jsData = resolvedValue.json();
    return jsData;
}


function generateResultOfThen(resolvedValue) {
    
    console.log(resolvedValue);
    // Setting Values
    questions.textContent = resolvedValue.length;
    heading.textContent = resolvedValue[count]["question"];
    labels[0].textContent = resolvedValue[count]["answer1"];
    labels[1].textContent = resolvedValue[count]["answer2"];
    labels[2].textContent = resolvedValue[count]["answer3"];
    labels[3].textContent = resolvedValue[count]["answer4"];

    // Create circles
    for (let i = 0; i < resolvedValue.length; i++) {
        let circleDiv = document.createElement('div');
        circleDiv.style.cssText = 'background-color: #dcdcdc; width: 18px; height: 18px; border-radius: 50%; margin-right: 4px;';
        circleDiv.className = 'circle';
        circlesDiv.appendChild(circleDiv);
    }

    // Add Active Class To First Circle
    let allCircleDivs = document.querySelectorAll('.circle');
    allCircleDivs[0].style.background = 'var(--mainColor)';

    // Counter
    function countSeconds() {
        counter = setInterval(function () {
            seconds.textContent -= 1;
            checkTimer();
            if (seconds.textContent === '00') {
                removeRadioInputValues();
                clearInterval(counter);
                getNextQuestionWithAnswers();
                getNextCircle();
                seconds.textContent = `${numberOfSeconds}`;
                checkTimer();
                if (count < resolvedValue.length) {
                    countSeconds();
                } else {
                    showResult();
                }
            }

        }, 1000);
    }

    countSeconds();

    function removeRadioInputValues() {
        let allRadioInputs = document.querySelectorAll('input[type="radio"]');
        allRadioInputs.forEach(function (input) {
            input.checked = false;
        })
    }

    function getNextQuestionWithAnswers() {
        count++;
        if (count < resolvedValue.length) {
            heading.textContent = resolvedValue[count]["question"];
            labels[0].textContent = resolvedValue[count]["answer1"];
            labels[1].textContent = resolvedValue[count]["answer2"];
            labels[2].textContent = resolvedValue[count]["answer3"];
            labels[3].textContent = resolvedValue[count]["answer4"];
        } else {
            clearInterval(counter);
        }
    }

    submitBtn.addEventListener('click', function () {
        removeRadioInputValues();
        clearInterval(counter);
        getNextQuestionWithAnswers();
        getNextCircle();
        seconds.textContent = `${numberOfSeconds}`;
        checkTimer();
        if (count_2 < resolvedValue.length) {
            countSeconds();
        } else {
            showResult();
        }
    });

    function getNextCircle() {
        // for (let i = 0; i < allCircleDivs.length; i++) {
        //     allCircleDivs[i].style.background = 'var(--mainColor)';
        // }
        count_2++;
        if (count_2 < resolvedValue.length) {
            allCircleDivs[count_2].style.background = 'var(--mainColor)';
        }
    }

    // Checking Input Value
    function checkRadioInputValue() {
        let allRadioInputs = document.querySelectorAll('input[type="radio"]');
        allRadioInputs.forEach(function (input) {
            input.onchange = function () {
                if (mySet.has(count)) return;
                if (input.nextElementSibling.textContent === resolvedValue[count]["rightAnswer"]) {
                    count_3++; 
                    mySet.add(count);
                    if (count_3 === resolvedValue.length) {
                        document.querySelector('.result .status').textContent = 'Bravo';
                    } else if (count_3 >= 5) {
                        document.querySelector('.result .status').textContent = 'Good';
                    } else {
                        document.querySelector('.result .status').textContent = 'Bad';
                    }
                    document.querySelector('.result .score').textContent = count_3;
                } 
            }
            if (input.checked === false) {
                document.querySelector('.result .status').textContent = 'Bad';
            }
        });
    }

    checkRadioInputValue();

    // Showing Final Result
    function showResult() {
        document.querySelector('.content').style.display = 'none';
        submitBtn.style.display = 'none';
        document.querySelector('.footer').style.display = 'none';
        document.querySelector('.result').style.display = 'block';
        document.querySelector('.result .total-score').textContent = `${resolvedValue.length}`;
    }
}
