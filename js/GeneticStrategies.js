/**
 * Fitness Strategies
 */
class FitnessStrategyManager {
    _strategies;

    constructor() {
        this._strategies = [
            new FitnessStrategy1()
        ];
    }

    getStrategy(name) {
        return this._strategies.find(strategy => strategy._name === name);
    }

}

class FitnessStrategy1 {
    _name = "FitnessStrategy1"
    constructor() {}

    compute(pattern) {
        return Math.random();
    }
}


/**
 * Selection Strategies
 */
class SelectionStrategyManager {
    _strategies;

    constructor() {
        this._strategies = [
            new SelectionRouletteWheelStochasticAcceptance()
        ];
    }

    getStrategy(name) {
        return this._strategies.find(strategy => strategy._name === name);
    }
}

class SelectionRouletteWheelStochasticAcceptance {
    _name = "RouletteWheelStochasticAcceptance"
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
            do {
                let index = Math.floor(Math.random()*population.length)
                let survivalProbability = population[index].score / maxScore;
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
            if (population[i] > max)
                max = population[i].score()
        }
        return max
    }
}




/**
 * Crossover Strategies
 */
class CrossoverStrategyManager {
    _strategies;

    constructor() {
        this._strategies = [
            new CrossoverStrategy1()
        ];
    }

    getStrategy(name) {
        return this._strategies.find(strategy => strategy._name === name);
    }
}

class CrossoverStrategy1 {
    _name = "CrossoverStrategy1";
    constructor() {}

    /**
     * @param {Array} selected Selected population to crossover
     * @param {float} crossoverProbability Probability to mating instead of surviving
     */
    compute(selected, crossoverProbability) {
        let offspring = selected;
        // Apply Chosen Crossover
        return offspring;
    }
}


/**
 * Mutation Strategies
 */
class MutationStrategyManager {
    _strategies;

    constructor() {
        this._strategies = [
            new MutationStrategy1(),
            new MutationStrategy2()
        ];
    }

    getStrategy(name) {
        return this._strategies.find(strategy => strategy._name === name);
    }
}

class MutationStrategy1 {
    _name = "MutationStrategy1";
    constructor() {}

    /**
     * @param {Array} offspring Population after crossover
     * @param {float} mutationProbability Probability of mutation
     */
    compute(offspring, mutationProbability) {
        let mutated = offspring;
        // Apply Chosen mutation
        return mutated;
    }
}

class MutationStrategy2 {
    _name = "MutationStrategy2";
    constructor() {}

    /**
     * @param {Array} offspring Population after crossover
     * @param {float} mutationProbability Probability of mutation
     */
    compute(offspring, mutationProbability) {
        let mutated = offspring;
        // Apply Chosen mutation
        return mutated;
    }
}





/**
 * Strategy Managers initialization
 */
const fitnessStrategyManager   = new FitnessStrategyManager();
const selectionStrategyManager = new SelectionStrategyManager();
const crossoverStrategyManager = new CrossoverStrategyManager();
const mutationStrategyManager  = new MutationStrategyManager();