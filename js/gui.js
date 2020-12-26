/**
 * TODO: Default text for dropdown menus
 * TODO: Name Value dropdown representation
 * TODO: Update slider textbox in realtime
 * TODO: Slider default value textbox
 * TODO: Slider Ranges
 */

function updateTextBox(parentID, value) {
    document.getElementById(parentID).querySelector('.textbox').value = value;
}

function getDropdownValues(strategyNames) {
    let values = []
    for (let i = 0; i < strategyNames.length; ++i) {
        values.push(
            {
                name: strategyNames[i],
                value: strategyNames[i],
            }
        )
    }
    return values
}

// GUI Sliders
var startingPopulationSlider    = document.getElementById("startingPopulationSlider");
var numberOfFinalElementsSlider = document.getElementById("numberOfFinalElementsSlider");
var survivalRateSlider          = document.getElementById("survivalRateSlider");
var crossoverProbabilitySlider  = document.getElementById("crossoverProbabilitySlider");
var mutationProbabilitySlider   = document.getElementById("mutationProbabilitySlider");

// GUI Dropdown Menus
var fitnessTypeDropdown         = $("#fitnessTypeDropdown");
var selectionTypeDropdown       = $("#selectionTypeDropdown");
var crossoverTypeDropdown       = $("#crossoverTypeDropdown");
var mutationTypeDropdown        = $("#mutationTypeDropdown");

// GUI Dropdown values setup
var fitnessValues   = getDropdownValues(fitnessStrategyManager  .getStrategyNames());
var selectionValues = getDropdownValues(selectionStrategyManager.getStrategyNames());
var crossoverValues = getDropdownValues(crossoverStrategyManager.getStrategyNames());
var mutationValues  = getDropdownValues(mutationStrategyManager .getStrategyNames());

// Dropdown Menus Setup
$('.ui.dropdown.fitness')
  .dropdown({
    values: fitnessValues
  })
;
$('.ui.dropdown.selection')
  .dropdown({
    values: selectionValues
  })
;
$('.ui.dropdown.crossover')
  .dropdown({
    values: crossoverValues
  })
;
$('.ui.dropdown.mutation')
  .dropdown({
    values: mutationValues
  })
;

function createParametersModel() {
    var parametersModel = {
        startingPopulation      : undefined,
        fitnessType             : undefined,
        survivalRate            : undefined,
        selectionType           : undefined,
        crossoverProbability    : undefined,
        crossoverType           : undefined,
        mutationProbability     : undefined,
        mutationType            : undefined,
    }
    parametersModel.startingPopulation      = startingPopulationSlider.querySelector('.slider').value;
    parametersModel.fitnessType             = fitnessTypeDropdown.dropdown('get value');
    parametersModel.survivalRate            = survivalRateSlider.querySelector('.slider').value;
    parametersModel.selectionType           = selectionTypeDropdown.dropdown('get value');
    parametersModel.crossoverProbability    = crossoverProbabilitySlider.querySelector('.slider').value;
    parametersModel.crossoverType           = crossoverTypeDropdown.dropdown('get value');
    parametersModel.mutationProbability     = mutationProbabilitySlider.querySelector('.slider').value;
    parametersModel.mutationType            = mutationTypeDropdown.dropdown('get value');
    
    return parametersModel;
}



//========================================================================================================================
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

//addHtmlElements(5);
//getElementView();

/** 
 * Render function
 */

function render() {

}

/**
 * Change the displayed/current playback sequence
 * @param {number} index 
 */
function assign_pattern(index) {
    let patterns = population.pool;
    kick_pattern  = patterns[index].kickSeq;
    snare_pattern = patterns[index].snareSeq;
    hihat_pattern = patterns[index].hihatSeq;
}
