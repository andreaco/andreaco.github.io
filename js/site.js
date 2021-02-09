$('.ui.accordion')
  .accordion()
;

$('.menu .item')
  .tab()
;

$('.ui.sticky')
  .sticky({
    context: '#example1'
  })
;

$('.parametername')
  .popup()
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
    draw(beatNumber)
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

 function createParametersModel(){

    var parameterModel = {
        startingPopulation : document.getElementById("startingPopulationSlider").firstElementChild.value,
        finalPopulation : document.getElementById("numberOfFinalElementsSlider").firstElementChild.value,
        fitnessType : $('#fitnessTypeDropdown').dropdown('get value'),
        selectionType  : $('#selectionTypeDropdown').dropdown('get value'),
        crossoverType : $('#crossoverTypeDropdown').dropdown('get value'),
        mutationType : $('#mutationTypeDropdown').dropdown('get value'),
        crossoverProbability : document.getElementById("crossoverProbabilitySlider").firstElementChild.value,
        survivalRate : document.getElementById("survivalRateSlider").firstElementChild.value,
        mutationProbability : document.getElementById("mutationProbabilitySlider").firstElementChild.value,
    }
    return parameterModel;
 }


function initGeneticAlgorithm() {
    var nSeq = 3;
    var nStep = 16;
    var parametersModel = createParametersModel();
    GA = new GeneticAlgorithm(parametersModel.startingPopulation, nSeq, nStep);
    GA.fitnessSetup(parametersModel.fitnessType, parametersModel.finalPopulation); 
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

















let kickColor = '#b48ead'
let snareColor = '#bf616a'  
let hihatColor = '#ebcb8b'

let sequences = [kick_pattern, snare_pattern, hihat_pattern]


function drawEuclideanBase(ctx, w, h, radius, seq) {
  let center = [h/2, w/2]
  let theta = 0
  let x = center[0] + Math.cos(theta)*radius
  let y = center[1] + Math.sin(theta)*radius
  ctx.beginPath();
  ctx.strokeStyle = '#434c5e'
  ctx.lineWidth = 5;
  let firstPoint = -1;
  for(let i=0; i < seq.length; ++i) {

    if(firstPoint == -1) firstPoint = i

    theta = 2*Math.PI*i/seq.length
    x = center[0] + Math.cos(theta)*radius
    y = center[1] + Math.sin(theta)*radius

    ctx.lineTo(x, y);

  }
  if(firstPoint != -1) {
    theta = 2*Math.PI*firstPoint/seq.length
    x = center[0] + Math.cos(theta)*radius
    y = center[1] + Math.sin(theta)*radius

    ctx.lineTo(x, y);
  }
  ctx.stroke();
}

function drawEuclideanSteps(ctx, w, h, radius, count, seq, color) {
  // Active step
  let center = [h/2, w/2]
  let theta = 0
  let x = center[0] + Math.cos(theta)*radius
  let y = center[1] + Math.sin(theta)*radius
  for(let i=0; i < seq.length; ++i) {
    if(seq[i] > 0) {
      theta = 2*Math.PI*i/seq.length
      x = center[0] + Math.cos(theta)*radius
      y = center[1] + Math.sin(theta)*radius
      ctx.beginPath();
      if(i == count) {
        ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = '#a3be8c';
      }
      else {
        ctx.arc(x, y, 8, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
      }
      ctx.fill();
    }
  } 
}


function drawSequences(count) {
  // Canvas vars
  var canvas = document.getElementById('circles');
  var ctx = canvas.getContext('2d');

  // Utility vars
  var w = canvas.width;
  var h = canvas.height;
  var status = count / sequences[0].length

  var radius = 0.45 * w
  var center = [h/2, w/2]

  //Backgroun clear 
  ctx.clearRect(0, 0, w, h, radius);
  drawEuclideanBase(ctx, w, h, radius, sequences[0])
  drawEuclideanSteps(ctx, w, h, radius, count, sequences[0], kickColor)

  drawEuclideanBase(ctx, w, h, radius*0.7, sequences[1])
  drawEuclideanSteps(ctx, w, h, radius*0.7, count,sequences[1], snareColor)

  drawEuclideanBase(ctx, w, h, radius*0.4, sequences[2])
  drawEuclideanSteps(ctx, w, h, radius*0.4, count, sequences[2], hihatColor)
}

function drawBalance() {
  // Canvas vars
  var canvas = document.getElementById('balance');
  var ctx = canvas.getContext('2d');

  // Utility vars
  var w = canvas.width;
  var h = canvas.height;

  var radius = 0.45 * w
  var center = [h/2, w/2]

  ctx.clearRect(0, 0, w, h, radius);

  // Outer circle
  drawEuclideanBase(ctx, w, h, radius, sequences[0])

  drawBalanceCenter(ctx, w, h, radius, sequences[0], kickColor)
  drawBalanceCenter(ctx, w, h, radius, sequences[1], snareColor)
  drawBalanceCenter(ctx, w, h, radius, sequences[2], hihatColor)

  drawBalanceSteps(ctx, w, h, radius, sequences[0], kickColor, 14)
  drawBalanceSteps(ctx, w, h, radius, sequences[1], snareColor, 10)
  drawBalanceSteps(ctx, w, h, radius, sequences[2], hihatColor, 6)

}

function drawBalanceCenter(ctx, w, h, radius, seq, color) {
  var center = [h/2, w/2]

  let balanceX = 0;
  let balanceY = 0;
  let N = 0;

  for(let i=0; i < seq.length; ++i) {
    if(seq[i] > 0) {
      theta = 2*Math.PI*i/seq.length
      x = center[0] + Math.cos(theta)*radius
      y = center[1] + Math.sin(theta)*radius

      balanceX += x
      balanceY += y
      N+=1;
    }
  } 
  balanceX /= N
  balanceY /= N
  ctx.beginPath();
  ctx.arc(balanceX, balanceY, 10, 0, 2 * Math.PI, false);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = color
  ctx.lineWidth = 3;
  ctx.lineTo(center[0], center[1])
  ctx.lineTo(balanceX, balanceY);
  ctx.stroke();
}

function drawBalanceSteps(ctx, w, h, radius, seq, color, size) {
  // Active step
  let center = [h/2, w/2]
  let theta = 0
  let x = center[0] + Math.cos(theta)*radius
  let y = center[1] + Math.sin(theta)*radius
  for(let i=0; i < seq.length; ++i) {
    if(seq[i] > 0) {
      theta = 2*Math.PI*i/seq.length
      x = center[0] + Math.cos(theta)*radius
      y = center[1] + Math.sin(theta)*radius
      ctx.beginPath();


      ctx.arc(x, y, size, 0, 2 * Math.PI, false);
      ctx.fillStyle = color;

      ctx.fill();
    }
  } 
}

function drawEvenness() {
  // Canvas vars
  var canvas = document.getElementById('evenness');
  var ctx = canvas.getContext('2d');

  // Utility vars
  var w = canvas.width;
  var h = canvas.height;

  var radius = 0.45 * w;
  var center = [h/2, w/2];

  ctx.clearRect(0, 0, w, h, radius);

  drawColumn(ctx, w, h, w/5, 0.4, w*0/4, kickColor);
  drawColumn(ctx, w, h, w/5, 0.2, w*1/4, snareColor);
  drawColumn(ctx, w, h, w/5, 0.5, w*2/4, hihatColor);
  drawColumn(ctx, w, h, w/5, 0.9, w*3/4, "#00aaaa");
}

function drawEntropy() {
  // Canvas vars
  var canvas = document.getElementById('entropy');
  var ctx = canvas.getContext('2d');

  // Utility vars
  var w = canvas.width;
  var h = canvas.height;

  var radius = 0.45 * w;
  var center = [h/2, w/2];

  ctx.clearRect(0, 0, w, h, radius);

  drawColumn(ctx, w, h, w/5, 0.5, w*0/4, kickColor);
  drawColumn(ctx, w, h, w/5, 0.2, w*1/4, snareColor);
  drawColumn(ctx, w, h, w/5, 0.1, w*2/4, hihatColor);
  drawColumn(ctx, w, h, w/5, 0.4, w*3/4, "#00aaaa");
}


function drawColumn(ctx, w, h, rectwidth, amount, xstart, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  let ystart = h-amount*h;
  ctx.rect(xstart, ystart, rectwidth, h-ystart);
  ctx.fill();
}

function draw(count){
    drawSequences(count);
    drawBalance();
    drawEvenness();
    drawEntropy();
  }


