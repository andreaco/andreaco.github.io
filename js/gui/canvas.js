// Colors to be used in the representations
let kickColor  = '#f2711caf'
let snareColor = '#2185d0af'
let hihatColor = '#a333c8af'

/**
 * Draws the underlying euclidean circle where the steps will be placed
 * @param {*} ctx Context to be used
 * @param {float} w Width of the canvas
 * @param {float} h Height of the canvas
 * @param {float} radius Radius of the circle
 * @param {Array} seq Sequence, used to retrieve the number of steps
 */
function drawEuclideanBase(ctx, w, h, radius, seq) {
    // Utility variables
    let center = [h / 2, w / 2];
    let theta = 0;
    let x = center[0] + Math.cos(theta) * radius;
    let y = center[1] + Math.sin(theta) * radius;

    // Setup drawing context
    ctx.beginPath();
    ctx.strokeStyle = '#434c5e';
    ctx.lineWidth = 5;
    
    // Draw the unit circle
    let firstPoint = -1;
    for (let i = 0; i < seq.length; ++i) {
        if (firstPoint == -1) firstPoint = i;
        theta = 2 * Math.PI * i / seq.length;
        x = center[0] + Math.cos(theta) * radius;
        y = center[1] + Math.sin(theta) * radius;
        ctx.lineTo(x, y);
    }

    // Connect to the first position encountered
    if (firstPoint != -1) {
        theta = 2 * Math.PI * firstPoint / seq.length
        x = center[0] + Math.cos(theta) * radius
        y = center[1] + Math.sin(theta) * radius

        ctx.lineTo(x, y);
    }
    ctx.stroke();

}

/**
 * Draws the dots representing an onset
 * @param {*} ctx Context to be used
 * @param {float} w Width of the canvas
 * @param {float} h Height of the canvas
 * @param {float} radius Radius of the circle
 * @param {int} count Highlights the active step in the sequencer
 * @param {Array} seq Sequence to draw
 * @param {string} color Color of the dots
 */
function drawEuclideanSteps(ctx, w, h, radius, count, seq, color) {
    let center = [h / 2, w / 2];
    let theta = 0;
    let x = center[0] + Math.cos(theta) * radius;
    let y = center[1] + Math.sin(theta) * radius;

    for (let i = 0; i < seq.length; ++i) {
        if (seq[i] > 0) {
            theta = 2 * Math.PI * i / seq.length
            x = center[0] + Math.cos(theta) * radius
            y = center[1] + Math.sin(theta) * radius
            ctx.beginPath();
            if (i == count) {
                ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
                ctx.fillStyle = '#a3be8c';
            }
            else {
                ctx.arc(x, y, 8, 0, 2 * Math.PI, false);
                ctx.fillStyle = color;
            }
            ctx.fill();
        }
    }
}

/**
 * Draws the entire euclidean representation on the "circles" canvas
 * @param {int} count Current active step of the sequencer
 */
function drawSequences(count) {
    // Canvas vars
    var canvas = document.getElementById('circles');
    var ctx = canvas.getContext('2d');

    // Utility vars
    var w = canvas.width;
    var h = canvas.height;
    var radius = 0.36 * w

    //Backgroun clear 
    ctx.clearRect(0, 0, w, h);
    
    // Draws external kick pattern
    drawEuclideanBase(ctx, w, h, radius, kick_pattern)
    drawEuclideanSteps(ctx, w, h, radius, count, kick_pattern, kickColor)
    
    // Draws central snare pattern
    drawEuclideanBase(ctx, w, h, radius * 0.7, snare_pattern)
    drawEuclideanSteps(ctx, w, h, radius * 0.7, count, snare_pattern, snareColor)

    // Draws internal hihat pattern
    drawEuclideanBase(ctx, w, h, radius * 0.4, hihat_pattern)
    drawEuclideanSteps(ctx, w, h, radius * 0.4, count, hihat_pattern, hihatColor)
}



/**
 * Draws the internal line in the balance representation
 * @param {*} ctx Context to be used
 * @param {float} w Width of the canvas
 * @param {float} h Height of the canvas
 * @param {float} radius Radius of the circle
 * @param {Array} seq Sequence to draw
 * @param {string} color Color of the dots
 */
