/**
 * Read JSON containing array of names for patterns
 */
var randomNames;
$.getJSON("first-names.json", function (json) {
    randomNames = json;
});

/**
 * Setup samples, then assign them to sample vars and prepare to play
 */
setupSample().then((samples) => {
    // Suspend Audio Context
    audioCtx.suspend();

    // Reset Sequencer and start scheduling
    setupSequencer();

    // Assign downloaded samples to global variables
    kick   = samples[0];
    snare  = samples[1];
    hihat  = samples[2];
    metro1 = samples[3];
    metro2 = samples[4];

    // Setup Background Pad
    setupPad(samples[5]);
    
    // Pre-render (hidden) player
    renderPlayer();
});