const slides = Array.from(document.querySelectorAll('.slide'))
const indicators = Array.from(document.querySelectorAll('.indicator'))
const slidesContainer = document.querySelector('#slides-container')
const indicatorsContainer = document.querySelector('#indicators-container')
const pauseButton = document.querySelector('#pause-btn')
const prevButton = document.querySelector('#prev-btn')
const nextButton = document.querySelector('#next-btn')

const SLIDES_COUNT = slides.length
const CODE_ARROW_LEFT = 'ArrowLeft'
const CODE_ARROW_RIGHT = 'ArrowRight'
const CODE_SPACE = 'Space'
const FA_PAUSE = '<i class="fas fa-pause"></i>'
const FA_PLAY = '<i class="fas fa-play"></i>'
const TIMER_INTERVAL = 2000
const MIN_SWIPE_DISTANCE = 100

let currentSlide = 0
let isPlaying = true
let timerId = null
let swipeStartX = 0
let swipeEndX = 0

function goToSlide(index) {
  if (!SLIDES_COUNT) return

  const safeIndex = (index + SLIDES_COUNT) % SLIDES_COUNT

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === safeIndex)
  })

  indicators.forEach((indicator, indicatorIndex) => {
    indicator.classList.toggle('active', indicatorIndex === safeIndex)
  })

  currentSlide = safeIndex
}

function nextSlide() {
  goToSlide(currentSlide + 1)
}

function prevSlide() {
  goToSlide(currentSlide - 1)
}

function startAutoPlay() {
  if (timerId) {
    clearInterval(timerId)
  }

  isPlaying = true
  pauseButton.innerHTML = FA_PAUSE
  timerId = setInterval(nextSlide, TIMER_INTERVAL)
}

function stopAutoPlay() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }

  isPlaying = false
  pauseButton.innerHTML = FA_PLAY
}

function pausePlayHandler() {
  if (isPlaying) {
    stopAutoPlay()
  } else {
    startAutoPlay()
  }
}

function nextHandler() {
  stopAutoPlay()
  goToSlide(currentSlide + 1)
}

function prevHandler() {
  stopAutoPlay()
  goToSlide(currentSlide - 1)
}

function indicatorClickHandler(event) {
  const indicator = event.target.closest('.indicator')

  if (!indicator) return

  stopAutoPlay()
  goToSlide(Number(indicator.dataset.slideTo))
}

function keydownHandler(event) {
  if (event.code === CODE_ARROW_RIGHT || event.key === CODE_ARROW_RIGHT) {
    event.preventDefault()
    stopAutoPlay()
    goToSlide(currentSlide + 1)
  } else if (event.code === CODE_ARROW_LEFT || event.key === CODE_ARROW_LEFT) {
    event.preventDefault()
    stopAutoPlay()
    goToSlide(currentSlide - 1)
  } else if (event.code === CODE_SPACE || event.key === ' ' || event.key === CODE_SPACE) {
    event.preventDefault()
    pausePlayHandler()
  }
}
const getClientX = (event) => event.touches?.[0]?.clientX ?? event.changedTouches?.[0]?.clientX ?? event.clientX

function swipeStartHandler(event) {
  const clientX = getClientX(event)
  swipeStartX = clientX
}

function swipeEndHandler(event) {
  const clientX = getClientX(event)
  swipeEndX = clientX

  const swipeDistance = swipeEndX - swipeStartX

  if (swipeDistance > MIN_SWIPE_DISTANCE) {
    prevHandler()
  } else if (swipeDistance < -MIN_SWIPE_DISTANCE) {
    nextHandler()
  }
}

function init() {
  goToSlide(0)

  pauseButton.addEventListener('click', pausePlayHandler)
  nextButton.addEventListener('click', nextHandler)
  prevButton.addEventListener('click', prevHandler)
  indicatorsContainer.addEventListener('click', indicatorClickHandler)
  slidesContainer.addEventListener('mousedown', swipeStartHandler)
  slidesContainer.addEventListener('mouseup', swipeEndHandler)
  slidesContainer.addEventListener('touchstart', swipeStartHandler)
  slidesContainer.addEventListener('touchend', swipeEndHandler)
  document.addEventListener('keydown', keydownHandler)

  startAutoPlay()
}

init()
