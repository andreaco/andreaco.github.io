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
    name = "FitnessStrategy1"
    constructor() {}

    compute(pattern) {
        return score;
    }
}


/**
 * Selection Strategies
 */
class SelectionStrategyManager {
    _strategies;

    constructor() {
        this._strategies = [
            new SelectionStrategy1()
        ];
    }

    getStrategy(name) {
        return this._strategies.find(strategy => strategy._name === name);
    }
}

class SelectionStrategy1 {
    name = "SelectionStrategy1"
    constructor() {}

    /**
     * @param {Array} population Population to be selected
     * @param {float} survivalRate Percentage of elements that should survive 
     */
    compute(population, survivalRate) {
        let selected = population;
        // fitness score è in population[i].score
        return selected;
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
    name = "CrossoverStrategy1";
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
    name = "MutationStrategy1";
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
    name = "MutationStrategy2";
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