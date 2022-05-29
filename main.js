// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/88IvRVKpC/";

const flip = true;
let model, webcam, maxPredictions, aniNum;

const webcamContainer = document.getElementById("webcam-container"),
  resultContainer = document.getElementById("result-container"),
  btn = document.getElementById("start");

btn.onclick = start;

async function start() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    btn.classList.add("is-loading");
    
    // model
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // webcam
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup();

    await webcam.play();
    window.requestAnimationFrame(loop);

    webcamContainer.appendChild(webcam.canvas);
    resultContainer.hidden = true;

    // btn
    btn.textContent = '결과보기';
    btn.onclick = stop;
    btn.classList.remove("is-loading");
    btn.classList.add("is-link")
}

async function stop() {
    // webcam and container
    webcam.stop();
    resultContainer.style.opacity = 0;
    resultContainer.hidden = false;
    fadeIn(resultContainer);
    
    // btn
    btn.textContent = "다시하기";
    btn.onclick = re;
}

async function re() {
    // init
    webcamContainer.innerHTML = '';
    resultContainer.innerHTML = '';
    resultContainer.hidden = true;
    btn.classList.add("is-loading");

    // webcam
    webcam = new tmImage.Webcam(300, 300, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    webcamContainer.appendChild(webcam.canvas);
    resultContainer.hidden = true;

    // btn
    btn.textContent = '결과보기';
    btn.onclick = stop;
    btn.classList.remove("is-loading");
    btn.classList.add("is-link")
}

async function loop() {
    if (!resultContainer.hidden) return;
    webcam.update();
    await predict();
    requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    let datas = {};
    // get predictions
    for (let i = 0; i < maxPredictions; i++) {
        datas[i] = {
            name: prediction[i].className,
            value: prediction[i].probability.toFixed(2) * 100
        }
    }

    // progress
    const colors = ['primary', 'link', 'danger', 'warning'];
    let result = '';
    for (let i = 0; i < maxPredictions; i++) {
        result += `
        <p>${datas[i].name} <span style="font-size: 90%;">${datas[i].value.toFixed(2)}%</span></p>
        <progress class="progress is-${colors[i]} is-large" role="progressbar" value="${datas[i].value}" max="100"></progress>
        `;
    }
    resultContainer.innerHTML = result;
}
