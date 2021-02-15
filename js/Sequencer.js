// Tempo
let tempo = 120.0;              // BPM
let steps = 16;                 // Number of Steps
let basenote = 1 / 16;          // Base note measure (quarters, eights, sixteenths etc)

// Performance
let lookahead = 1.0;            // How frequently to call scheduling function (in milliseconds)
let scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)

// Sequencing Variables
let currentNote = 0;            // Init current note to 0
let nextNoteTime = 0.0;         // When the next note is due.

//Currently Playing / Currently Displayed Patterns
kick_pattern  = Array(steps).fill(0.0);
snare_pattern = Array(steps).fill(0.0);
hihat_pattern = Array(steps).fill(0.0);

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
    // Update canvas
    draw(beatNumber);

    // Metronome
    if (!muteMetro) {
        if (beatNumber % 16 === 0) playSample(audioCtx, metro1, 1);
        else if (beatNumber % 4 === 0) playSample(audioCtx, metro2, 1);
    }

    // Samples
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
 * Initialize the sequencer
 */
function setupSequencer() {
    currentNote = 0;
    nextNoteTime = audioCtx.currentTime;
    scheduler();
}