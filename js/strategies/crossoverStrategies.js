/**
 * Strategy Manager responsible for storing and
 * return the possible strategies
 */
class CrossoverStrategyManager {
    _strategies;

    constructor() {
        this._strategies = [
            new SinglePointCrossover(),
            new TwoPointCrossover()
        ];
    }

    getStrategy(name) {
        return this._strategies.find(strategy => strategy._name === name);
    }

    getStrategyNames() {
        let list = []
        for (let i = 0; i < this._strategies.length; ++i) {
            list.push(this._strategies[i]._name)
        }
        return list
    }
}




/**
 * Single Point Crossover Strategy
 */
class SinglePointCrossover {
    _name = "Single Point Crossover";
    constructor() { }

    /**
     * @param {Array} selected Selected population to crossover
     * @param {float} crossoverProbability Probability to mating instead of surviving
     */
    compute(selected, crossoverProbability) {
        let N = selected.length;
        let offspring = selected.slice();
        let crossoverPoint = Math.random();

        for (let i = 0; i < N - 1; i += 2) {
            if (Math.random() < crossoverProbability) {

                offspring[i] = this.singlePointMating(selected[i], selected[i + 1], crossoverPoint);
                offspring[i + 1] = this.singlePointMating(selected[i + 1], selected[i], crossoverPoint);
            }

        }
        return offspring;
    }

    singlePointMating(a, b, crossoverPoint) {
        let M = Math.floor(crossoverPoint * a.sequences.shape[1]);
        let firstChromosome = a.sequences.slice([null], [0, M]);
        let secondChromosome = b.sequences.slice([null], [M, b.sequences.shape[1]]);
        let child = new Pattern()
        child.sequences = nj.concatenate(firstChromosome, secondChromosome);
        return child
    }
}




/**
 * Two Point Crossover Strategy
 */
class TwoPointCrossover {
    _name = "Two Point Crossover";
    constructor() { }

    /**
     * @param {Array} selected Selected population to crossover
     * @param {float} crossoverProbability Probability to mating instead of surviving
     */

    compute(selected, crossoverProbability) {
        let N = selected.length;
        let offspring = selected.slice();
        let start = Math.random();
        let end = Math.random();

        if (start > end) {
            let tmp = end;
            end = start;
            start = tmp
        }

        for (let i = 0; i < N - 1; i += 2) {
            if (Math.random() < crossoverProbability) {

                offspring[i] = this.twoPointMating(selected[i], selected[i + 1], start, end);
                offspring[i + 1] = this.twoPointMating(selected[i + 1], selected[i], start, end);
            }
        }
        return offspring;
    }


    twoPointMating(a, b, start, end) {
        let child = new Pattern();
        if (start <= end) {
            let startingIndex = Math.floor(start * a.sequences.shape[1]);
            let finalIndex = Math.floor(end * a.sequences.shape[1]);
            let firstChromosome = a.sequences.slice([null], [0, startingIndex]);
            let secondChromosome = b.sequences.slice([null], [startingIndex, finalIndex]);
            let thirdChromosome = b.sequences.slice([null], [finalIndex, b.sequences.shape[1]]);
            let seq = nj.concatenate(firstChromosome, secondChromosome);
            child.sequences = nj.concatenate(seq, thirdChromosome);
        }
        return child
    }
}


/**
 * Initialization
 */
const crossoverStrategyManager = new CrossoverStrategyManager();
