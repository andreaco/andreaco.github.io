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

    if (kick_pattern[beatNumber] !== 0.0)
        playSample(audioCtx, kick, kick_pattern[beatNumber]);
    if (beatNumber==0){
        playSample(audioCtx, snare, 0.5);
    }
    else if (beatNumber%2 ==0){
        playSample(audioCtx, hihat, 0.5);
    }
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

offspring = new Offspring(5, steps);

/**
 * Generate a random population of patterns
 */

/**
 * -------------------------------------------------------------------------
 * VIEW
 * -------------------------------------------------------------------------
 */

// HTML Elements Array

let html_object = []


function setOnClick(){
    for(let i=0; i<html_object.length; i++){
        html_object[i].button.onclick = function() {
            assign_pattern(i)
        }
    }
    let voteButton = document.getElementById("vote_btn");
    voteButton.onclick = function(){
        for (let j = 0; j< html_object.length; j++){
            let vote = html_object[j].vote.value;
            offspring.getPool()[j].setVote(vote);
            console.log(offspring.getPool()[j])
        }
    }
    let nextGen = document.getElementById("next_gen");
    nextGen.onclick = function(){
        offspring.mating();
        render();
    }
}

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
setOnClick()

/**
 * Render function
 */

function render() {
  for(let i=0; i<html_object.length; i++){
    let seq = Array.from(html_object[i].seq.children);
    seq.forEach(function(key, index) {    
        let patterns = offspring.getPool();
        key.firstElementChild.classList.toggle("active-circle", patterns[i].getSequence()[index]);
    });
  }
}

/**
 * Change the displayed/current playback sequence
 * @param {number} index 
 */
function assign_pattern(index) {
    let patterns = offspring.getPool();
    kick_pattern = patterns[index].getSequence();
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
        
        start_button.onclick = start; 
        audioCtx.resume();
});