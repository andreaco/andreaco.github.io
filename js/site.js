/**
 * Read JSON containing array of names for patterns
 */
var randomNames;
$.getJSON("resources/first-names.json", function (json) {
    randomNames = json;
});

/**
 * Function used to retrieve the parameters from sliders and dropdown menus
 * Returns an object containing all of them
 */
function createParametersModel() {
    var parameterModel = {
        startingPopulation: document.getElementById("startingPopulationSlider").value,
        finalPopulation: 10,
        fitnessType: $('#fitnessTypeDropdown').dropdown('get value'),
        selectionType: $('#selectionTypeDropdown').dropdown('get value'),
        crossoverType: $('#crossoverTypeDropdown').dropdown('get value'),
        mutationType: $('#mutationTypeDropdown').dropdown('get value'),
        crossoverProbability: document.getElementById("crossoverProbabilitySlider").value,
        survivalRate: document.getElementById("survivalRateSlider").value,
        mutationProbability: document.getElementById("mutationProbabilitySlider").value,

        drumTheme: $('#drumThemesDropdown').dropdown('get value'),
    }
    return parameterModel;
}



var finalPool;
var GA = undefined;

/**
 * Initialize the genetic algorithm and runs it
 */
function initGeneticAlgorithm() {
    // 3 sequences of 16 steps each
    var nSeq = 3;
    var nStep = 16;

    // Get the parameter model
    var parametersModel = createParametersModel();

    // Call setupSample (download necessary samples) and then initialize state with them
    setupSample(parametersModel.drumTheme).then((samples) => {
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



    // Create the Genetic Algorithm
    GA = new GeneticAlgorithm(parametersModel.startingPopulation, nSeq, nStep);

    // Call all the setup functions
    GA.fitnessSetup(parametersModel.fitnessType, parametersModel.finalPopulation);
    GA.selectionSetup(parametersModel.selectionType, parametersModel.survivalRate / 100);
    GA.crossoverSetup(parametersModel.crossoverType, parametersModel.crossoverProbability / 100);
    GA.mutationSetup(parametersModel.mutationType, parametersModel.mutationProbability / 100);

    // Start it
    finalPool = GA.start();

    // If GA.start() returned an empty array, display error (some parameters are unfilled)
    if (finalPool.length == 0) {
        $(".errormodal").modal('show');
    }
    // Otherwise render Pattern window using finalPool as model
    else {
        renderPatternWindow();
    }
}

// Assign initGeneticAlgorithm to the "Start Process" button on the bottom of the page
let startProcessButton = document.getElementById("start_process_button");
startProcessButton.onclick = initGeneticAlgorithm; 