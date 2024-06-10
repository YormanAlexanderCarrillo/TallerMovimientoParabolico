"use strict";

const containerBall = document.getElementById("contenedorBola");
const ball = document.getElementById("ball");
const btnLauch = document.getElementById("btnLauch");
const btnShowGraph = document.getElementById("btnShowGraph");
const containerGraphs = document.getElementById("containerGraphs");

const inputx0 = document.getElementById("inputx0");
const inputY0 = document.getElementById("inputY0");
const inputV = document.getElementById("inputVelocity");
const inputAngle = document.getElementById("inputAngle");
const inputGravity = document.getElementById("inputGravity");

let posX = Number(inputx0.value);
let posY = Number(inputY0.value);
let initialVelocity = Number(inputV.value);
let angle = Number(inputAngle.value);
let gravity = parseFloat(inputGravity.value);

let time = 0;
const timeStep = 0.5;

let countJumps = 0;
const dampingFactor = 0.5;
let velocityX = 0;
let velocityY = 0;
let newX = 0;
let newY = 0;

const handleInputChange = () => {
  posX = Number(inputx0.value);
  posY = Number(inputY0.value);
  initialVelocity = Number(inputV.value);
  angle = Number(inputAngle.value);
  gravity = parseFloat(inputGravity.value);
  ball.style.left = posX + "px";
  ball.style.bottom = posY + "px";
};

ball.style.left = posX + "px";
ball.style.bottom = posY + "px";

inputx0.addEventListener("change", handleInputChange);
inputY0.addEventListener("change", handleInputChange);
inputV.addEventListener("change", handleInputChange);
inputAngle.addEventListener("change", handleInputChange);
inputGravity.addEventListener("change", handleInputChange);

const velocityAngleData = {
  labels: [],
  datasets: [
    {
      label: "Angulo respecto la velocidad",
      data: [],
      borderColor: "rgb(64, 211, 5)",
      tension: 0.1,
      fill: false,
    },
  ],
};

const ctxVelocityAngle = document
  .getElementById("velocityAngleChart")
  .getContext("2d");
const velocityAngleChart = new Chart(ctxVelocityAngle, {
  type: "line",
  data: velocityAngleData,
  options: {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Velocidad ",
        },
      },
      y: {
        title: {
          display: true,
          text: "Ángulo",
        },
      },
    },
  },
});

const velocityData = {
  labels: [],
  datasets: [
    {
      label: "Velocidad por salto vs tiempo",
      data: [],
      borderColor: "rgb(255, 99, 132)",
      tension: 0.1,
      fill: false,
    },
  ],
};

const ctxVelocity = document.getElementById("velocityChart").getContext("2d");
const velocityChart = new Chart(ctxVelocity, {
  type: "line",
  data: velocityData,
  options: {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Tiempo",
        },
      },
      y: {
        title: {
          display: true,
          text: "Velocidad en Y",
        },
      },
    },
  },
});

const trajectoryData = {
  labels: [],
  datasets: [
    {
      label: "Posisición X vs Y",
      data: [],
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
      fill: false,
    },
  ],
};

const ctx = document.getElementById("trajectoryChart").getContext("2d");
const trajectoryChart = new Chart(ctx, {
  type: "line",
  data: trajectoryData,
  options: {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Posición X",
        },
      },
      y: {
        title: {
          display: true,
          text: "Posición Y",
        },
      },
    },
  },
});

const validateJumps = () => {
  if (countJumps === 3) {
    clearInterval(interval);
    countJumps = 0;
    posX = Number(inputx0.value);
    posY = Number(inputY0.value);
    newY = 0;
    return;
  }
};

const launchBall = () => {
  time = 0;
  posX = posX;
  posY = posY;
  trajectoryData.labels = [];
  trajectoryData.datasets[0].data = [];
  velocityData.labels = [];
  velocityData.datasets[0].data = [];
  velocityAngleData.labels = [];
  velocityAngleData.datasets[0].data = [];

  velocityX = initialVelocity * Math.cos((angle * Math.PI) / 180);
  velocityY = initialVelocity * Math.sin((angle * Math.PI) / 180);
  moveBall();
};

const moveBall = () => {
  newX = velocityX * time + posX;
  newY = -0.5 * gravity * time * time + velocityY * time + posY;

  if (newY < 0) {
    console.log("entro if 1");
    velocityY = velocityY * 0.5;
    velocityX = velocityX * 0.5;
    posX = newX;
    posY = 0;
    countJumps += 1;
    console.log(countJumps);
    validateJumps();
    time = 0;
  }

  if (newX >= containerBall.offsetWidth) {
    console.log("entro if 2");
    velocityX = -velocityX * 0.5;
    velocityY = velocityY * 0.5;
    posX = containerBall.offsetWidth;
    posY = newY;
    countJumps += 1;
    validateJumps();
    time = 0;
  }

  if (newX < 0) {
    console.log("entro if 3");
    velocityX = -velocityX * 0.5;
    velocityY = velocityY * 0.5;
    console.log("posx", posX);
    console.log("newx", newX);
    posX = 0;
    posY = newY;
    countJumps += 1;
    validateJumps();
    time = 0;
  }

  ball.style.left = newX + "px";
  ball.style.bottom = newY + "px";

  updateVelocityAngleChart();
  updateVelocityChart();
  updateTrajectoryData();

  time += timeStep;
};

let interval = 0;
btnLauch.addEventListener("click", () => {
  launchBall();
  interval = setInterval(() => {
    time += 0.1;
    moveBall();
  }, 10);
});

const updateVelocityAngleChart = () => {
  const finalSpeed = Math.sqrt(velocityX **2 + velocityY**2);
  const angleRad = Math.atan(velocityY / velocityX);
  const angleGrad = angleRad * (180/ Math.PI);
  velocityAngleData.labels.push(finalSpeed);
  velocityAngleData.datasets[0].data.push({ x: finalSpeed, y: angleGrad });
  velocityAngleChart.update();
};

const updateVelocityChart = () => {
  const newSpeed = Math.sqrt(velocityX ** 2 + velocityY ** 2);
  velocityData.labels.push(time);
  velocityData.datasets[0].data.push({ x: time, y: newSpeed });
  velocityChart.update();
};

const updateTrajectoryData = () => {
  trajectoryData.labels.push(newX);
  trajectoryData.datasets[0].data.push({ x: newX, y: newY });
  trajectoryChart.update();
};

btnShowGraph.addEventListener("click", () => {
  if (containerBall.classList.contains("hidden1")) {
    containerBall.classList.remove("hidden1");
    containerGraphs.classList.add("hidden1");
    btnShowGraph.textContent = "Ver Gráfica";
  } else {
    containerBall.classList.add("hidden1");
    containerGraphs.classList.remove("hidden1");
    btnShowGraph.textContent = "Reiniciar";
  }
});
