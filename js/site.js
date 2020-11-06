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
kick_pattern  = Array(steps).fill(false)

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

    if (kick_pattern[beatNumber])
        playSample(audioCtx, kick);
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
    Array(steps).fill(false),
    Array(steps).fill(false),
    Array(steps).fill(false),
    Array(steps).fill(false),
    Array(steps).fill(false)
]

/**
 * Generate a random population of patterns
 */
function generatePattern() {
    for(let i=0; i < patterns.length; ++i) {
        for(let j=0; j < patterns[i].length; ++j) {
            patterns[i][j] = Math.random() < 0.5;
        }
    }
}


/**
 * -------------------------------------------------------------------------
 * VIEW
 * -------------------------------------------------------------------------
 */
// Current sequencer position
tick = 0;
// Keys Array
keys = document.querySelectorAll(".key");
/**
 * Render function
 */
function render() {
  keys.forEach(function(key, index) {
    key.classList.toggle("selected", index == tick);
    key.firstElementChild.classList.toggle("active-circle", kick_pattern[index]);
  })
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
play_buttons = document.querySelectorAll(".play_button");
play_buttons.forEach(function(button, index) {
    button.onclick = function() {
        assign_pattern(this.id.slice(-1))
    }
});

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