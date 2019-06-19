// import 'jStat';

// Initialize the page
const mu = 0.0;
// Initialize confidence level field
const confidenceLevelField = document.getElementById('confidenceLevel');
confidenceLevelField.addEventListener('input', confidenceLevelChange);
let confidenceLevelValue = confidenceLevelField.value;
// Initialize sigma field
const sigmaField = document.getElementById('sigma');
sigmaField.addEventListener('input', sigmaChange);
let sigmaValue = sigmaField.value;
// Initialize sample size field
const sampleSizeField = document.getElementById('sampleSize');
sampleSizeField.addEventListener('input', sampleSizeChange);
let sampleSizeValue = sampleSizeField.value;
// Initialize random numbers
const numIntervals = 100;
// Initialize confidence interval plot
const canvas = document.getElementById('canvas');
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const cntxt = canvas.getContext('2d');
const bgColor = 'white';
const fgColor = 'black';
const fgColorOn = 'black';
const fgColorOff = 'red';
const deltaY = Math.floor(canvas.height / numIntervals);
const midX = canvas.width / 2;

redrawIntervals();

function confidenceLevelChange(ev) {
    const textContent = ev.srcElement.value;
    const number = Number.parseFloat(textContent);
    if (!Number.isNaN(number) && 0 < number && number < 100) {
        confidenceLevelValue = number;
        // confidenceIntervals.innerText = `CL = ${confidenceLevel}`;
        redrawIntervals();
    }
}

function sigmaChange(ev) {
    const textContent = ev.srcElement.value;
    const number = Number.parseFloat(textContent);
    if (!Number.isNaN(number) && 0 < number) {
        sigmaValue = number;
        // confidenceIntervals.innerText = `sigma = ${sigma}`;
        redrawIntervals();
    }
}

function sampleSizeChange(ev) {
    const textContent = ev.srcElement.value;
    const number = Number.parseInt(textContent);
    if (!Number.isNaN(number) && 0 < number) {
        sampleSizeValue = number;
        // confidenceIntervals.innerText = `n = ${sampleSize}`;
        redrawIntervals();
    }
}

function redrawIntervals() {
    cntxt.fillStyle = bgColor;
    cntxt.fillRect(0, 0, canvas.width, canvas.height);
    const stdErr = sigmaValue / Math.sqrt(sampleSizeValue);
    const critVal = -jStat.normal.inv((1 - confidenceLevelValue / 100) / 2, 0, 1);
    const marginErr = stdErr * critVal;
    let y = 1;
    cntxt.strokeStyle = fgColor;
    cntxt.beginPath();
    cntxt.moveTo(canvas.width/2, 0);
    cntxt.lineTo(canvas.width/2, canvas.height);
    cntxt.stroke();
    for (let i = 0; i < numIntervals; i++) {
        const average = jStat.normal.sample(0, stdErr);
        const ciCenter = midX + average;
        y += deltaY;
        cntxt.strokeStyle = Math.abs(average) < marginErr ?
            fgColorOn : fgColorOff;
        cntxt.beginPath();
        cntxt.moveTo(ciCenter - marginErr, y);
        cntxt.lineTo(ciCenter + marginErr, y);
        cntxt.stroke();
    }
}
