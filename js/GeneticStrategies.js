/**
 * Fitness Strategies
 */
class FitnessStrategyManager {
    _strategies;

    constructor() {
        this._strategies = [
            new FitnessBEH()
        ];
    }

    getStrategy(name) {
        return this._strategies.find(strategy => strategy._name === name);
    }

}

class FitnessBEH {
    _name = "Fitness BEH"
    constructor() {}

    p2x(p){
        let result = []
        let N = p.length
        for (let i = 0; i < N; i++){
            if (p[i]!==0){
                result.push(i/N);
            }
        }
        return result;
    }

    x2z(x){
        let z = [];
        for (let i = 0; i < x.length; i++){
            let twoPiJ = math.complex(0,2*math.pi);
            z.push(math.exp(math.multiply(x[i], twoPiJ)))
        }
        return z;
    }

    summation(z){
        let sum = math.complex(0, 0);
        for (let i = 0; i < z.length; i++){
            sum  = math.add(sum, z[i]);
        }
        return sum;
    }

    balance(z){
        let N = z.length; 
        if (N === 0){
            return 0
        }

        else{
            return 1 - math.abs(this.summation(z))/N
        }
    }

    evenness(z){
        let N = z.length;
        if (N == 0) return 0
        let e = 0
        for (let k=0; k < z.length; ++k) {
            let minusTwoPij = math.complex(0, -2*math.pi);
            let exponent = math.multiply(minusTwoPij, k);
            exponent = math.divide(exponent, N)
            let tmp = math.multiply(z[k], math.exp(exponent))
            e = math.add(e, tmp)
        }
        e = math.abs(e)
        e = math.divide(e,N)
        return e;
    }


    distance(p){
        let ons = []
        let tmp = []
        let N = p.length;

        for (let i = 0; i < N; i++){
            if (p[i]!==0){
                ons.push(i);
            }
        }

        if(ons.length > 0){
            ons.push(N+ons[0]);
        }
        else ons.push(N);
        
        for (let i = 0; i < ons.length-1; i++){ 
            tmp.push(ons[i+1] - ons[i]);
        }

        return tmp;
    }


    IOI(p){
        let ans = [];
        let g = distance(p);

        


        return ans;
    }





    

    compute(pattern) {
        let list = pattern.sequences.tolist();
        for (let i = 0; i < list.length; i++){
            p = list[i];
            x = p2x(p);
        }

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
            new SinglePointCrossover(),
            new TwoPointCrossover()
        ];
    }

    getStrategy(name) {
        return this._strategies.find(strategy => strategy._name === name);
    }
}

class SinglePointCrossover {
    _name = "Single Point Crossover";
    constructor() {}

    /**
     * @param {Array} selected Selected population to crossover
     * @param {float} crossoverProbability Probability to mating instead of surviving
     */
    compute(selected, crossoverProbability) {
        let N = selected.length;
        let offspring = selected.slice();

        for(let i = 0; i <  N-1; i+=2){
            if(Math.random() < crossoverProbability){

                offspring[i]  = this.singlePointMating(selected[i], selected[i+1]);
                offspring[i+1]  = this.singlePointMating(selected[i+1], selected[i]);
            }
           
        }
        return offspring;
    }

    singlePointMating(a, b, crossoverPoint = 0.5){
        let M = Math.floor(crossoverPoint * a.sequences.shape[1]);
        let firstChromosome = a.sequences.slice([null],[0, M]);
        let secondChromosome = b.sequences.slice([null], [M, b.sequences.shape[1]]);
        let child = new Pattern()
        child.sequences = nj.concatenate(firstChromosome, secondChromosome);
        return child
    }
}
class TwoPointCrossover {
    _name = "Two Point Crossover";
    constructor() {}

    /**
     * @param {Array} selected Selected population to crossover
     * @param {float} crossoverProbability Probability to mating instead of surviving
     */
    compute(selected, crossoverProbability) {
        let N = selected.length;
        let offspring = selected.slice();

        for(let i = 0; i <  N-1; i+=2){
            if(Math.random() < crossoverProbability){

                offspring[i] = this.twoPointMating(selected[i], selected[i+1]);
                offspring[i+1] = this.twoPointMating(selected[i+1], selected[i]);
            }
        }
        return offspring;
    }

    /*
    FIXME: ritorna array vuoti
    */
    twoPointMating(a, b, start, end){
        let startingIndex = Math.floor(start * a.sequences.shape[1]);
        let finalIndex = Math.floor(end * a.sequences.shape[1]);
        let firstChromosome = a.sequences.slice([null],[0, startingIndex]);
        let secondChromosome = b.sequences.slice([null],[startingIndex, finalIndex]);
        let thirdChromosome = b.sequences.slice([null],[finalIndex, b.sequences.shape[1]]);
        let child = new Pattern();
        let seq = nj.concatenate(firstChromosome, secondChromosome);
        child.sequences = nj.concatenate(seq, thirdChromosome);
        return child
    }
}


/**
 * Mutation Strategies
 */
class MutationStrategyManager {
    _strategies;

    constructor() {
        this._strategies = [
            new MutationStrategy1()
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
     * @param {Array} mutated Population after mutation
     * @param {float} mutationProbability Probability of mutation
     */
    compute(offspring, mutationProbability) {
        let N = offspring.length;
        let mutated = offspring.slice();
   
        for(let i = 0; i < N; i++){
            if(Math.random() < mutationProbability){

                mutated[i]  = this.bitstring_mutation(offspring[i]);
                
            }
           
        }
    
        return mutated;
    }

    bitstring_mutation(p){
           
            let N = p.steps;
            let num_seq = p.numSequences;
            let prob = 1 / N;

            for (let i = 0; i < num_seq; i++){
                for(let j = 0; j < N; j++){
                    if(Math.random() < prob){

                        let val = p.sequences.get(i, j);
                        if(val==1){
                            p.sequences.set(i, j, 0);}
                        else p.sequences.set(i, j, 1);        
                    }
                }
            }

            return p;
        
    }
}







/**
 * Strategy Managers initialization
 */
const fitnessStrategyManager   = new FitnessStrategyManager();
const selectionStrategyManager = new SelectionStrategyManager();
const crossoverStrategyManager = new CrossoverStrategyManager();
const mutationStrategyManager  = new MutationStrategyManager();