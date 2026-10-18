const repeatButton = document.querySelector('#repeat-number');
const qtyNumberInput = document.querySelector('#qty-number');
const fromNumberInput = document.querySelector('#from-number');
const toNumberInput = document.querySelector('#to-number');
const drawButton = document.querySelector('#draw-button');
const form = document.querySelector('form');
const inputs = document.querySelectorAll('form input')
let repeatNumber = false
let randomNumberList = []

repeatButton.addEventListener('click', () => {
  //adiciona estilo quando o botão for marcado
  repeatButton.classList.toggle('clicked')

  //verifica se ele está marcado ou não
  if (repeatNumber) {
    repeatNumber = false
  } else {
    repeatNumber = true
  }
})

form.addEventListener('input', () => {
  //remove tudo que não é número dos inputs
  inputs.forEach(input => {
    input.value = input.value.replace(/\D/g, '')
  });
})


form.addEventListener('submit', (event) => {
  event.preventDefault()

  let min = Number(fromNumberInput.value)
  let max = Number(toNumberInput.value)
  //gera a quantidade de números informado pelo usuário
  for (let i = 0; i < qtyNumberInput.value; i++) {
    if (repeatNumber) {
      //adiciona na lista sem repetir
      randomNumberList.push(generateRandomNumberNoRepetition(min, max))
    } else {
      //adiciona na lista, podendo repetir
      randomNumberList.push(generateRandomNumber(min, max))
    }
  }

})

//gera um número aleatório
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

//gera um número sem repetir
function generateRandomNumberNoRepetition(min, max) {
  let randomNumber

  //se todos os números do intervalo já foram sorteados
  if (randomNumberList.length >= (max - min + 1)) {
    return null
  }

  //fica sorteando até achar algum que não foi sorteado ainda
  do {
    randomNumber = generateRandomNumber(min, max)
  } while (randomNumberList.includes(randomNumber));

  return randomNumber
}


