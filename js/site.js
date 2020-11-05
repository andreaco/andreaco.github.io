///////////////
// PLAY NOISE 
///////////////
let bandpassfreq = 2000
function playNoise() {
    const bufferSize = audioCtx.sampleRate * 0.02; // set the time of the note
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate); // create an empty buffer
    let data = buffer.getChannelData(0); // get data

    // fill the buffer with noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    // create a buffer source for our created data
    let noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    let bandpass = audioCtx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.value = bandpassfreq;
    bandpass.Q = 2;

    // connect our graph
    noise.connect(bandpass).connect(audioCtx.destination);
    noise.start();
}


// Get Sample Files
async function getFile(audioContext, filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

// Setup samples before playing
async function setupSample() {
    const filePaths = ['kick.wav',
                       'snare.wav',
                       'hihat.wav'];
    const samples = []
    for (let i=0; i < filePaths.length; ++i) {
        console.log(filePaths[i])
        samples.push(await getFile(audioCtx, filePaths[i]));
    }
    return samples;
}

////////////////
// Play Sample /
////////////////
function playSample(audioContext, audioBuffer) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.playbackRate.setValueAtTime(1.0, audioCtx.currentTime);
    sampleSource.connect(audioContext.destination)
    sampleSource.start();
    return sampleSource;
}


////////////////////////////
// Audio Context Parametrs
////////////////////////////
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

let tempo = 120.0;

let steps = 8

let lookahead = 1.0; // How frequently to call scheduling function (in milliseconds)
let scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

let currentNote = 0;
let nextNoteTime = 0.0; // when the next note is due.

// Sequencing Parameters
function nextNote() {
    // 16th sequencer 0.25 * (60 / tempo)
    const secondsPerBeat = 0.25 * (60.0 / tempo);

    nextNoteTime += secondsPerBeat; // Add beat length to last beat time

    // Advance the beat number, wrap to zero
    currentNote++;
    if (currentNote === steps) {
            currentNote = 0;
    }
}


// Patterns Model
const notesInQueue = [];

kick_pattern  = [false, false, false, false, false, false, false, false]
snare_pattern = [false, false, false, false, false, false, false, false]
hihat_pattern = [false, false, false, false, false, false, false, false]

// Pattern Sequencing
let kick;
let snare;
let hihat;
function scheduleNote(beatNumber, time) {

    // push the note on the queue, even if we're not playing.
    notesInQueue.push({ note: beatNumber, time: time });

    if (kick_pattern[beatNumber])
        playSample(audioCtx, kick);
    if (hihat_pattern[beatNumber])
        playSample(audioCtx, hihat);
    if (snare_pattern[beatNumber])
        playSample(audioCtx, snare);

    //else bandpassfreq = 500*Math.random()
   // playNoise();
    counter.innerText = beatNumber;
}

function generatePattern() {
    for(let i=0; i < kick_pattern.length; ++i) {
        kick_pattern [i] = (i%4 == 0) ? Math.random() < 0.5 : Math.random() < 0.1;
    }
}

generate.onclick = generatePattern;



 // Scheduler
function scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime ) {
        scheduleNote(currentNote, nextNoteTime);
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
}


// Start/Stop
function start() {
    
    if (audioCtx.state === 'suspended') {
        console.log("Start!")
        audioCtx.resume();
    }
    else {
        console.log("Stop!")
        audioCtx.suspend();
    }
}

// Prepare to play
setupSample().then((samples) => {
        currentNote = 0;
        nextNoteTime = audioCtx.currentTime;
        scheduler(); // kick off scheduling


        kick = samples[0]
        snare = samples[1]
        hihat = samples[2]
        audioCtx.resume();
        counter.onclick = start; 
});


