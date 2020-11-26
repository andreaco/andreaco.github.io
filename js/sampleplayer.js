/**
 * Get audio files from path
 * @param {AudioContext} audioContext The AudioContext object to be used
 * @param {string} filepath The filepath in which the files are stored
 */
async function getFile(audioContext, filepath) {
    const response    = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
}

/**
 * Setup and return the samples array
 */
async function setupSample() {
    const filePaths = ['audio/kick.wav',
                       'audio/snare.wav',
                       'audio/hihat.wav',
                       'audio/metronome1.wav',
                       'audio/metronome2.wav'];
    const samples = []
    for (let i=0; i < filePaths.length; ++i) {
        console.log("Loading: " + filePaths[i] + "...")
        samples.push(await getFile(audioCtx, filePaths[i]));
    }
    return samples;
}

function linearToExp(linearGain, steepness){
    let result = (Math.exp(steepness*linearGain) - 1) / (Math.exp(steepness) - 1);
    return result;
}

/**
 * Create and play a BufferSource from a custom AudioBuffer
 * @param {AudioContext} audioContext The AudioContext object to be used
 * @param {AudioBuffer} audioBuffer The AudioBuffer in which the samples are stored
 */
function playSample(audioContext, audioBuffer, audioGain) {
    const sampleSource = audioContext.createBufferSource();
    const sampleGain = audioContext.createGain();
    sampleSource.buffer = audioBuffer;
    sampleGain.gain.setValueAtTime(linearToExp(audioGain, 5), audioCtx.currentTime);
    sampleSource.playbackRate.setValueAtTime(1.0, audioCtx.currentTime);
    sampleSource.connect(sampleGain);
    sampleGain.connect(audioContext.destination);
    sampleSource.start();
    return sampleSource;
}

/**
 * These variables will be instantiated at Setup in "site.js"
 */
let kick;
let snare;
let hihat;
let metro1;
let metro2;