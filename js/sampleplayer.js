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
    const filePaths = ['kick.wav',
                       'snare.wav',
                       'hihat.wav'];
    const samples = []
    for (let i=0; i < filePaths.length; ++i) {
        console.log("Loading: " + filePaths[i] + "...")
        samples.push(await getFile(audioCtx, filePaths[i]));
    }
    return samples;
}

/**
 * Create and play a BufferSource from a custom AudioBuffer
 * @param {AudioContext} audioContext The AudioContext object to be used
 * @param {AudioBuffer} audioBuffer The AudioBuffer in which the samples are stored
 */
function playSample(audioContext, audioBuffer) {
    const sampleSource = audioContext.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.playbackRate.setValueAtTime(1.0, audioCtx.currentTime);
    sampleSource.connect(audioContext.destination)
    sampleSource.start();
    return sampleSource;
}

/**
 * These variables will be instantiated at Setup in "site.js"
 */
let kick;
let snare;
let hihat;