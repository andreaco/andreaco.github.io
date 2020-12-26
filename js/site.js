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
population = new Population(500, steps);


 
/**
 * -------------------------------------------------------------------------
 * VIEW
 * -------------------------------------------------------------------------
 */

  /**
  * Function used to gset the sliders
  */

 var slider = document.getElementById("myRange");
 var slider1 = document.getElementById("myRange1");
 var slider2 = document.getElementById("myRange2");
 var output = document.getElementById("demo");
 output.innerHTML = slider.value; // Display the default slider value
 
 // Update the current slider value (each time you drag the slider handle)
 slider.oninput = function() {
   output.innerHTML = this.value;
 }
 slider1.oninput = function() {
    output.innerHTML = this.value;
  }
  slider2.oninput = function() {
    output.innerHTML = this.value;
  }

 function updateTextInput(val) {
    document.getElementById('textInput').value=val;
  }
function updateTextInput1(val) {
    document.getElementById('textInput1').value=val;
  }
function updateTextInput2(val) {
    document.getElementById('textInput2').value=val;
  }



 /**
  * Function used to get votes from html and assign them to the population
  */
function setVotes() {
    for (let j = 0; j< html_object.length; j++){
        let vote = html_object[j].vote.value;
        population.pool[j].setVote(vote);
    }
}

/**
 * Function used to advance the generation and refresh the representation
 */
function advanceGeneration() {
    population.newGeneration();
    for (let i = 0; i < html_object.length; ++i) {
        html_object[i].vote.value = 0;
    }
    render();
}

function setAllElementDark() {
    for(let i = 0; i < html_object.length; i++){
        html_object[i].button.classList.toggle('background-gray', false)
    }
}

/**
 * Function used to assign 
 */
function setOnClick() {
    // Play Buttons
    for(let i = 0; i < html_object.length; i++){
        html_object[i].button.onclick = function() {
            setAllElementDark();
            html_object[i].button.classList.toggle('background-gray', true)
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
 * FIXME: Button is the entire div now
 */
// HTML Elements Array
let html_object = []
function getElementView(){
    let listElement = document.getElementById("playcontainer");
    let element = listElement.children;
    for(let i=0; i<element.length; i++){    
        let b = element[i].querySelector(".play_button");
        let v = element[i].querySelector(".vote");
        let s = element[i].querySelectorAll(".seq");
        let object = {
            button : element[i],
            vote : v,
            seq : s
        }
        html_object.push(object);
    }
}

function createHtmlElement(index, n_steps) {
    let html_seq = '';
    for (let i = 0; i < n_steps; ++i) {
        html_seq += 
                    '<div class="horizontal-container nes-icon is-small star is-empty"></div>'
    }
    let html = /*html*/
    `
        <p class="title">Pattern ${index}</p>
        <input class="vote" type="number" value=0 min=0 max=10>
        <div class="seq">
            ${html_seq}
        </div>
        <div class="seq">
            ${html_seq}
        </div>
        <div class="seq">
            ${html_seq}
        </div>
    `;
    let div = document.createElement('div');
    div.id = 'element'+index;
    div.classList.add('nes-container', 'is-dark', 'with-title')
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
        let seq = Array.from(html_object[i].seq[0].children);
        seq.forEach(function(key, index) {    
            let patterns =
            population.pool;
            key.classList.toggle("is-empty", !patterns[i].kickSeq[index]);
        });
        seq = Array.from(html_object[i].seq[1].children);
        seq.forEach(function(key, index) {    
            let patterns =
            population.pool;
            key.classList.toggle("is-empty", !patterns[i].snareSeq[index]);
        });
        seq = Array.from(html_object[i].seq[2].children);
        seq.forEach(function(key, index) {    
            let patterns =
            population.pool;
            key.classList.toggle("is-empty", !patterns[i].hihatSeq[index]);
        });
    }

    document.getElementById("numel").innerHTML = "Number of elements: " + population.pool.length;
    document.getElementById("numgen").innerHTML = "Generation #" + population.getGeneration();
}

/**
 * Change the displayed/current playback sequence
 * @param {number} index 
 */
function assign_pattern(index) {
    let patterns =
    population.pool;
    kick_pattern  = patterns[index].kickSeq;
    snare_pattern = patterns[index].snareSeq;
    hihat_pattern = patterns[index].hihatSeq;
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


