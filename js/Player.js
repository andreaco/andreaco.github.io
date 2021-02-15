let kick_button = document.getElementById('kick_button');
let snare_button = document.getElementById('snare_button');
let hihat_button = document.getElementById('hihat_button');
let metro_button = document.getElementById('metro_button');
let play_button = document.getElementById('play_button');

playing = false;
muteKick = true;
muteSnare = true;
muteHihat = true;
muteMetro = true;

/**
 * This function starts and stop the AudioContext and the sequencer
 */
function startAndStop() {
    //Toggle between start and stop
    if (playing) {
        audioCtx.suspend();
    }
    else {
        audioCtx.resume();
    }
    
    // GUI State variable
    playing = !playing;

    // Render
    renderPlayer();
}

/**
 * Mute/Unmute Kick sample
 */
function muteUnmuteKick() {
    muteKick = !muteKick;
    renderPlayer();
}

/**
 * Mute/Unmute Snare sample
 */
function muteUnmuteSnare() {
    muteSnare = !muteSnare;
    renderPlayer();
}

/**
 * Mute/Unmute Hihat sample
 */
function muteUnmuteHihat() {
    muteHihat = !muteHihat;
    renderPlayer();
}

/**
 * Mute/Unmute Metronome sample
 */
function muteUnmuteMetronome() {
    muteMetro = !muteMetro;
    renderPlayer();
}

/**
 * Assign the mute/unmute functions to relative buttons
 */
play_button.onclick  = startAndStop;
kick_button.onclick  = muteUnmuteKick;
snare_button.onclick = muteUnmuteSnare;
hihat_button.onclick = muteUnmuteHihat;
metro_button.onclick = muteUnmuteMetronome;


/**
 * Rendering function for player
 */
function renderPlayer() {
    if (muteKick) {
        kick_button.innerHTML = '<i class="volume off icon"></i>'
    }
    else {
        kick_button.innerHTML = '<i class="volume up icon"></i>'
    }


    if (muteSnare) {
        snare_button.innerHTML = '<i class="volume off icon"></i>'
    }
    else {
        snare_button.innerHTML = '<i class="volume up icon"></i>'
    }


    if (muteHihat) {
        hihat_button.innerHTML = '<i class="volume off icon"></i>'
    }
    else {
        hihat_button.innerHTML = '<i class="volume up icon"></i>'
    }


    if (muteMetro) {
        metro_button.innerHTML = '<i class="clock outline icon"></i>'
    }
    else {
        metro_button.innerHTML = '<i class="clock icon"></i>'
    }


    if (playing) {
        play_button.innerHTML = '<i class="pause circle icon"></i>'
    }
    else {
        play_button.innerHTML = '<i class="play circle outline icon"></i>'
    }

}

/**
 * Function used to reset the player GUI between one session and another
 */
function resetPlayer() {
    // Stop AudioContext
    audioCtx.suspend();

    // Reset View Variables
    playing   = false;
    muteKick  = true;
    muteSnare = true;
    muteHihat = true;
    muteMetro = true;


    // Reset Sequencer
    currentNote = 0;

    // Empty Patterns
    kick_pattern  = Array(steps).fill(0);
    snare_pattern = Array(steps).fill(0);
    hihat_pattern = Array(steps).fill(0);

    // Empty Pattern List
    let patternMenu = document.getElementById('patternSelectionDiv');
    patternMenu.innerHTML = "";

    // Reset Player
    renderPlayer();
}