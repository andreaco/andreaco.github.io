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
    if (audioCtx.state === 'suspended') {
        console.log("Start!");
        audioCtx.resume();
    }
    else {
        console.log("Stop!");
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
kick_pattern  = Array(steps).fill(0.0)

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
    next_tick(beatNumber);

    if (kick_pattern[beatNumber] !== 0.0)
        playSample(audioCtx, kick, kick_pattern[beatNumber]);
}


/**
 * Scheduler responsible for playing sequencer notes
 */
function scheduler() {
    // while there are notes that will need to play before the next interval, schedule them and advance the pointer.
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
 * FIXME: Temporary Solution
 */


patterns = [
    Array(steps).fill(0.0),
    Array(steps).fill(0.0),
    Array(steps).fill(0.0),
    Array(steps).fill(0.0),
    Array(steps).fill(0.0)
]

/**
 * Generate a random population of patterns
 */
function generatePattern() {
    for(let i=0; i < patterns.length; ++i) {
        for(let j=0; j < patterns[i].length; ++j) {
            if (Math.random()< 0.5){
                let velocity = Math.random();
                patterns[i][j] = velocity;
            }
        }
    }
}

function matingAlternate(patternA, patternB, index = 1){ 
    let childPattern = patternA.slice();
    for(let i = index; i<childPattern.length; i+=2*index){
        for (let j = 0 ; j< index; j++){
            childPattern[i+j] = patternB[i+j]; 
        }
    }
    return childPattern;
}

function matingAnd(patternA, patternB){
    let childPattern = Array(patternA.length).fill(0.0);
    for (let i = 0; i < childPattern.length; i++){
        if(patternA[i]&&patternB[i]){
            childPattern[i] = patternA[i];
        }
    }
    return childPattern;
} 

/**
 * -------------------------------------------------------------------------
 * VIEW
 * -------------------------------------------------------------------------
 */
// Current sequencer position
tick = 0;

// HTML Elements Array

let html_object = []



function getElementView(){
    let listElement = document.getElementById("playcontainer");
    let element = listElement.children;
    for(let i=0; i<element.length; i++){    
        let b = element[i].querySelector(".play_button");
        let v = element[i].querySelector(".vote");
        let s = element[i].querySelector(".seq");
        let object = {
            button : b,
            vote : v,
            seq : s
        }
        html_object.push(object);
    }
}

getElementView()

/**
 * Render function
 */
function render() {
  for(let i=0; i<html_object.length; i++){
    let seq = Array.from(html_object[i].seq.children);
    seq.forEach(function(key, index) {      
        key.firstElementChild.classList.toggle("active-circle", patterns[i][index]);
    });
  }
}

/**
 * Change the displayed/current playback sequence
 * @param {number} index 
 */
function assign_pattern(index) {
    kick_pattern = patterns[index];
}

/**
 * Temporary display and playback of sequence
 * FIXME: Find a better way to get the wanted index (now it's done by taking the last id character as index)
 */

/*play_buttons = document.querySelectorAll(".play_button");
play_buttons.forEach(function(button, index) {
    button.onclick = function() {
        assign_pattern(this.id.slice(-1))
    }
});*/


for(let i=0; i<html_object.length; i++){
    html_object[i].button.onclick = function() {
        assign_pattern(i)
    }
}


// Advance displayed sequencer
function next_tick(step) {
  tick = step;
  render();
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
        
        generatePattern();
        start_button.onclick = start; 
        audioCtx.resume();
});