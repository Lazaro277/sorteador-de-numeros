const repeatButton = document.querySelector('#repeat-number');
let teste = false

repeatButton.addEventListener('click', (event) => {
  event.preventDefault()
  repeatButton.classList.toggle('clicked')
  if (teste) {
    teste = false
  } else {
    teste = true
  }
  console.log(teste)
})  