'use strict';

async function answerCheck() {
	const userAnswer = await new Promise(userAnswer => {
		userAnswer(answer.value);
	});
	console.log(userAnswer);

	return userAnswerCheck(userAnswer);
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
