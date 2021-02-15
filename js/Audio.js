const audioCtx = new AudioContext();


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
 * Function called to get the samples and return them as a list
 * @param {string} drumTheme Name of the sample theme to be downloaded
 */
async function setupSample(drumTheme) {

    let filePaths;
    if (drumTheme=='Percussive'){
        filePaths =  ['audio/perc_kick.wav',
                            'audio/perc_snare.wav',
                            'audio/perc_hihat.wav',
                            'audio/metronome1.wav',
                            'audio/metronome2.wav',
                            'audio/pad.mp3'];
    }
    else if(drumTheme=='Electronic'){
        filePaths =  ['audio/elec_kick.wav',
                            'audio/elec_snare.wav',
                            'audio/elec_hihat.wav',
                            'audio/metronome1.wav',
                            'audio/metronome2.wav',
                            'audio/pad.mp3'];
    }
    else {
        filePaths =  ['audio/kick.wav',
                            'audio/snare.wav',
                            'audio/hihat.wav',
                            'audio/metronome1.wav',
                            'audio/metronome2.wav',
                            'audio/pad.mp3'];
    }

    // Get the samples from specified path
    const samples = []
    for (let i=0; i < filePaths.length; ++i) {
        samples.push(await getFile(audioCtx, filePaths[i]));
    }
    return samples;
}

/**
 * Linear to exponential utility function
 * @param {float} linearGain Linear gain to be used 
 * @param {float} steepness  Steepness to be applied
 */
function linearToExp(linearGain, steepness) {
    let result = (Math.exp(steepness*linearGain) - 1) / (Math.exp(steepness) - 1);
    return result;
}


/**
 * Create and play a BufferSource from a custom AudioBuffer,
 * this function is used by the sequencer to play the audio samples
 * @param {AudioContext} audioContext The AudioContext object to be used
 * @param {AudioBuffer} audioBuffer The AudioBuffer in which the samples are stored
 */
function playSample(audioContext, audioBuffer, audioGain) {
    const sampleSource = audioContext.createBufferSource();
    const sampleGain   = audioContext.createGain();
    sampleSource.buffer = audioBuffer;
    sampleGain.gain.setValueAtTime(linearToExp(audioGain, 5), audioCtx.currentTime);
    sampleSource.playbackRate.setValueAtTime(1.0, audioCtx.currentTime);
    sampleSource.connect(sampleGain);
    sampleGain.connect(audioContext.destination);
    sampleSource.start();
    return sampleSource;
}

/**
 * Playback of background pad
 * @param {AudioBuffer} padSample 
 */
function setupPad (padSample) {
    var pad = audioCtx.createBufferSource();
    const padGain = audioCtx.createGain();
    padGain.gain.setValueAtTime(0.1, audioCtx.currentTime);

    pad.buffer = padSample;
    pad.connect(padGain).connect(audioCtx.destination);
    pad.start(0);
    pad.loop = true;
}

/**
 * These variables will be instantiated at Setup in "site.js"
 * These variables contains the samples to be used by the sequencer
 */
let kick;
let snare;
let hihat;
let metro1;
let metro2;