
class Pattern {
    _sequence; 
    _timeSignature;
    _vote;

    constructor(n_step, childSequence = undefined){
        if (n_step > 0 && childSequence === undefined){
            this._sequence = Array(n_step).fill(0.0);
            this.generateRandomPattern();
        }
        else if(childSequence !== undefined){
            this._sequence = childSequence   
        }
        else{
            console.error('Error: Could not create Pattern')
        }
    }

    getSteps(){
        return this._sequence.length
    }

    getSequence(){
        return this._sequence
    }

    getVote(){
        return this._vote
    }

    setVote(vote){
        this._vote = vote;
    }

    generateRandomPattern(){
        for(let j=0; j < this._sequence.length; ++j) {
            if (Math.random()< 0.5){
                let velocity = Math.random();
                this._sequence[j] = velocity;
            }
        }
    }
    
    matingAlternate(matePattern, index = 1){ 
         let patternB = matePattern.getSequence();
        if(this.getSteps() == matePattern.getSteps()){
            let childPattern = this._sequence.slice();
            for(let i = index; i<childPattern.length; i+=2*index){
                for (let j = 0 ; j< index; j++){
                    childPattern[i+j] = patternB[i+j]; 
                }
            }
            return new Pattern(0, childPattern);
        }
        else{
            console.error('Mating patterns have different size')
        } 
    }
    
    matingAnd(matePattern){
        let patternB = matePattern.getSequence();
        let childPattern = Array(this._sequence.length).fill(0.0);
        if(this.getSteps() == matePattern.getSteps()){
            for (let i = 0; i < childPattern.length; i++){
                if(this._sequence[i]&&patternB[i]){
                    childPattern[i] = this._sequence[i];
                }
            }
            return new Pattern(0, childPattern);
        } 
        else{
            console.error('Mating patterns have different size')
        }
    }
}


class Offspring{
    _generation;
    _pool;
    constructor(n_elements, steps){
        this._pool = Array(n_elements)
        this._generation = 0;
        for (let i = 0; i< n_elements; i++){
            this._pool[i] = new Pattern(steps)
        }
    }

    getGeneration(){
        return this._generation;
    }

    getPool(){
        return this._pool;
    }

    getNumberOfElements(){
        return this._pool.length;
    }
    /* FIXME: funziona solo se c'è una pool co nelementi dispari*/
    
    mating(){
        this._pool.sort((a,b) => (b.getVote() - a.getVote()))
        let newPool = Array(this.getNumberOfElements())
        newPool[0] = this._pool[0];
        for (let i = 1; i< this._pool.length; i+=2){
            newPool[i] = this._pool[i].matingAlternate(this._pool[i+1])
            newPool[i+1] = this._pool[i+1].matingAlternate(this._pool[i])
        }
        this._pool = newPool
    }
}