function drawBalanceCenter(ctx, w, h, radius, seq, color) {
    var center = [h / 2, w / 2]
    let balanceX = 0;
    let balanceY = 0;
    let N = 0;

    // Compute balance (the center of mass)
    for (let i = 0; i < seq.length; ++i) {
        if (seq[i] > 0) {
            theta = 2 * Math.PI * i / seq.length
            x = center[0] + Math.cos(theta) * radius
            y = center[1] + Math.sin(theta) * radius

            balanceX += x
            balanceY += y
            N += 1;
        }
    }

    // Normalize the balance
    balanceX /= N;
    balanceY /= N;

    // Draws the dot on the tip of the line
    ctx.beginPath();
    ctx.arc(balanceX, balanceY, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();

    // Draws the line from the center to the balance point
    ctx.beginPath();
    ctx.strokeStyle = color
    ctx.lineWidth = 3;
    ctx.lineTo(center[0], center[1])
    ctx.lineTo(balanceX, balanceY);
    ctx.stroke();
}

/**
 * Draws the external representation of the sequence in balance
 * @param {*} ctx Context to be used
 * @param {float} w Width of the canvas
 * @param {float} h Height of the canvas
 * @param {float} radius Radius of the circle
 * @param {Array} seq Sequence to draw
 * @param {string} color Color of the dots
 * @param {float} size Size of the step dot
 */
function drawBalanceSteps(ctx, w, h, radius, seq, color, size) {
    // Active step
    let center = [h / 2, w / 2]
    let theta = 0
    let x = center[0] + Math.cos(theta) * radius
    let y = center[1] + Math.sin(theta) * radius
    for (let i = 0; i < seq.length; ++i) {
        if (seq[i] > 0) {
            theta = 2 * Math.PI * i / seq.length
            x = center[0] + Math.cos(theta) * radius
            y = center[1] + Math.sin(theta) * radius
            ctx.beginPath();


            ctx.arc(x, y, size, 0, 2 * Math.PI, false);
            ctx.fillStyle = color;

            ctx.fill();
        }
    }
}

/**
 * Draws the entire balance representation on the "balance" canvas
 */
function drawBalance() {
    // Canvas vars
    var canvas = document.getElementById('balance');
    var ctx = canvas.getContext('2d');

    // Utility vars
    var w = canvas.width;
    var h = canvas.height;

    var radius = 0.36 * w

    ctx.clearRect(0, 0, w, h);

    // Compute balance for displaying the score
    let kick_balance  = trimValue(balance(x2z(p2x(kick_pattern))));
    let snare_balance = trimValue(balance(x2z(p2x(snare_pattern))));
    let hihat_balance = trimValue(balance(x2z(p2x(hihat_pattern))));
    
    // Display the score as numbers
    ctx.font = "17px Arial";    
    ctx.fillStyle = kickColor;
    ctx.fillText(kick_balance  + "%", w *  2 / 7 + 8, 20); 
    ctx.fillStyle = snareColor;
    ctx.fillText(snare_balance + "%", w *  3 / 7 + 8, 20); 
    ctx.fillStyle = hihatColor;
    ctx.fillText(hihat_balance + "%", w *  4 / 7 + 8, 20); 



    // Outer circle
    drawEuclideanBase(ctx, w, h, radius, kick_pattern)

    // Balance internal representaion
    drawBalanceCenter(ctx, w, h, radius, kick_pattern, kickColor)
    drawBalanceCenter(ctx, w, h, radius, snare_pattern, snareColor)
    drawBalanceCenter(ctx, w, h, radius, hihat_pattern, hihatColor)

    // Draws the steps of the sequences
    drawBalanceSteps(ctx, w, h, radius, kick_pattern, kickColor, 13)
    drawBalanceSteps(ctx, w, h, radius, snare_pattern, snareColor, 9)
    drawBalanceSteps(ctx, w, h, radius, hihat_pattern, hihatColor, 5)

}

/**
 * Draws the polygons obtained from the connection between the steps
 * @param {*} ctx Context to be used
 * @param {float} w Width of the canvas
 * @param {float} h Height of the canvas
 * @param {float} radius Radius of the circle
 * @param {string} color Color of the dots
 * @param {Array} seq Sequence to draw
 */
function drawEvennessPolygon(ctx, w, h, radius, color, seq) {
    let center = [h / 2, w / 2];
    let theta = 0;
    let x = center[0] + Math.cos(theta) * radius;
    let y = center[1] + Math.sin(theta) * radius;

    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;

    let firstPoint = -1;
    for (let i = 0; i < seq.length; ++i) {
        if(seq[i]) {
            if (firstPoint == -1) firstPoint = i;

            theta = 2 * Math.PI * i / seq.length;
            x = center[0] + Math.cos(theta) * radius;
            y = center[1] + Math.sin(theta) * radius;

            ctx.lineTo(x, y);
        }

    }

    if (firstPoint != -1) {
        theta = 2 * Math.PI * firstPoint / seq.length
        x = center[0] + Math.cos(theta) * radius
        y = center[1] + Math.sin(theta) * radius

        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

/**
 * Utility function to trim the values to 2 digits (percentage)
 * @param {float} val val to be transformed in a percentage
 */
function trimValue(val) {
    return Math.floor(100*val);
}

/**
 * Draws the entire evenness representation in the "evenness" canvas
 */
function drawEvenness() {
    // Canvas vars
    var canvas = document.getElementById('evenness');
    var ctx = canvas.getContext('2d');

    // Utility vars
    var w = canvas.width;
    var h = canvas.height;
    
    var radius = 0.36 * w;

    ctx.clearRect(0, 0, w, h);
    
    // Compute values for display
    let kick_evenness = trimValue(evenness(x2z(p2x(kick_pattern))));
    let snare_evenness = trimValue(evenness(x2z(p2x(snare_pattern))));
    let hihat_evenness= trimValue(evenness(x2z(p2x(hihat_pattern))));

    // Diplay values
    ctx.font = "17px Arial";
    ctx.fillStyle = kickColor;
    ctx.fillText(kick_evenness  + "%", w *  2 / 7 + 8, 20); 
    ctx.fillStyle = snareColor;
    ctx.fillText(snare_evenness + "%", w *  3 / 7 + 8, 20); 
    ctx.fillStyle = hihatColor;
    ctx.fillText(hihat_evenness + "%", w *  4 / 7 + 8, 20); 

    // Kick Polygon
    drawEuclideanBase(ctx, w, h, radius * 0.4, hihat_pattern)
    drawEvennessPolygon(ctx, w, h, radius * 0.4, hihatColor, hihat_pattern)
    drawEuclideanSteps(ctx, w, h, radius * 0.4, -1, hihat_pattern, hihatColor)

    // Snare Polygon
    drawEuclideanBase(ctx, w, h, radius * 0.7, snare_pattern)
    drawEvennessPolygon(ctx, w, h, radius * 0.7, snareColor, snare_pattern)
    drawEuclideanSteps(ctx, w, h, radius * 0.7, -1, snare_pattern, snareColor)

    // Hihat Polygon
    drawEuclideanBase(ctx, w, h, radius, kick_pattern)
    drawEvennessPolygon(ctx, w, h, radius, kickColor,  kick_pattern)
    drawEuclideanSteps(ctx, w, h, radius, -1, kick_pattern, kickColor)
}


/**
 * Draws the entire entropy representation in the "evenness" canvas
 */
function drawEntropy() {
    // Canvas vars
    var canvas = document.getElementById('entropy');
    var ctx = canvas.getContext('2d');

    // Utility vars
    var w = canvas.width;
    var h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Compute evennes
    let kick_entropy  = entropy(IOI(kick_pattern));
    let snare_entropy = entropy(IOI(snare_pattern));
    let hihat_entropy = entropy(IOI(hihat_pattern));
    let tot_entropy = (kick_entropy + snare_entropy + hihat_entropy)/3;

    // Outlines
    ctx.strokeStyle = '#434c5e';
    ctx.strokeRect(w * 0 / 4, 0, w / 5, h);
    ctx.strokeRect(w * 1 / 4, 0, w / 5, h);
    ctx.strokeRect(w * 2 / 4, 0, w / 5, h);
    ctx.strokeRect(w * 3 / 4, 0, w / 5, h);

    
    // Fill relative to percentage
    drawColumn(ctx, w, h, w / 5, kick_entropy,  w * 0 / 4, kickColor);
    drawColumn(ctx, w, h, w / 5, snare_entropy, w * 1 / 4, snareColor);
    drawColumn(ctx, w, h, w / 5, hihat_entropy, w * 2 / 4, hihatColor);
    drawColumn(ctx, w, h, w / 5, tot_entropy,   w * 3 / 4, "#00aaaa");

    // Display value
    ctx.font = "17px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(trimValue(kick_entropy)  + "%",  w/20 + w * 0 / 4, h - 10); 
    ctx.fillText(trimValue(snare_entropy) + "%",  w/20 + w * 1 / 4, h - 10); 
    ctx.fillText(trimValue(hihat_entropy) + "%",  w/20 + w * 2 / 4, h - 10); 
    ctx.fillText(trimValue(tot_entropy)   + "%",  w/20 + w * 3 / 4, h - 10);
}


/**
 * Draws the filling relative to amount
 * @param {*} ctx Context to be used
 * @param {float} w Width of the canvas
 * @param {float} h Height of the canvas
 * @param {float} rectwidth width of the rectangle
 * @param {*} amount amount to be filled (between 0 and 1)
 * @param {*} xstart x position (upper left/downer left)
 * @param {*} color  color to be used while filling the column
 */
function drawColumn(ctx, w, h, rectwidth, amount, xstart, color) {
    ctx.fillStyle = color;
    ctx.beginPath();

    let ystart = h - amount * h;
    ctx.rect(xstart, ystart, rectwidth, h - ystart);
    ctx.fill();
}


/**
 * Rendering function that draws all the representations
 * @param {int} count Active position of the sequencer
 */
function draw(count) {
    drawSequences(count);
    drawBalance();
    drawEvenness();
    drawEntropy();
}
