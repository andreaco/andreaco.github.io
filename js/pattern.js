class Pattern {
    _kickSeq;           /// Kick Sequence array
    _snareSeq;          /// Kick Sequence array
    _hihatSeq;          /// Kick Sequence array

    _timeSignature;     /// Time signature
    _vote;              /// Vote assigned by user

    /**
     * Constructor
     * @param {int} n_step Number of steps of the sequence
     * @param {Array} childSequence Useful to create a pattern by starting from an existing array (like the one generated by parents)
     */
    constructor(n_step, childSequence = undefined) {
        if (n_step > 0 && childSequence === undefined) {
            this._kickSeq  = Array(n_step).fill(0.0);
            this._snareSeq = Array(n_step).fill(0.0);
            this._hihatSeq = Array(n_step).fill(0.0);
            this.generateRandomPattern();
        }
        else if(childSequence !== undefined) {
            this._kickSeq = childSequence.kickSeq;
            this._snareSeq = childSequence.snareSeq;
            this._hihatSeq = childSequence.hihatSeq;
    
        }
        else {
            console.error('Error: Could not create Pattern')
        }
    }

    /**
     * Getters
     */
    get steps() {
        return this._kickSeq.length
    }
    get kickSeq() {
        return this._kickSeq
    }
    get snareSeq() {
        return this._snareSeq
    }
    get hihatSeq() {
        return this._hihatSeq
    }
    
    getVote() {
        return this._vote
    }

    /**
     * Setters
     */
    setVote(vote) {
        this._vote = vote;
    }

    /**
     * Function used to initialize the sequence to random values
     */
    generateRandomPattern() {
        for(let j=0; j < this._kickSeq.length; ++j) {
            if (Math.random() < 0.5){
                this._kickSeq[j] = 1;
            }
            if (Math.random() < 0.5){
                let velocity = Math.random();
                this._snareSeq[j] = 1;
            }
            if (Math.random() < 0.5){
                let velocity = Math.random();
                this._hihatSeq[j] = 1;
            }
        }
    }
    
    /**
     * Returns a child pattern by alternating from this parent and the other
     * @param {Pattern} matePattern Pattern to mate with
     * @param {int} index alternating factor (1 stands for 1 every other)
     * FIXME: Now is combining only kick
     */
    matingAlternate(matePattern, index = 1) { 
        let patternB_kick = matePattern.kickSeq;
        let patternB_snare = matePattern.kickSeq;
        let patternB_hihat = matePattern.kickSeq;

        let child = new Pattern(this.length);

        child._kickSeq = this.kickSeq.slice();
        child._snareSeq = this.snareSeq.slice();
        child._hihatSeq = this.hihatSeq.slice();
 

        if(this.steps == matePattern.steps) {
            for(let i = index; i < child._kickSeq.length; i+=2*index) {
                for (let j = 0 ; j < index; j++){
                    child._kickSeq[i+j] = patternB_kick[i+j]; 
                    child._snareSeq[i+j] = patternB_snare[i+j]; 
                    child._hihatSeq[i+j] = patternB_hihat[i+j]; 
                }
            }
            return new Pattern(0, child);
        }
        else {
            console.error('Mating patterns have different size')
        } 
    }
    
    /**
     * Returns a child pattern by computing the logical AND
     * If two cells are both != from 0, keeps only this parent value
     * @param {Pattern} matePattern Pattern to mate with
     * FIXME: Now is combining only kick
     */
    /*
    matingAnd(matePattern) {
        let patternB = matePattern.sequence;
        let childPattern = Array(this._sequence.length).fill(0.0);
        if(this.steps == matePattern.steps) {
            for (let i = 0; i < childPattern.length; i++){
                if(this.sequence[i] && patternB[i]) {
                    childPattern[i] = this.sequence[i];
                }
            }
            return new Pattern(0, childPattern);
        } 
        else {
            console.error('Mating patterns have different size')
        }
    }
    */
}


class Offspring {
    _generation;        /// Current generation index
    _pool;              /// Array containing the patterns of current gen

    /**
     * Constructor generating a random pool with specified number of elements and steps
     * @param {int} n_elements Number of elements to be created in the pool 
     * @param {int} steps Number of steps for each element
     */
    constructor(n_elements, steps) {
        this._pool = Array(n_elements)
        this._generation = 0;
        for (let i = 0; i < n_elements; i++){
            this._pool[i] = new Pattern(steps)
        }
    }
    
    /**
     * Getters
     */
    getGeneration() {
        return this._generation;
    }
    get pool() {
        return this._pool;
    }
    get numberOfElements() {
        return this._pool.length;
    }

    /**
     * Function that allows the offspring to mate and advance to next generation
     * 
     * FIXME: funziona solo se c'è una pool con nelementi dispari
     */
    mating() {
        this._pool.sort((a,b) => (b.getVote() - a.getVote()))
        let newPool = Array(this.numberOfElements)
        newPool[0] = this._pool[0];
        for (let i = 1; i< this._pool.length; i+=2){
            newPool[i] = this._pool[i].matingAlternate(this._pool[i+1])
            newPool[i+1] = this._pool[i+1].matingAlternate(this._pool[i])
            

            
        }
        this._generation++;
        this._pool = newPool
    }
}