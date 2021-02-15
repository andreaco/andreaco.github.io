/**
 * Strategy Manager responsible for storing and
 * return the possible strategies
 */
class SelectionStrategyManager {
    _strategies;

    constructor() {
        this._strategies = [
            new SelectionRouletteWheelStochasticAcceptance(),
            new FittestSurvive()
        ];
    }
    
    /**
     * Returns strategy from its name
     * @param {string} name 
     */
    getStrategy(name) {
        return this._strategies.find(strategy => strategy._name === name);
    }
    
    /**
     * Return the list of strategy names
     */
    getStrategyNames() {
        let list = []
        for (let i=0; i < this._strategies.length; ++i) {
            list.push(this._strategies[i]._name)
        }
        return list
    }
}




/**
 * Selection Roulette Wheel with Stochastic Acceptance
 */
class SelectionRouletteWheelStochasticAcceptance {
    _name = "Roulette Wheel Stochastic Acceptance"
    constructor() {}

    /**
     * @param {Array} population Population to be selected
     * @param {float} survivalRate Percentage of elements that should survive 
     */
    compute(population, survivalRate = 0.9) {
        
        let numberOfSurvivors = Math.floor(population.length * survivalRate)
        let maxScore = this.getMaxScore(population);

        let selected = Array(numberOfSurvivors);
        
        for(let i=0; i < selected.length; ++i) {
            let survivalProbability
            let index
            do {
                index = Math.floor(Math.random()*population.length)
                survivalProbability = population[index].score / maxScore;
            } while(Math.random() > survivalProbability)
            
            selected[i] = population[index];
            population.splice(index, 1);
        }

        return selected;
    }

    /**
     * Utility function to obtain the maximum score, for normalization purposes
     * @param {Array} population 
     */
    getMaxScore(population) {
        let max = population[0].score;
        for (let i=1; i < population.length; ++i) {
            if (population[i].score > max)
                max = population[i].score
        }
        return max
    }
}




/**
 * Fittest Survive
 */
class FittestSurvive {
    _name = "Fittest Survive"
    constructor() {}

    /**
     * @param {Array} population Population to be selected
     * @param {float} survivalRate Percentage of elements that should survive 
     */
    compute(population, survivalRate = 0.9) { 
        let numberOfSurvivors = Math.floor(population.length * survivalRate)

        let selected = Array(numberOfSurvivors);
        for(let i=0; i < selected.length; ++i) {
            selected[i] = this.extractMaxScore(population);
        }
        
        return selected;
    }

    /**
     * Extract the max scoring element and removes it from the array
     * @param {*} population 
     */
    extractMaxScore(population) {
        let max = population[0];
        let iMax = 0;
        for (let i=1; i < population.length; ++i) {
            if (population[i].score > max.score) {
                max = population[i];
                iMax = i;
            }
        }
        population.splice(iMax, 1);
        return max
    }
}


/**
 * Initialization
 */
const selectionStrategyManager = new SelectionStrategyManager();
