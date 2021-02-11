/**
 * Strategy Manager responsible for storing and
 * return the possible strategies
 */
class FitnessStrategyManager {
    _strategies;

    constructor() {
        this._strategies = [
            new FitnessBEH(),
            new FitnessBalance(),
            new FitnessEvenness(),
            new FitnessEntropy()
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
 * Global functions used in order to compute the different strategies.
 */

/**
 * Utility function to compute the distance
 * from one onset from the others
 * @param {Array} p Pattern in p notation 
 */
function distance(p) {
    let ons = []
    let tmp = []
    let N = p.length;

    for (let i = 0; i < N; i++) {
        if (p[i] !== 0) {
            ons.push(i);
        }
    }

    if (ons.length > 0) {
        ons.push(N + ons[0]);
    }
    else ons.push(N);

    for (let i = 0; i < ons.length - 1; i++) {
        tmp.push(ons[i + 1] - ons[i]);
    }

    return tmp;
}


/**
 * Auxiliary function used by IOI
 */
function countOccurrences(array) {
    const countOccurrences = arr => arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {});
    return countOccurrences(array)
}

/**
 * Utility function to compute the Inter Onset Interval
 * @param {Array} p Pattern in p notation 
 */
function IOI(p) {
    let g = distance(p);
    let occurrencesDict = countOccurrences(g);

    //N is the number of intervals (== number of onsets)
    let N = 0;
    Object.keys(occurrencesDict).forEach(function (key) {
        N += occurrencesDict[key];
    });

    // Len of pattern + 1, taking into account seq with only one onset (distance 16 needs index 16)
    let ans = Array(p.length + 1).fill(0)
    Object.entries(occurrencesDict).forEach(function (pair) {
        ans[pair[0]] = pair[1] / N
    });

    return ans;
}

/**
 * Computes entropy feature for the desired pattern
 * @param {*} ioi Pattern IOI
 */
function entropy(ioi) {
    let N = ioi.length
    let sum = 0;
    let eps = 0.00000000001
    for (let i = 0; i < N; ++i) {
        sum += (ioi[i] * Math.log(ioi[i] + eps))
    }
    return - sum / Math.log(N);
}

/**
 * Function to convert from p notation to x notation
 * @param {Array} p Array of onsets in p notation
 */
function p2x(p) {
    let result = []
    let N = p.length
    for (let i = 0; i < N; i++) {
        if (p[i] !== 0) {
            result.push(i / N);
        }
    }
    return result;
}

/**
 * Function to convert from x notation to z notation
 * @param {Array} x Array of onsets in x notation
 */
function x2z(x) {
    let z = [];
    for (let i = 0; i < x.length; i++) {
        let twoPiJ = math.complex(0, 2 * math.pi);
        z.push(math.exp(math.multiply(x[i], twoPiJ)))
    }
    return z;
}


/**
 * Compute evenness of pattern
 * @param {Array} z Pattern in z notation
 */
function evenness(z) {
    let N = z.length;
    if (N == 0) return 0
    let e = 0
    for (let k = 0; k < z.length; ++k) {
        let minusTwoPij = math.complex(0, -2 * math.pi);
        let exponent = math.multiply(minusTwoPij, k);
        exponent = math.divide(exponent, N)
        let tmp = math.multiply(z[k], math.exp(exponent))
        e = math.add(e, tmp)
    }
    e = math.abs(e)
    e = math.divide(e, N)
    return e;
}


/**
 * Utility funcution to compute the sum over the array
 * @param {Array} z Array to be summed
 */
function summation(z) {
    let sum = math.complex(0, 0);
    for (let i = 0; i < z.length; i++) {
        sum = math.add(sum, z[i]);
    }
    return sum;
}

/**
 * Compute balance of pattern
 * @param {Array} z Pattern in z notation
 */
function balance(z) {
    let N = z.length;
    if (N === 0) {
        return 0
    }

    else {
        return 1 - math.abs(summation(z)) / N
    }
}




/**
 * Fitness Entropy
 */
class FitnessEntropy {
    _name = "Fitness Entropy"
    constructor() { }

    /**
     * Fitness Function
     * @param {Array} pattern Pattern 
     */
    compute(pattern) {
        let list = pattern.sequences.tolist();
        let h = 0;
        for (let i = 0; i < list.length; i++) {
            let p = list[i];
            let ioi = IOI(p);
            h += entropy(ioi);

        }

        return h/3;
    }
}




/**
 * Fitness Evenness
 */
class FitnessEvenness {
    _name = "Fitness Evenness"
    constructor() { }

    /**
     * Fitness Function
     * @param {Array} pattern Pattern 
     */
    compute(pattern) {
        let list = pattern.sequences.tolist();
        let e = 0;
        for (let i = 0; i < list.length; i++) {
            let p = list[i];
            let x = p2x(p);
            let z = x2z(x);
            e += evenness(z);
        }

        return e/3;
    }
}




/**
 * Fitness Balance
 */
class FitnessBalance {
    _name = "Fitness Balance"
    constructor() { }


    /**
     * Fitness Function
     * @param {Array} pattern Pattern 
     */
    compute(pattern) {
        let list = pattern.sequences.tolist();
        let b = 0;
        for (let i = 0; i < list.length; i++) {
            let p = list[i];
            let x = p2x(p);
            let z = x2z(x);
            b += balance(z);
        }

        return b/3.0;
    }
}




/**
 * Fitness Balance Evenness Entropy 
 */
class FitnessBEH {
    _name = "Fitness BEH"
    constructor() { }

    /**
     * Fitness Function
     * @param {Array} pattern Pattern 
     */
    compute(pattern) {
        let list = pattern.sequences.tolist();
        let beh = [];
        for (let i = 0; i < list.length; i++) {
            let p = list[i];
            let x = p2x(p);
            let z = x2z(x);
            let ioi = IOI(p);
            beh.push(balance(z) * evenness(z) * entropy(ioi));
        }

        return beh;
    }
}


/**
 * Initialization
 */
const fitnessStrategyManager = new FitnessStrategyManager();