// More API functions here:
// https://github.com/googlecreativelab/teachablemachine-community/tree/master/libraries/image

// the link to your model provided by Teachable Machine export panel
const URL = "https://teachablemachine.withgoogle.com/models/88IvRVKpC/";

const flip = true;
let model, webcam, webcamContainer, resultContainer, maxPredictions, aniNum, btn;

document.getElementById("start").onclick = start;

// Load the image model and setup the webcam
async function start() {
    // == loading ==
    document.getElementById("start").classList.add("is-loading");
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);

    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam

    await webcam.play();
    window.requestAnimationFrame(loop);

    webcamContainer = document.getElementById("webcam-container");
    webcamContainer.appendChild(webcam.canvas);
    resultContainer = document.getElementById("result-container");
    resultContainer.hidden = true;

    // btn
    btn = document.getElementById("start");
    btn.textContent = '결과보기';
    btn.onclick = stop;
    btn.classList.remove("is-loading");
    btn.classList.add("is-link")
}

function sleep(ms) {
  const wakeUpTime = Date.now() + ms;
  while (Date.now() < wakeUpTime) {}
}

async function stop() {
    // webcam stop and show
    webcam.stop();
    resultContainer.style.opacity = 0;
    resultContainer.hidden = false;
    fadeIn(resultContainer);

    // re?
    btn.textContent = "다시하기";
    btn.onclick = re;
}

async function re() {
    webcamContainer.innerHTML = '';
    resultContainer.innerHTML = '';
    resultContainer.hidden = true;
    btn.classList.add("is-loading");

    webcam = new tmImage.Webcam(300, 300, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    webcamContainer.appendChild(webcam.canvas);
    resultContainer.hidden = true;

    // btn
    btn = document.getElementById("start");
    btn.textContent = '결과보기';
    btn.onclick = stop;
    btn.classList.remove("is-loading");
    btn.classList.add("is-link")
}

async function loop() {
    if (!resultContainer.hidden) return;
    webcam.update(); // update the webcam frame
    await predict();
    requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);
    let datas = {};
    for (let i = 0; i < maxPredictions; i++) {
        datas[i] = {
            name: prediction[i].className,
            value: prediction[i].probability.toFixed(2) * 100
        }
    }
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
