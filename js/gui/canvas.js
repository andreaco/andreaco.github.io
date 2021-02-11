let kickColor  = '#f2711c'
let snareColor = '#2185d0'
let hihatColor = '#a333c8'


function drawEuclideanBase(ctx, w, h, radius, seq) {
    let center = [h / 2, w / 2]
    let theta = 0
    let x = center[0] + Math.cos(theta) * radius
    let y = center[1] + Math.sin(theta) * radius
    ctx.beginPath();
    ctx.strokeStyle = '#434c5e'
    ctx.lineWidth = 5;
    let firstPoint = -1;
    for (let i = 0; i < seq.length; ++i) {

        if (firstPoint == -1) firstPoint = i

        theta = 2 * Math.PI * i / seq.length
        x = center[0] + Math.cos(theta) * radius
        y = center[1] + Math.sin(theta) * radius

        ctx.lineTo(x, y);

    }
    if (firstPoint != -1) {
        theta = 2 * Math.PI * firstPoint / seq.length
        x = center[0] + Math.cos(theta) * radius
        y = center[1] + Math.sin(theta) * radius

        ctx.lineTo(x, y);
    }
    ctx.stroke();
}

function drawEuclideanSteps(ctx, w, h, radius, count, seq, color) {
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


function drawSequences(count) {
    // Canvas vars
    var canvas = document.getElementById('circles');
    var ctx = canvas.getContext('2d');

    // Utility vars
    var w = canvas.width;
    var h = canvas.height;
    var status = count / kick_pattern.length

    var radius = 0.45 * w
    var center = [h / 2, w / 2]

    //Backgroun clear 
    ctx.clearRect(0, 0, w, h, radius);
    drawEuclideanBase(ctx, w, h, radius, kick_pattern)
    drawEuclideanSteps(ctx, w, h, radius, count, kick_pattern, kickColor)

    drawEuclideanBase(ctx, w, h, radius * 0.7, snare_pattern)
    drawEuclideanSteps(ctx, w, h, radius * 0.7, count, snare_pattern, snareColor)

    drawEuclideanBase(ctx, w, h, radius * 0.4, hihat_pattern)
    drawEuclideanSteps(ctx, w, h, radius * 0.4, count, hihat_pattern, hihatColor)
}

function drawBalance() {
    // Canvas vars
    var canvas = document.getElementById('balance');
    var ctx = canvas.getContext('2d');

    // Utility vars
    var w = canvas.width;
    var h = canvas.height;

    var radius = 0.45 * w
    var center = [h / 2, w / 2]

    ctx.clearRect(0, 0, w, h, radius);

    // Outer circle
    drawEuclideanBase(ctx, w, h, radius, kick_pattern)

    drawBalanceCenter(ctx, w, h, radius, kick_pattern, kickColor)
    drawBalanceCenter(ctx, w, h, radius, snare_pattern, snareColor)
    drawBalanceCenter(ctx, w, h, radius, hihat_pattern, hihatColor)

    drawBalanceSteps(ctx, w, h, radius, kick_pattern, kickColor, 14)
    drawBalanceSteps(ctx, w, h, radius, snare_pattern, snareColor, 10)
    drawBalanceSteps(ctx, w, h, radius, hihat_pattern, hihatColor, 6)

}

function drawBalanceCenter(ctx, w, h, radius, seq, color) {
    var center = [h / 2, w / 2]

    let balanceX = 0;
    let balanceY = 0;
    let N = 0;

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
    balanceX /= N
    balanceY /= N
    ctx.beginPath();
    ctx.arc(balanceX, balanceY, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();

    ctx.beginPath();
    ctx.strokeStyle = color
    ctx.lineWidth = 3;
    ctx.lineTo(center[0], center[1])
    ctx.lineTo(balanceX, balanceY);
    ctx.stroke();
}

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

function drawEvenness() {
    // Canvas vars
    var canvas = document.getElementById('evenness');
    var ctx = canvas.getContext('2d');

    // Utility vars
    var w = canvas.width;
    var h = canvas.height;

    var radius = 0.45 * w;
    var center = [h / 2, w / 2];

    ctx.clearRect(0, 0, w, h, radius);

    let kick_evenness = evenness(x2z(p2x(kick_pattern)));
    let snare_evenness = evenness(x2z(p2x(snare_pattern)));
    let hihat_evenness= evenness(x2z(p2x(hihat_pattern)));
    let tot_evenness = (kick_evenness + snare_evenness + hihat_evenness)/3;

    drawColumn(ctx, w, h, w / 5, kick_evenness, w * 0 / 4, kickColor);
    drawColumn(ctx, w, h, w / 5, snare_evenness, w * 1 / 4, snareColor);
    drawColumn(ctx, w, h, w / 5, hihat_evenness, w * 2 / 4, hihatColor);
    drawColumn(ctx, w, h, w / 5, tot_evenness, w * 3 / 4, "#00aaaa");
}

function drawEntropy() {
    // Canvas vars
    var canvas = document.getElementById('entropy');
    var ctx = canvas.getContext('2d');

    // Utility vars
    var w = canvas.width;
    var h = canvas.height;

    var radius = 0.45 * w;
    var center = [h / 2, w / 2];

    ctx.clearRect(0, 0, w, h, radius);

    let kick_entropy = entropy(IOI(kick_pattern));
    let snare_entropy = entropy(IOI(snare_pattern));
    let hihat_entropy= entropy(IOI(hihat_pattern));
    let tot_entropy = (kick_entropy + snare_entropy + hihat_entropy)/3;

    drawColumn(ctx, w, h, w / 5, kick_entropy, w * 0 / 4, kickColor);
    drawColumn(ctx, w, h, w / 5, snare_entropy, w * 1 / 4, snareColor);
    drawColumn(ctx, w, h, w / 5, hihat_entropy, w * 2 / 4, hihatColor);
    drawColumn(ctx, w, h, w / 5, tot_entropy, w * 3 / 4, "#00aaaa");
}


function drawColumn(ctx, w, h, rectwidth, amount, xstart, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    let ystart = h - amount * h;
    ctx.rect(xstart, ystart, rectwidth, h - ystart);
    ctx.fill();
}

function draw(count) {
    drawSequences(count);
    drawBalance();
    drawEvenness();
    drawEntropy();
}