$('.ui.accordion')
  .accordion()
;

$('.menu .item')
  .tab()
;

/**
 * -------------------------------------------------------------------------
 * AUDIO CONTEXT
 * -------------------------------------------------------------------------
 */
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
/**
 * Suspend/Resume the AudioContext
 */
function start() {
    let btn = document.getElementById("start_button");

    btn.classList.toggle("is-success", audioCtx.state === 'suspended')
    btn.classList.toggle("is-error",   audioCtx.state === 'running')

    if (audioCtx.state === 'suspended') {
        btn.innerHTML = "Stop";
        audioCtx.resume();
    }
    else {
        btn.innerHTML = "Play"
        audioCtx.suspend();
    }
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
let basenote = 1/16;            // Base note measure (quarters, eights, sixteenths etc)
// Performance
let lookahead = 1.0;            // How frequently to call scheduling function (in milliseconds)
let scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
// Sequencing Variables
let currentNote = 0;            // Init current note to 0
let nextNoteTime = 0.0;         // When the next note is due.
//Currently Playing / Currently Displayed Pattern
kick_pattern   = Array(steps).fill(0.0)
snare_pattern  = Array(steps).fill(0.0)
hihat_pattern  = Array(steps).fill(0.0)

unmuteKick  = false
unmuteSnare = false
unmuteHihat = false
unmuteMetro = false

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

    if (unmuteMetro) {
        if (beatNumber % 16 === 0) playSample(audioCtx, metro1, 0.5);
        else if (beatNumber % 4 === 0) playSample(audioCtx, metro2, 0.5);
    }

    if (unmuteKick  && kick_pattern[beatNumber] !== 0.0)
        playSample(audioCtx,  kick, kick_pattern[beatNumber]);
    if (unmuteSnare && snare_pattern[beatNumber] !== 0.0)
        playSample(audioCtx, snare, snare_pattern[beatNumber]);
    if (unmuteHihat && hihat_pattern[beatNumber] !== 0.0)
        playSample(audioCtx, hihat, hihat_pattern[beatNumber]);
    
}


/**
 * Scheduler responsible for playing sequencer notes
 */
function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < audioCtx.currentTime + scheduleAheadTime ) {
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


/**
 *
 * // INITIALIZE SECTION
 *          numberOfStartingElements = Number of starting elements
 *          fitnessName = Type of fitness (string)
 *          finalElements = Number of final elements
 * 
 * // SELECTION SECTION
 *          Type of selection (string)
 *          Survival rate %
 * 
 * // CROSSOVER SECTION
 *          Type of crossover (string)
 *          crossover probability %
 * 
 * // MUTATION SECTION
 *          Type of mutation (string)
 *          Mutation probability %
 */

 /**
  * > User press start
  * > Gather parameters from GUI forms
  * 
  * GA = new GeneticAlgorithm(numberOfStartingElements, numberOfSequences=3, numberOfSteps=16)
  * GA.fitnessSetup(fitnessName, finalElements)
  * GA.selectionSetup(...)
  * GA.crossoverSetup(...)
  * GA.mutationSetup(...)
  * 
  * GA.start()
  * > Wait GA to finish
  * > Display GA._population to user
  * 
  * 
  * 
  * 

    GA = new GeneticAlgorithm(10)
    GA.fitnessSetup("FitnessStrategy1", 10)
    GA.selectionSetup("RouletteWheelStochasticAcceptance", 0.9)
    GA.computeScores()
    GA._selectionFunction.compute(GA._population, 0.9)
  */

var GA = undefined;
function initGeneticAlgorithm() {
    var nSeq = 3;
    var nStep = 16;
    var parametersModel = createParametersModel();
    GA = new GeneticAlgorithm(parametersModel.startingPopulation, nSeq, nStep);
    GA.fitnessSetup(parametersModel.fitnessType, 10); // Final elements hardcoded to 10
    GA.selectionSetup(parametersModel.selectionType, parametersModel.survivalRate / 100);
    GA.crossoverSetup(parametersModel.crossoverType, parametersModel.crossoverProbability / 100);
    GA.mutationSetup(parametersModel.mutationType, parametersModel.mutationProbability / 100);

    GA.start();
}


/**
 * -------------------------------------------------------------------------
 * STARTUP CODE
 * -------------------------------------------------------------------------
 */
// First render
render();

/**
 * Setup samples, then assign them to sample vars and prepare to play
 */
setupSample().then((samples) => {
        currentNote = 0;                        // Start sequence from 0
        nextNoteTime = audioCtx.currentTime;    // First note time
        scheduler();                            // Start scheduling

        // Sample Variable Instantiation <0>
        kick  = samples[0]; snare = samples[1]; hihat = samples[2];
        metro1 = samples[3]; metro2 = samples[4]; 
        
        audioCtx.suspend();
        start_button.onclick = start; 
        kick_button.onclick = function() {
            kick_button.classList.toggle("is-success", !unmuteKick)
            kick_button.classList.toggle("is-error",  unmuteKick)
            unmuteKick = !unmuteKick
        }
        snare_button.onclick = function() {
            snare_button.classList.toggle("is-success", !unmuteSnare)
            snare_button.classList.toggle("is-error",  unmuteSnare)
            unmuteSnare = !unmuteSnare
        }
        hihat_button.onclick = function() {
            hihat_button.classList.toggle("is-success", !unmuteHihat)
            hihat_button.classList.toggle("is-error",   unmuteHihat)
            unmuteHihat = !unmuteHihat
        }
        metro_button.onclick = function() {
            metro_button.classList.toggle("is-success", !unmuteMetro)
            metro_button.classList.toggle("is-error",   unmuteMetro)
            unmuteMetro = !unmuteMetro
        }
});


