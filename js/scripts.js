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
const containerResults = document.querySelector('#container-results')
const drawAgainButton = document.querySelector('#draw-again-button')
const raffleError = document.querySelector('#raffle-error')
let repeatNumber = false
let randomNumberList = []

logo.onclick = function () {
  window.location.href = 'index.html'
}

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
  const quantity = Number(qtyNumberInput.value)
  const availableNumbers = max - min + 1

  raffleError.textContent = ''

  if (quantity < 1 || min > max) {
    raffleError.textContent = 'Informe uma quantidade e um intervalo válidos.'
    return
  }

  if (repeatNumber && quantity > availableNumbers) {
    raffleError.textContent = `Você pediu ${quantity} números, mas o intervalo de ${min} a ${max} só permite ${availableNumbers} números sem repetição. Aumente o intervalo ou permita repetições.`
    return
  }

  //faz o botao esperar todos os itens serem criados para ele aparecer
  drawAgainButton.style.setProperty('--delay-btn-raffle', `${.5 + (2.5 * quantity)}s`)
  randomNumberList = []
  //gera a quantidade de números informado pelo usuário
  for (let i = 0; i < quantity; i++) {
    if (repeatNumber) {
      //adiciona na lista sem repetir
      const randomNumber = generateRandomNumberNoRepetition(min, max)
      if (randomNumber !== null) {
        randomNumberList.push(randomNumber)
      }
    } else {
      //adiciona na lista, podendo repetir
      randomNumberList.push(generateRandomNumber(min, max))
    }
  }

  //remove numeros já sorteados da tela para sortear novamente
  document.querySelectorAll('.radomNumberElement').forEach(element => {
    element.remove()
  });

  //esconde o form de escolha do sorteio e mostra os resultados
  document.querySelector('#raffle-results').classList.toggle('hide')
  document.querySelector('#raffle-default').classList.toggle('hide')

  //adiciona animação para quando clicar em sortear novemente
  document.querySelector('#raffle-default').classList.add('animation-default')

  //cria a espera entre a criação dos elementos
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

  //função que mostrará os resultados criando os elementos
  async function showResults() {
    //passa pela lista de numeros sorteados
    for (const [index, randomNumber] of randomNumberList.entries()) {
      //animação na hora de criar os elementos
      //cria o numero sorteado na tela
      const newElement = createElement(randomNumber)

      await animateLayout(() => {
        containerResults.append(newElement)
      })

      newElement.classList.remove('new-number')

      //se ainda tiver mais numeros espera 2.5s para criar o próximo
      if (index < randomNumberList.length - 1) {
        await wait(2500)
      }
    }
  }

  //mostra os resultados
  showResults()

})


drawAgainButton.onclick = function () {
  //esconde os resultados e mostra as informações iniciais novamente
  document.querySelector('#raffle-results').classList.toggle('hide')
  document.querySelector('#raffle-default').classList.toggle('hide')
}

//cria o elemento sorteado na tela
function createElement(number) {
  const span = document.createElement('span')
  span.classList.add('radomNumberElement', 'new-number')
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

//anima a cada entrada de um novo número sorteado
function animateLayout(updateLayout) {
  const elements = [
    ...containerResults.children,
    drawAgainButton
  ]

  const firstPositions = new Map()

  elements.forEach(element => {
    firstPositions.set(element, element.getBoundingClientRect())
  })

  updateLayout()

  const lastPositions = new Map()

  elements.forEach(element => {
    lastPositions.set(element, element.getBoundingClientRect())
  })

  elements.forEach(element => {
    const first = firstPositions.get(element)
    const last = lastPositions.get(element)

    if (!first || !last) return

    const moveX = first.left - last.left
    const moveY = first.top - last.top

    element.style.transform = `translate(${moveX}px, ${moveY}px)`
    element.style.transition = 'none'

    requestAnimationFrame(() => {
      element.style.transition = 'transform 500ms ease-in-out'
      element.style.transform = ''
    })
  })

  return new Promise(resolve => {
    setTimeout(resolve, 500)
  })
}

