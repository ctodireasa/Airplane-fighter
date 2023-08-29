const gameContainer = document.getElementById('game-container');
const player = document.getElementById('player');
let destroyedObjects = 0;

function getRandomPosition(min, max) {
  return Math.random() * (max - min) + min;
}

function createObstacle() {
  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.left = getRandomPosition(0, gameContainer.clientWidth - 30) + 'px';
  gameContainer.appendChild(obstacle);

  moveObstacle(obstacle);
}

function moveObstacle(obstacle) {
  const interval = setInterval(() => {
    const currentPosition = parseInt(obstacle.style.top) || 0;
    obstacle.style.top = currentPosition + 5 + 'px';

    if (currentPosition > gameContainer.clientHeight) {
      clearInterval(interval);
      obstacle.remove();
    }

    if (checkCollision(player, obstacle)) {
      clearInterval(interval);
      endGame();
    }
  }, 30);
}

function checkCollision(player, obstacle) {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  return (
    playerRect.left < obstacleRect.right &&
    playerRect.right > obstacleRect.left &&
    playerRect.top < obstacleRect.bottom &&
    playerRect.bottom > obstacleRect.top
  );
}

function endGame() {
  alert('The game is over! Number of destroyed objects: ' + destroyedObjects);
  location.reload();
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') {
    const currentPosition = parseInt(player.style.left) || 0;
    player.style.left = currentPosition - 10 + 'px';
  }

  if (event.key === 'ArrowRight') {
    const currentPosition = parseInt(player.style.left) || 0;
    player.style.left = currentPosition + 10 + 'px';
  }

  if (event.key === ' ') {
    shoot();
  }
});

function shoot() {
  const projectile = document.createElement('div');
  projectile.className = 'projectile';
  const playerRect = player.getBoundingClientRect();
  const playerX = playerRect.left + playerRect.width / 2;
  projectile.style.left = playerX + 'px';
  projectile.style.bottom = '50px';

  const projectileContainer = document.getElementById('projectile-container');
  projectileContainer.appendChild(projectile);

  moveProjectile(projectile);
}

function moveProjectile(projectile) {
  const interval = setInterval(() => {
    const currentPosition = parseInt(projectile.style.bottom) || 0;
    projectile.style.bottom = currentPosition + 10 + 'px';

    if (currentPosition > gameContainer.clientHeight) {
      clearInterval(interval);
      projectile.remove();
    }

    for (const obstacle of document.querySelectorAll('.obstacle')) {
      if (checkCollision(projectile, obstacle)) {
        clearInterval(interval);
        projectile.remove();
        obstacle.remove();
        ++destroyedObjects;
      }
    }
  }, 30);
}

setInterval(createObstacle, 2000);