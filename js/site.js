

/**
 * -------------------------------------------------------------------------
 * AUDIO CONTEXT
 * -------------------------------------------------------------------------
 */



/**
 * Suspend/Resume the AudioContext
 */
function start() {
    if (playing) {
        audioCtx.suspend();
    }
    else {
        audioCtx.resume();
    }
    playing = !playing;

    renderPlayer();
}

play_button.onclick = start;

kick_button.onclick = function () {
    muteKick = !muteKick;
    renderPlayer();
}
snare_button.onclick = function () {
    muteSnare = !muteSnare;
    renderPlayer();
}
hihat_button.onclick = function () {
    muteHihat = !muteHihat;
    renderPlayer();
}
metro_button.onclick = function () {
    muteMetro = !muteMetro;
    renderPlayer();
}


/**
 * -------------------------------------------------------------------------
 * SEQUENCER
 * -------------------------------------------------------------------------
 *  TODO: Document and test different parameters for the best performance
 */

// Tempo
let tempo = 120.0;              // BPM
let steps = 16;                 // Number of Steps
let basenote = 1 / 16;            // Base note measure (quarters, eights, sixteenths etc)
// Performance
let lookahead = 1.0;            // How frequently to call scheduling function (in milliseconds)
let scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
// Sequencing Variables
let currentNote = 0;            // Init current note to 0
let nextNoteTime = 0.0;         // When the next note is due.
//Currently Playing / Currently Displayed Pattern
kick_pattern = Array(steps).fill(0.0)
snare_pattern = Array(steps).fill(0.0)
hihat_pattern = Array(steps).fill(0.0)

playing   = false;
muteKick  = true;
muteSnare = true;
muteHihat = true;
muteMetro = true;

/**
 * Advance note in sequence and schedule it in time
 */
function nextNote() {
    // 4 * (60 / tempo) means 1 beat per measure
    const secondsPerBeat = (4 * basenote) * (60.0 / tempo);
    // Add beat length to last beat time
    nextNoteTime += secondsPerBeat;
    // Advance the beat number, wrap to zero
    currentNote++;
    if (currentNote === steps) {
        currentNote = 0;
    }
}


/**
 * Play scheduled note in the sequence
 * @param {number} beatNumber Current Beat Number
 * @param {number} time Time in which the note is scheduled
 */
function scheduleNote(beatNumber, time) {
    draw(beatNumber);

    if (!muteMetro) {
        if (beatNumber % 16 === 0) playSample(audioCtx, metro1, 0.5);
        else if (beatNumber % 4 === 0) playSample(audioCtx, metro2, 0.5);
    }

    if (!muteKick && kick_pattern[beatNumber] !== 0.0)
        playSample(audioCtx, kick, kick_pattern[beatNumber]);
    if (!muteSnare && snare_pattern[beatNumber] !== 0.0)
        playSample(audioCtx, snare, snare_pattern[beatNumber]);
    if (!muteHihat && hihat_pattern[beatNumber] !== 0.0)
        playSample(audioCtx, hihat, hihat_pattern[beatNumber]);

}


/**
 * Scheduler responsible for playing sequencer notes
 */
function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime) {
        scheduleNote(currentNote, nextNoteTime);
        nextNote();
    }
    timerID = window.setTimeout(scheduler, lookahead);
}

/**
 * -------------------------------------------------------------------------
 * GENETIC STUFF
 * -------------------------------------------------------------------------
 */


var GA = undefined;

//TODO: firstElementChild.FirstElementChild sistemare html con id su slider
function createParametersModel(){
    var parameterModel = {
        startingPopulation : document.getElementById("startingPopulationSlider").value,
        finalPopulation : 10,
        fitnessType : $('#fitnessTypeDropdown').dropdown('get value'),
        selectionType  : $('#selectionTypeDropdown').dropdown('get value'),
        crossoverType : $('#crossoverTypeDropdown').dropdown('get value'),
        mutationType : $('#mutationTypeDropdown').dropdown('get value'),
        crossoverProbability : document.getElementById("crossoverProbabilitySlider").value,
        survivalRate : document.getElementById("survivalRateSlider").value,
        mutationProbability : document.getElementById("mutationProbabilitySlider").value,
    }
    return parameterModel;
 }


