const repeatButton = document.querySelector('#repeat-number');
const qtyNumberInput = document.querySelector('#qty-number');
const fromNumberInput = document.querySelector('#from-number');
const toNumberInput = document.querySelector('#to-number');
const drawButton = document.querySelector('#draw-button');
const drawNumbers = document.querySelector('#draw-numbers');
const raffleOptions = document.querySelector('.raffle-options');
const H3Raffle = document.querySelector('.display-medium');
const PRaffle = document.querySelector('.display-medium +p');
const form = document.querySelector('form');
const inputs = document.querySelectorAll('form input')
const logo = document.querySelector('#logo')
const div = document.createElement('div')
let repeatNumber = false
let randomNumberList = []

logo.onclick = function () {
  window.location.href = 'index.html'
}

div.classList.add('hide')


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
  randomNumberList = []
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

  //remove numeros já sorteados da tela para sortear novamente
  document.querySelectorAll('.radomNumberElement').forEach(element => {
    element.remove()
  });

  //altera textos e imagens, remove alguns elementos para mostrar o resultado do sorteio
  drawButton.querySelector('span').innerHTML = 'Sortear novamente <img src="assets/icons/draw-again.svg" alt="" class="draw-again">'

  div.classList.toggle('hide')
  document.querySelector('#raffle-default').classList.toggle('hide')
  H3Raffle.parentElement.style.textAlign = 'center'
  H3Raffle.textContent = 'Resultado do sorteiro'
  PRaffle.textContent = '1° Resultado'
  PRaffle.style.textTransform = 'uppercase'

  //cria a div que exibirá o resultado e cria o numero sorteado na tela
  div.classList.add('raffle-results')
  randomNumberList.forEach(randomNumber => {
    div.append(createElement(randomNumber))
  });
  drawNumbers.prepend(div)

})

//cria o elemento sorteado na tela
function createElement(number) {
  const span = document.createElement('span')
  span.classList.add('radomNumberElement')
  span.textContent = number
  return span
}

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


