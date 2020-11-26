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
        btn.innerHTML = "Mute";
        audioCtx.resume();
    }
    else {
        btn.innerHTML = "Unmute"
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

    if (beatNumber % 16 === 0) playSample(audioCtx, metro1, 0.5);
    else if (beatNumber % 4 === 0) playSample(audioCtx, metro2, 0.5);

    if (kick_pattern[beatNumber] !== 0.0)
        playSample(audioCtx, kick, kick_pattern[beatNumber]);
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
offspring = new Offspring(5, steps);

 
/**
 * -------------------------------------------------------------------------
 * VIEW
 * -------------------------------------------------------------------------
 */

 /**
  * Function used to get votes from html and assign them to the population
  */
function setVotes() {
    for (let j = 0; j< html_object.length; j++){
        let vote = html_object[j].vote.value;
        offspring.pool[j].setVote(vote);
    }
}

/**
 * Function used to advance the generation and refresh the representation
 */
function advanceGeneration() {
    offspring.mating();
    for (let i = 0; i < html_object.length; ++i) {
        html_object[i].vote.value = 0;
    }
    render();
}

/**
 * Function used to assign 
 */
function setOnClick() {
    // Play Buttons
    for(let i = 0; i < html_object.length; i++){
        html_object[i].button.onclick = function() {
            assign_pattern(i)
        }
    }
    // Vote button
    let voteButton = document.getElementById("vote_btn");
    voteButton.onclick = setVotes;
    // Next generation button
    let nextGen = document.getElementById("next_gen");
    nextGen.onclick = advanceGeneration;
}

/**
 * Creates a global html_object that stores the references for
 * the interactive html elements for each element representation
 */
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

function createHtmlElement(index, n_steps) {
    let html_seq = '';
    for (let i = 0; i < n_steps; ++i) {
        //html_seq += '<div class="key"></div>'
        html_seq += '<div class="nes-icon is-small star is-empty"></div>'
    }
    let html = /*html*/
    `
        <button class="play_button nes-btn">Play n° ${index}</button>
        <input class="vote" type="number" value=0 min=0 max=10>
        <div class="seq">
            ${html_seq}
        </div>
    `;
    let div = document.createElement('div');
    div.id = 'element'+index;
    div.classList.add('nes-container', 'is-dark')
    div.classList.add('element', 'vertical-container');

    div.innerHTML = html;
    return div;
}

function addHtmlElements(n_elements) {
    let container = document.getElementById("playcontainer");
    
    for (let i = 0; i < n_elements; i++) {
        container.appendChild(createHtmlElement(i, steps))
    }
}

addHtmlElements(5);
getElementView();
setOnClick();

/** 
 * Render function
 */

function render() {

    for(let i=0; i<html_object.length; i++){
        // Set sequences
        let seq = Array.from(html_object[i].seq.children);
        seq.forEach(function(key, index) {    
            let patterns = offspring.pool;
            key.classList.toggle("is-empty", !patterns[i].sequence[index]);
        });
    }
}

/**
 * Change the displayed/current playback sequence
 * @param {number} index 
 */
function assign_pattern(index) {
    let patterns = offspring.pool;
    kick_pattern = patterns[index].sequence;
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
});