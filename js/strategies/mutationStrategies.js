/**
 * Strategy Manager responsible for storing and
 * return the possible strategies
 */
class MutationStrategyManager {
    _strategies;

    constructor() {
        this._strategies = [
            new BitStringMutation(),
            new FlipBitMutation(),

        ];
    }

    getStrategy(name) {
        return this._strategies.find(strategy => strategy._name === name);
    }

    getStrategyNames() {
        let list = []
        for (let i=0; i < this._strategies.length; ++i) {
            list.push(this._strategies[i]._name)
        }
        return list
    }
}




/**
 * Flib Bit Mutation
 */
class FlipBitMutation {
    _name = "Flip Bit";
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

                mutated[i]  = this.flipBit(offspring[i]);
                
            }
           
        }

        return mutated;
    }

    flipBit(p){
        let N = p.steps;
        let num_seq = p.numSequences;

        for (let i = 0; i < num_seq; i++){
            for(let j = 0; j < N; j++){
                if(p.sequences.get(i, j) == 1)
                    p.sequences.set(i, j, 0);
                else
                    p.sequences.set(i, j, 1);        
            }
        }
        return p;
    }
}




/**
 * Bit String Mutation
 */
class BitStringMutation {
    _name = "Bit String Mutation";
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
                    if(Math.random() < prob) {
                        let val = p.sequences.get(i, j);
                        if(val==1)
                            p.sequences.set(i, j, 0);
                        else
                            p.sequences.set(i, j, 1);        
                    }
                }
            }
            return p;
    }
}


/**
 * Initialization
 */
const mutationStrategyManager  = new MutationStrategyManager();