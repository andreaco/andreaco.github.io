/**
 * Read JSON containing array of names for patterns
 */
var randomNames;
$.getJSON("resources/first-names.json", function (json) {
    randomNames = json;
});

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
function initGeneticAlgorithm() {
    var nSeq = 3;
    var nStep = 16;
    var parametersModel = createParametersModel();


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




    GA = new GeneticAlgorithm(parametersModel.startingPopulation, nSeq, nStep);

    GA.fitnessSetup(parametersModel.fitnessType, parametersModel.finalPopulation);
    GA.selectionSetup(parametersModel.selectionType, parametersModel.survivalRate / 100);
    GA.crossoverSetup(parametersModel.crossoverType, parametersModel.crossoverProbability / 100);
    GA.mutationSetup(parametersModel.mutationType, parametersModel.mutationProbability / 100);

    finalPool = GA.start();


    if (finalPool.length == 0) {
        $(".errormodal").modal('show');

    }
    else {

        renderPatternWindow();
    }
}

let startProcessButton = document.getElementById("start_process_button");
startProcessButton.onclick = initGeneticAlgorithm; 