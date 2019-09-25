const score = document.querySelector('.score')
const start = document.querySelector('.btnStart')
const difficalt = document.querySelectorAll('.btn')
const gameArea = document.querySelector('.gameArea')
const car = document.createElement('div')
let audio = new Audio('./6e255b4b6b8375e.mp3')
audio.loop = true
audio.muted = false

car.classList.add('car')


start.addEventListener('click', startGame)

document.addEventListener('keydown', startRun)
document.addEventListener('keyup', stopRun)

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
}

const difficultSetting = (i) => {
  switch (i) {
    case 0:
      return {
        start: false,
          score: 0,
          speed: 3,
          traffic: 6
      };
      break;
    case 1:
      return {
        start: false,
          score: 0,
          speed: 4,
          traffic: 4
      };
      break;
    case 2:
      return {
        start: false,
          score: 0,
          speed: 6,
          traffic: 2
      };
      break;
  }
}

let setting = null

for (let i = 0; i < difficalt.length; i++) {
  difficalt[i].addEventListener('click', function () {
    for (let j = 0; j < difficalt.length; j++) {
      if (difficalt[j].classList.contains('active')) {
        difficalt[j].classList.remove('active')
      }
    }
    this.classList.add('active')
    setting = difficultSetting(i)
  })
}

const getQualityElementElements = (heightElement) => document.documentElement.clientHeight / heightElement + 1

function startGame() {
  if (setting === null) {
    alert('Выберите сложность!')
  } else {

    if (localStorage.getItem('bestScore') === null) {
      localStorage.setItem('bestScore', JSON.stringify({
        score: 0
      }))
    }
    document.querySelector('.start').classList.add('hide')
    gameArea.innerHTML = ''
    audio.currentTime = 0
    audio.play()
    for (let i = 0; i < getQualityElementElements(75); i++) {
      const line = document.createElement('div')
      line.classList.add('line')
      line.style.top = (i * 75) + 'px'
      line.y = i * 75
      gameArea.appendChild(line)
    }
  
  
    for (let i = 0; i < getQualityElementElements(100 * setting.traffic); i++) {
      const enemy = document.createElement('div')
      let enemyImg = Math.floor(Math.random() * 2) + 1
      enemy.classList.add('enemy')
      enemy.y = -100 * setting.traffic * ++i
      enemy.style.left = Math.floor((Math.random() * (gameArea.offsetWidth - 50))) + 'px'
      enemy.style.top = enemy.y + 'px'
      enemy.style.background = `transparent url(./image/enemy${enemyImg}.png) center / contain no-repeat`
      gameArea.appendChild(enemy)
    }
  
    setting.score = 0
    setting.start = true
    gameArea.appendChild(car)
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + 'px'
    car.style.top = 'auto'
    car.style.bottom = '10px'
    setting.x = car.offsetLeft
    setting.y = car.offsetTop
    requestAnimationFrame(playGame)
  }
}

function playGame() {
  if (setting.start) {
    setting.score += setting.speed
    score.innerHTML = `Score <br> ${setting.score}`
    moveRoad()
    moveEnemy()
    if (keys.ArrowLeft && setting.x > 0) {
      setting.x -= setting.speed
    }
    if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
      setting.x += setting.speed
    }

    if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
      setting.y += setting.speed
    }
    if (keys.ArrowUp && setting.y > 0) {
      setting.y -= setting.speed
    }

    car.style.left = setting.x + 'px'
    car.style.top = setting.y + 'px'

    requestAnimationFrame(playGame)
  }
}

function startRun(e) {
  e.preventDefault()
  if (e.key in keys) {
    keys[e.key] = true
  }

  switch (e.key) {
    case '-':
      if (audio.volume > 0.1) {
        audio.volume -= 0.1
      }
      break;
    case '+':
      if (audio.volume < 1.0) {
        audio.volume += 0.1
      }
      break;
    case 'p':
      audio.pause();
      break;
    case 's':
      audio.play();
      break;
    case 'm':
      audio.muted = !audio.muted;
      break;
  }
}

function stopRun(e) {
  e.preventDefault()
  if (e.key in keys) {
    keys[e.key] = false
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line')
  lines.forEach(el => {
    el.y += setting.speed
    el.style.top = el.y + 'px'
    if (el.y >= document.documentElement.clientHeight) {
      el.y = -75
    }
  })
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy')
  enemy.forEach(el => {
    let carRect = car.getBoundingClientRect()
    let enemyRect = el.getBoundingClientRect()

    if (carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left && carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top) {
      setting.start = false
      document.querySelector('.start').classList.remove('hide')
      start.style.top = score.offsetHeight + 'px'
      audio.pause()
      if (JSON.parse(localStorage.getItem('bestScore')).score < setting.score) {
        localStorage.setItem('bestScore', JSON.stringify({
          score: setting.score
        }))
        alert('Новый Рекорд!')
      }
    }

    el.y += setting.speed / 2
    el.style.top = el.y + 'px'
    if (el.y >= document.documentElement.clientHeight) {
      el.y = -100 * setting.traffic
      el.style.left = Math.floor((Math.random() * (gameArea.offsetWidth - 50))) + 'px'
    }
  })
}