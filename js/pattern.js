class Pattern {
    _sequences;         /// 2D array N sequences * S steps as NJ array
    score = 0;          /// fitness score to be computed
    name  = undefined;
    id    = undefined;

    /**
     * Constructor
     * @param {int} N Number of sequences
     * @param {int} S Number of steps
     */
    constructor(N = 0, S = 0) {
        if (N >= 0 && S >= 0) {
            // Random sequences of 0s and 1s
            this._sequences = nj.random(N, S).round();
        }
        else {
            console.error('Error: Could not create Pattern')
        }
    }

    /**
     * Getters for private attributes
     */
    get steps() {
        return this._sequences.shape[1];
    }
    get numSequences() {
        return this._sequences.shape[0];
    }
    get sequences() {
        return this._sequences;
    }
    
    /**
     * Setters
     */
    set sequences(value) {
        this._sequences = value;
    }
}
