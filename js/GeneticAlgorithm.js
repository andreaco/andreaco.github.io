
class GeneticAlgorithm {
    // Population Attributes
    _population;                // Array containing the population patterns
    _numberOfFinalElements;     // Number of final elements

    // Parameters
    _survivalRate;              // Percentage of elements surviving at the end of each generation
    _crossoverProbability;      // Percentage of elements that will mate
    _mutationProbability;

    // Strategies to be used
    _fitnessFunction = undefined;
    _selectionFunction = undefined;
    _crossoverFunction = undefined;
    _mutationFunction = undefined;


    /**
     * Constructor
     * @param {int} numberOfElements Number of elements in the starting population
     * @param {int} numberOfSequences Number of sequences for each element in the population
     * @param {int} numberOfSteps Number of steps for each sequences in each element in the population
     */
    constructor(numberOfElements, numberOfSequences = 3, numberOfSteps = 16) {
        try {
            this._population = Array(numberOfElements);

            for (let i = 0; i < numberOfElements; i++) {
                this._population[i] = new Pattern(numberOfSequences, numberOfSteps);
            }
        }
        catch (err) {
            console.error("GeneticAlgorithm constructor: " + err.message);
        }
    }

    /**
     * Constructor
     * @param {string} fitnessStrategyName Fitness Strategy name selected
     * @param {int} numberOfFinalElements Number of final elements to obtain in the end
     */
    fitnessSetup(fitnessStrategyName, numberOfFinalElements) {
        this._numberOfFinalElements = numberOfFinalElements;
        this._fitnessFunction = fitnessStrategyManager.getStrategy(fitnessStrategyName);
    }

    /**
     * @param {string} selectionStrategyName Selection strategy name selected
     * @param {float} survivalRate Percentage of elements surviving at the end of each generation
     */
    selectionSetup(selectionStrategyName, survivalRate) {
        this._survivalRate = survivalRate;
        this._selectionFunction = selectionStrategyManager.getStrategy(selectionStrategyName);
    }

    /**
     * @param {string} crossoverStrategyName Crossover strategy name selected
     * @param {float} crossoverProbability Percentage of elements that will mate
     */
    crossoverSetup(crossoverStrategyName, crossoverProbability) {
        this._crossoverProbability = crossoverProbability;
        this._crossoverFunction = crossoverStrategyManager.getStrategy(crossoverStrategyName);
    }

    /**
     * @param {string} mutationStrategyName Mutation strategy name selected
     * @param {float} mutationProbability Probability of mutation
     */
    mutationSetup(mutationStrategyName, mutationProbability) {
        this._mutationProbability = mutationProbability;
        this._mutationFunction = mutationStrategyManager.getStrategy(mutationStrategyName);
    }

    // TODO: Gather statitics for each generation
    start() {
        if (this._fitnessFunction == undefined || this._selectionFunction == undefined
            || this._crossoverFunction == undefined || this._mutationFunction == undefined) {
            console.error("Cannot start due to some uninitialized functions");
            return [];
        }
        else {
            while (this._population.length > this._numberOfFinalElements) {
                this.computeScores();

                let populationCopy = this._population.slice();

                let selected = this._selectionFunction.compute(populationCopy, this._survivalRate);

                let offspring = this._crossoverFunction.compute(selected, this._crossoverProbability);

                let mutated = this._mutationFunction.compute(offspring);

                this._population = mutated;
            }
            return this._population;
        }

    }

    computeScores() {
        for (let i = 0; i < this._population.length; ++i) {
            this._population[i].score = this._fitnessFunction.compute(this._population[i])
        }
    }

}


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
    }
    return parameterModel;
}


var finalPool;
var GA = undefined;
function initGeneticAlgorithm() {
    var nSeq = 3;
    var nStep = 16;
    var parametersModel = createParametersModel();

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