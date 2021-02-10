/**
 * TODO: Update slider textbox in realtime
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
    values: fitnessValues,
    placeholder: "Select Fitness Strategy"
  })
;
$('.ui.dropdown.select')
  .dropdown({
    values: selectionValues,
    placeholder: "Select Selection Strategy"
  })
;
$('.ui.dropdown.crossover')
  .dropdown({
    values: crossoverValues,
    placeholder: "Select Crossover Strategy"
  })
;
$('.ui.dropdown.mutation')
  .dropdown({
    values: mutationValues,
    placeholder: "Select Mutation Strategy"
  })
;






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
