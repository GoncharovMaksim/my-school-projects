'use strict';
import { tgMessage } from '/tgApi.js';
let minNumber = 1;
let maxNumber = 10;
let operator = '*';
const limGame = 5;
const question = document.querySelector('.question');
let coefficient = 10;

const inputUserName = document.querySelector('[name="user-name"]');
const answer = document.querySelector('[name="answer"]');
const btnStart = document.querySelector('.btn-start');
const btnCheck = document.querySelector('.btn-check');
const output = document.querySelector('.output');
const grade = document.querySelector('.big-number');
const gameOver = document.querySelector('.end-game');
const dropdown1 = document.querySelector('.dropdown1');
//const dropdown2 = document.querySelector('.dropdown2');
const timer = document.querySelector('.timer');
const min = document.querySelector('.min');
const sec = document.querySelector('.sec');
//const mSec = document.querySelector('.m-sec');
const settings = document.querySelector('.settings');
const difficult = document.querySelector('.dropdown2');

let a;
let b;
let result;
let counter = 0;
let errorCounter = 0;
//let time;
let intervalId;
let count = 0;
let second = 0;
let minute = 0;

btnCheck.style.display = 'none';
gameOver.style.display = 'none';
answer.style.display = 'none';
timer.style.display = 'none';

if (localStorage.getItem('userName')) {
	inputUserName.value = localStorage.getItem('userName');
}
if (localStorage.getItem('operator')) {
	dropdown1.value = localStorage.getItem('operator');
	console.log('dropdown1.value', dropdown1.value);
}
if (localStorage.getItem('userDifficult')) {
	difficult.value = localStorage.getItem('userDifficult');
}

function randomNumber(a, b) {
	return Math.floor(Math.random() * (b - a + 1)) + a;
}

function startGame() {
	if (!inputUserName.value) {
		inputUserName.focus();
		inputUserName.style.background = 'red';
		return console.log('не введено имя');
	} else {
		inputUserName.style.background = 'green';
		inputUserName.style.display = 'none';
		localStorage.setItem('userName', inputUserName.value);
		localStorage.setItem('operator', dropdown1.value);
		localStorage.setItem('userDifficult', difficult.value);
	}
	timerStop();
	timerStart();
	console.log(dropdown1.value);
	operator = dropdown1.value;
	answer.style.display = '';
	gameOver.style.display = 'none';
	settings.style.display = 'none';
	timer.style.display = '';

	answer.value = '';
	answer.style.background = '';
	btnStart.style.display = 'none';
	btnCheck.style.display = '';
	answer.focus();
	if (difficult.value == 1) {
		maxNumber = 10;
	}
	if (difficult.value == 2) {
		maxNumber = 20;
		coefficient = 20;
	}
	if (difficult.value == 3) {
		maxNumber = 30;
		coefficient = 30;
	}

	a = randomNumber(minNumber, maxNumber);
	b = randomNumber(minNumber, maxNumber);
	if (operator === '*') {
		result = a * b;
	} else if (operator === '/') {
		a = a * b;
		result = a / b;
	} else if (operator === '-') {
		a = randomNumber(minNumber, maxNumber * coefficient);
		b = randomNumber(minNumber, maxNumber * coefficient);
		a += 50;
		result = a - b;
	} else {
		a = randomNumber(minNumber, maxNumber * coefficient);
		b = randomNumber(minNumber, maxNumber * coefficient);
		result = a + b;
	}

	question.textContent = `${a} ${operator} ${b} =`;
}
btnCheck.addEventListener('click', answerCheck);
answer.addEventListener('keydown', event => {
	if (event.key == 'Enter') {
		answerCheck();
	}
});
async function answerCheck() {
	const userAnswer = await new Promise(userAnswer => {
		userAnswer(answer.value);
	});
	console.log(userAnswer);

	return userAnswerCheck(userAnswer);
}

function userAnswerCheck(userAnswer) {
	console.log('userAnswer:', userAnswer, 'result:', result);
	let tempAnswer = document.createElement('li');
	if (!userAnswer) {
		console.log(userAnswer);

		answer.focus();
		answer.style.background = 'red';
		return console.log('не введен ответ');
	}
	if (userAnswer == result) {
		let answerTime;
		if (min.textContent === '00') {
			answerTime = `${sec.textContent} с`;
		} else {
			answerTime = `${min.textContent} : ${sec.textContent}`;
		}

		tempAnswer.textContent = `${a} ${operator} ${b} = ${result} (${userAnswer}) ${answerTime}`;
		tempAnswer.style.color = 'green';
		output.insertBefore(tempAnswer, output.firstChild);
		counter += 1;
		if (counter >= limGame) {
			return endGame();
		} else {
			return startGame();
		}
	} else {
		let answerTime;
		if (min.textContent === '00') {
			answerTime = `${sec.textContent} с`;
		} else {
			answerTime = `${min.textContent} : ${sec.textContent}`;
		}

		tempAnswer.textContent = `${a} ${operator} ${b} = ${result} (${userAnswer}) ${answerTime}`;
		tempAnswer.style.color = 'red';
		output.insertBefore(tempAnswer, output.firstChild);
		errorCounter += 1;
		console.log(result);
		counter += 1;
		if (counter >= limGame) {
			return endGame();
		} else {
			return startGame();
		}
	}
}

function endGame() {
	timerStop();
	btnCheck.style.display = 'none';
	btnStart.style.display = '';
	answer.style.display = 'none';
	settings.style.display = '';
	timer.style.display = 'none';

	let percentAnswer = 100 - (errorCounter / limGame) * 100;
	console.log(percentAnswer);
	if (percentAnswer > 89) {
		grade.textContent = 5;
	} else if (percentAnswer > 69) {
		grade.textContent = 4;
	} else if (percentAnswer > 49) {
		grade.textContent = 3;
	} else if (percentAnswer > 29) {
		grade.textContent = 2;
	} else {
		grade.textContent = 1;
	}
	let stat = document.createElement('div');
	stat.textContent = `Оценка: ${grade.textContent} (${percentAnswer}%), ${difficult.value} ур.`;
	output.insertBefore(stat, output.firstChild);
	counter = 0;
	errorCounter = 0;
	question.textContent = '';
	gameOver.style.display = '';
	tgMessage(`${inputUserName.value}: ${output.textContent}`);
	return;
}

btnStart.addEventListener('click', startGame);

//timer
function timerStop() {
	clearInterval(intervalId);
	count = 0;
	second = 0;
	minute = 0;
	sec.textContent = String(second).padStart(2, '0');
	min.textContent = String(minute).padStart(2, '0');
}
function timerStart() {
	count = 0;
	second = 0;
	minute = 0;

	intervalId = setInterval(() => {
		if (count >= 10) {
			second++;
			count = 0;
		}
		if (second >= 60) {
			minute++;
			second = 0;
		}

		// mSec.textContent = count;
		// mSec.textContent = String(count).padStart(2, '0');
		sec.textContent = String(second).padStart(2, '0');
		min.textContent = String(minute).padStart(2, '0');
		count++;
	}, 100);
}