var finalPool;
function initGeneticAlgorithm() {
    var nSeq = 3;
    var nStep = 16;
    var parametersModel = createParametersModel();
    console.log(parametersModel);

    GA = new GeneticAlgorithm(parametersModel.startingPopulation, nSeq, nStep);
    
    GA.fitnessSetup(parametersModel.fitnessType, parametersModel.finalPopulation);
    GA.selectionSetup(parametersModel.selectionType, parametersModel.survivalRate / 100);
    GA.crossoverSetup(parametersModel.crossoverType, parametersModel.crossoverProbability / 100);
    GA.mutationSetup(parametersModel.mutationType, parametersModel.mutationProbability / 100);

    
    finalPool = GA.start();
    
    
    if(finalPool.length == 0) {
        $(".errormodal").modal('show');
        
    }
    else {

        renderPatternWindow();
    }
}


/**
 * -------------------------------------------------------------------------
 * STARTUP CODE
 * -------------------------------------------------------------------------
 */

/**
 * Setup samples, then assign them to sample vars and prepare to play
 */
setupSample().then((samples) => {
    audioCtx.suspend();

    currentNote = 0;                        // Start sequence from 0
    nextNoteTime = audioCtx.currentTime;    // First note time
    scheduler();                            // Start scheduling

    // Sample Variable Instantiation <0>
    kick = samples[0]; snare = samples[1]; hihat = samples[2];
    metro1 = samples[3]; metro2 = samples[4];

    
    var pad = audioCtx.createBufferSource();
    const padGain = audioCtx.createGain();
    padGain.gain.setValueAtTime(0.1, audioCtx.currentTime);

    pad.buffer = samples[5];
    pad.connect(padGain).connect(audioCtx.destination);
    pad.start(0);
    pad.loop = true;
    

    renderPlayer();
});

var randomNames;
$.getJSON("first-names.json", function(json) {
    randomNames = json;
});

function resetPlayer() {    
    audioCtx.suspend();

    kick_pattern = Array(steps).fill(0);
    snare_pattern = Array(steps).fill(0);
    hihat_pattern = Array(steps).fill(0);

    let patternMenu = document.getElementById('patternSelectionDiv');
    patternMenu.innerHTML = "";

    renderPlayer();
}

function renderPlayer() {
    let kick_button   = document.getElementById('kick_button');
    let snare_button  = document.getElementById('snare_button');
    let hihat_button  = document.getElementById('hihat_button');
    let metro_button  = document.getElementById('metro_button');
    let play_button  = document.getElementById('play_button');

    if(muteKick) {
        kick_button.innerHTML = '<i class="volume off icon"></i>'
    }
    else {
        kick_button.innerHTML = '<i class="volume up icon"></i>'
    }


    if(muteSnare) {
        snare_button.innerHTML = '<i class="volume off icon"></i>'
    }
    else {
        snare_button.innerHTML = '<i class="volume up icon"></i>'
    }


    if(muteHihat) {
        hihat_button.innerHTML = '<i class="volume off icon"></i>'
    }
    else {
        hihat_button.innerHTML = '<i class="volume up icon"></i>'
    }


    if(muteMetro) {
        metro_button.innerHTML = '<i class="clock outline icon"></i>'
    }
    else {
        metro_button.innerHTML = '<i class="clock icon"></i>'
    }


    if(playing) {
        play_button.innerHTML = '<i class="pause circle icon"></i>'
    }
    else {
        play_button.innerHTML = '<i class="play circle outline icon"></i>'
    }

}



document.getElementById("start_process_button").onclick = initGeneticAlgorithm; 