'use strict';

function playClickSound() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.value = 800;

  gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + 0.05,
  );

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.05);
}
const historyList = document.getElementById('history');
const btnAction = document.querySelectorAll('.btn-action');
const btnNumber = document.querySelectorAll('.btn-number');
const btnOperator = document.querySelectorAll('.btn-operator');
const btnEquals = document.querySelector('.btn-equals');
const display = document.getElementById('display');

let currentNumber = '';
let previousNumber = '';
let operation = '';

//.........برای اعداد............

btnNumber.forEach(function (btn) {
  btn.addEventListener('click', function (e) {
    const number = e.target.dataset.number;
    playClickSound();
    if (number === '.' && currentNumber.includes('.')) return;
    if (currentNumber === '0' && number !== '.') {
      currentNumber = number;
    } else {
      currentNumber += number;
    }
    display.textContent = currentNumber;
  });
});

//..........برای عملیات..........

btnOperator.forEach(function (op) {
  op.addEventListener('click', function (e) {
    const operator = e.target.dataset.operation;

    if (currentNumber === '' && previousNumber !== '') {
      operation = operator;
    } else {
      previousNumber = currentNumber;
      currentNumber = '';
      operation = operator;
    }

    let displayOp = operator;
    if (operator === '*') displayOp = '×';
    if (operator === '/') displayOp = '÷';

    display.textContent = previousNumber + ' ' + displayOp;
  });
});

btnEquals.addEventListener('click', function () {
  playClickSound();
  if (!operation || !currentNumber) return;
  let result;
  if (operation === '+') {
    result = Number(previousNumber) + Number(currentNumber);
  } else if (operation === '-') {
    result = Number(previousNumber) - Number(currentNumber);
  } else if (operation === '*') {
    result = Number(previousNumber) * Number(currentNumber);
  } else if (operation === '/') {
    result = Number(previousNumber) / Number(currentNumber);
  }
  if (!isFinite(result)) {
    display.textContent = 'Error';
    currentNumber = '';
    previousNumber = '';
    operation = '';
    return;
  }
  addToHistory(`${previousNumber} ${operation} ${currentNumber} = ${result}`);
  currentNumber = String(result);
  display.textContent = currentNumber;
  previousNumber = '';
  operation = '';
});

btnAction.forEach(function (AC) {
  AC.addEventListener('click', function (e) {
    playClickSound();
    const reset = e.target.dataset.action;
    if (reset === 'clear') {
      historyList.innerHTML = '';
      currentNumber = '';
      previousNumber = '';
      operation = '';
      display.textContent = '0';
    } else if (reset === 'delete') {
      currentNumber = currentNumber.slice(0, -1);

      if (currentNumber === '') {
        display.textContent = '0';
      } else {
        display.textContent = currentNumber;
      }
    } else if (reset === '%') {
      currentNumber = String(Number(currentNumber) / 100);
      display.textContent = currentNumber;
    }
  });
});
function addToHistory(text) {
  const item = document.createElement('div');
  item.classList.add('history-item');
  item.textContent = text;
  historyList.appendChild(item);
  historyList.scrollTop = historyList.scrollHeight; //
}
