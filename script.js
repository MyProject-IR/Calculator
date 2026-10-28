'use strict';

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
    if (operation === '' && previousNumber === '') currentNumber = '';
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

  currentNumber = String(result);
  display.textContent = currentNumber;
  previousNumber = '';
  operation = '';
});

btnAction.forEach(function (AC) {
  AC.addEventListener('click', function (e) {
    const reset = e.target.dataset.action;
    if (reset === 'clear') {
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
