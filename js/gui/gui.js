
// GUI Dropdown values setup
var fitnessValues = getDropdownValues(fitnessStrategyManager.getStrategyNames());
var selectionValues = getDropdownValues(selectionStrategyManager.getStrategyNames());
var crossoverValues = getDropdownValues(crossoverStrategyManager.getStrategyNames());
var mutationValues = getDropdownValues(mutationStrategyManager.getStrategyNames());
var drumThemes = ["808",
  "Percussive",
  "Electronic"];
var drumValues = getDropdownValues(drumThemes);


// Dropdown Menus Setup used in the main page
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
$('.ui.dropdown.drum')
  .dropdown({
    values: drumValues,
    placeholder: "Select Drum Theme"
  })
  ;

/**
 * Links the sliders to their (readonly) textboxes
 * @param {*} ID ID of the textbox
 * @param {*} value value to be displayed
 */
function updateTextBox(ID, value) {
  document.getElementById(ID).value = value;
}

/**
 * Starting from the strategy names list,
 * compose the relative dropdown menu representation
 * @param {Array} strategyNames List containing the strategy names
 */
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


// Setup of the slider ranges and default values for both slider and textboxes
document.getElementById("startingPopulationSlider").min = 20
document.getElementById("startingPopulationSlider").max = 500
document.getElementById("startingPopulationSlider").value = 260
document.getElementById("startingPopulationTextbox").value = 260

document.getElementById("survivalRateSlider").min = 60
document.getElementById("survivalRateSlider").max = 99
document.getElementById("survivalRateSlider").value = 90
document.getElementById("survivalRateTextbox").value = 90

document.getElementById("crossoverProbabilitySlider").min = 30
document.getElementById("crossoverProbabilitySlider").max = 100
document.getElementById("crossoverProbabilitySlider").value = 90
document.getElementById("crossoverProbabilityTextbox").value = 90

document.getElementById("mutationProbabilitySlider").min = 0
document.getElementById("mutationProbabilitySlider").max = 100
document.getElementById("mutationProbabilitySlider").value = 5
document.getElementById("mutationProbabilityTextbox").value = 5

// Links the sliders to the textboxes
document.getElementById("startingPopulationSlider").oninput = function () { updateTextBox('startingPopulationTextbox', this.value) };
document.getElementById("survivalRateSlider").oninput = function () { updateTextBox('survivalRateTextbox', this.value) };
document.getElementById("crossoverProbabilitySlider").oninput = function () { updateTextBox('crossoverProbabilityTextbox', this.value) };
document.getElementById("mutationProbabilitySlider").oninput = function () { updateTextBox('mutationProbabilityTextbox', this.value) };


/**
 * Function used to compose and render the pattern representation modal window
 */
function renderPatternWindow() {
  // Get div that will contain the names of the patterns to be displayed
  let patternMenu = document.getElementById('patternSelectionDiv');

  // Setup of the lateral selection menu (with names)
  for (let i = 0; i < finalPool.length; ++i) {
    // Get a random name and assign it to the pattern
    let randomIndex = Math.floor(Math.random() * Math.floor(randomNames.length));
    finalPool[i].name = randomNames[randomIndex];

    // Set the id to be used
    finalPool[i].id = "id" + i;

    // Create the html element and setup its style
    let element = document.createElement('a');
    element.classList.add('item', 'item_name');

    // Setup displayed text and id
    element.innerHTML = finalPool[i].name;
    element.id = finalPool[i].id;

    // Create onclick function
    element.onclick = function () {
      // Find the pattern with the same id in finalPool
      let clickedPattern = finalPool.find(element => element.id === this.id);

      // Get the sequences from the clicked pattern and assign them to the Model variables (for both display and audio)
      let sequences = clickedPattern.sequences.tolist();
      kick_pattern = sequences[0];
      snare_pattern = sequences[1];
      hihat_pattern = sequences[2];

      // Setup up the upper name of the pattern as title in the representation window
      document.getElementById('patternName').innerHTML = clickedPattern.name;

      // Set this name in the name list as active and deactivate the others
      if (!$(this).hasClass('dropdown browse')) {
        $(this)
          .addClass('active')
          .closest('.ui.menu')
          .find('.item')
          .not($(this))
          .removeClass('active');
      }
      // Re-render with the new update variables
      draw();
    }

    // Add the created element to the pattern menu list (on the left side)
    patternMenu.appendChild(element);
  }
  
  // Select by default the first element of the list
  patternMenu.firstElementChild.onclick();

  // In the end, display the modal
  $(".featuremodal").modal('show');
}
