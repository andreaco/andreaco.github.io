
// GUI Dropdown values setup
var fitnessValues = getDropdownValues(fitnessStrategyManager.getStrategyNames());
var selectionValues = getDropdownValues(selectionStrategyManager.getStrategyNames());
var crossoverValues = getDropdownValues(crossoverStrategyManager.getStrategyNames());
var mutationValues = getDropdownValues(mutationStrategyManager.getStrategyNames());

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

function updateTextBox(ID, value) {
  document.getElementById(ID).value = value;
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



document.getElementById("startingPopulationSlider").min = 20
document.getElementById("startingPopulationSlider").max = 500
document.getElementById("startingPopulationSlider").value = 260
document.getElementById("startingPopulationTextbox").value = 260

document.getElementById("survivalRateSlider").min = 60
document.getElementById("survivalRateSlider").max = 99
document.getElementById("survivalRateSlider").value = 80
document.getElementById("survivalRateTextbox").value = 80

document.getElementById("crossoverProbabilitySlider").min = 30
document.getElementById("crossoverProbabilitySlider").max = 100
document.getElementById("crossoverProbabilitySlider").value = 65
document.getElementById("crossoverProbabilityTextbox").value = 65

document.getElementById("mutationProbabilitySlider").min = 0
document.getElementById("mutationProbabilitySlider").max = 100
document.getElementById("mutationProbabilitySlider").value = 50
document.getElementById("mutationProbabilityTextbox").value = 50


document.getElementById("startingPopulationSlider").oninput = function () { updateTextBox('startingPopulationTextbox', this.value) };
document.getElementById("survivalRateSlider").oninput = function () { updateTextBox('survivalRateTextbox', this.value) };
document.getElementById("crossoverProbabilitySlider").oninput = function () { updateTextBox('crossoverProbabilityTextbox', this.value) };
document.getElementById("mutationProbabilitySlider").oninput = function () { updateTextBox('mutationProbabilityTextbox', this.value) };



function renderPatternWindow() {
  
  let patternMenu = document.getElementById('patternSelectionDiv');

  for (let i = 0; i < finalPool.length; ++i) {
    let randomIndex = Math.floor(Math.random() * Math.floor(randomNames.length));
    finalPool[i].name = randomNames[randomIndex];
    finalPool[i].id = "id" + i;

    let element = document.createElement('a');

    element.classList.add('item', 'item_name');

    element.innerHTML = finalPool[i].name;
    element.id = finalPool[i].id;

    element.onclick = function () {

      let clickedPattern = finalPool.find(element => element.id === this.id);
      let sequences = clickedPattern.sequences.tolist();
      kick_pattern = sequences[0];
      snare_pattern = sequences[1];
      hihat_pattern = sequences[2];

      document.getElementById('patternName').innerHTML = clickedPattern.name;

      if (!$(this).hasClass('dropdown browse')) {
        $(this)
          .addClass('active')
          .closest('.ui.menu')
          .find('.item')
          .not($(this))
          .removeClass('active');
      }
      draw();
    }


    patternMenu.appendChild(element);
  }
  patternMenu.firstElementChild.onclick();

  $(".featuremodal").modal('show');
}
