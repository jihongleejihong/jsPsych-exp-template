

function range(size, start, step = 1) {

    /* generate sequential numbers
     size: size of vector (integer)
     start: start value of array
     step: step size of values */

    return Array(size).fill(start).map((x, y) => x + step * y)
}



function generateCopula(rows, columns, correlation) {
    //https://en.wikipedia.org/wiki/Copula_(probability_theory)

    //Create uncorrelated standard normal samples
    var normSamples = jStat.randn(rows, columns);

    //Create lower triangular cholesky decomposition of correlation matrix 
    var A = jStat(jStat.cholesky(correlation));

    //Create correlated samples through matrix multiplication
    var normCorrSamples = A.multiply(normSamples);

    //Convert to uniform correlated samples over 0,1 using normal CDF
    var normDist = jStat.normal(0, 1);
    var uniformCorrSamples = normCorrSamples.map(function (x) { return normDist.cdf(x); });

    return uniformCorrSamples;

}
function pol2cart(th, r, z = 1) {
    var x = r * Math.cos(th);
    var y = r * Math.sin(th);
    return [x, y, z]
}


function generateCorrLognorm(number, mu, sigma, correlation) {

    //Create uniform correlated copula
    var copula = generateCopula(mu.length, number, correlation);

    //Create unique lognormal distribution for each marginal
    var lognormDists = [];
    for (var i = 0; i < mu.length; i++) {
        lognormDists.push(jStat.lognormal(mu[i], sigma[i]));
    }

    //Generate correlated lognormal samples using the inverse transform method:
    //https://en.wikipedia.org/wiki/Inverse_transform_sampling
    var lognormCorrSamples = copula.map(function (x, row, col) { return lognormDists[row].inv(x); });
    return lognormCorrSamples;
}





function lab_color_pick(l, center_a, center_b, r, angle) {
    var coord = pol2cart(angle / 180 * Math.PI, r)
    // var a = Math.sqrt(Math.pow(r, 2) / (Math.pow(Math.tan(angle * Math.PI / 180)), 2) + 1)
    // var b = Math.tan(angle * Math.PI / 180) * a
    return Spectra({ l: l, a: center_a + coord[0], b: center_b + coord[1] })
}
function perceived_size(physical_size) {
    return Math.pow(physical_size, 0.76)
}

function circle_size(radius) {
    return Math.PI * Math.pow(radius, 2)
}

function rs_for_sizes(n, min_r, max_r) {
    var phy_sizes = []
    var phy_r = []
    var perceiv_sizes = range(n,
        perceived_size(circle_size(min_r)),
        ((perceived_size(circle_size(max_r)) - perceived_size(circle_size(min_r))) / (n - 1)
        ))
    perceiv_sizes.forEach(num => {
        phy_sizes.push(Math.pow(num, 2.2))
    })
    phy_sizes.forEach(num => {
        phy_r.push(Math.sqrt(num / Math.PI))
    })
    return phy_r
}

function cvt_psy2phy_area(psy_set) {
    var phy_area = []
    var phy_rad = []

    phy_area = psy_set.map(function (x) { return Math.pow(x, 1 / 0.76) });
    phy_rad = phy_area.map(function (x) { return Math.sqrt(x / Math.PI) });
    return phy_rad
}


function rotate_xy(array, tilt, center_x = 0, center_y = 0) {
    // var rad = tilt * Math.PI / 180
    var rad = (tilt + 90) * Math.PI / 180
    var rx = []
    var ry = []

    // rx = array.map(function(x) { return ( (x[0] - center_x) * Math.cos(rad) + (x[1] - center_y) * Math.sin(rad) + center_x)});
    // ry = array.map(function(x) { return ( (x[1] - center_y) * Math.cos(rad) + (x[0] - center_x) * Math.sin(rad) + center_y)});            


    for (var i in range(array[0].length, 0, 1)) {
        rx[i] = (array[0][i] - center_x) * Math.sin(rad) + (array[1][i] - center_y) * Math.cos(rad) + center_x
        ry[i] = (array[1][i] - center_y) * Math.sin(rad) - (array[0][i] - center_x) * Math.cos(rad) + center_y
    }
    return [rx, ry]
}


// function mk_correlated_set(nStim, mu, sigma, correlation, tol = 0.0001) {
//     var set = [];
//     var diff = 0.5;
//     var unifSamples;
//     var covmat = [];
//     if (correlation == 1) {
//         covmat = [[1, 1], [1, 1]];
//     } else if (correlation == 0) {
//         covmat = [[1, 0], [0, 1]];
//     }

//     while (diff > tol) {
//         unifSamples = generateCopula(2, nStim, covmat);
//         diff = Math.abs(jStat.corrcoeff(unifSamples[0], unifSamples[1]) - correlation)
//     }

//     set = [distnorm(unifSamples[0], mu[0], sigma[0]), distnorm(unifSamples[1], mu[1], sigma[1])];

//     return set
// }

// function mk_correlated_set(nStim, mu, ranges, correlation, tol = 0.0001) {
//     var set = [];
//     var diff = 0.5;
//     var unifSamples;
//     var covmat = [];
//     if (correlation == 1) {
//         covmat = [[1, 1], [1, 1]];
//     } else if (correlation == 0) {
//         covmat = [[1, 0], [0, 1]];
//     }

//     while (diff > tol) {
//         unifSamples = generateCopula(2, nStim, covmat);
//         diff = Math.abs(jStat.corrcoeff(unifSamples[0], unifSamples[1]) - correlation)
//     }
//     set = [unifSamples[0].map(function (x) { return (mu[0] + ranges[0] / 2 * (-1 + 2 * x)) }), unifSamples[1].map(function (x) { return (mu[1] + ranges[1] / 2 * (-1 + 2 * x)) })]


//     return set
// }
function mk_correlated_set(nStim, mu, ranges, target_r, tol = 0.0001) {
    var set = [];
    var diff = 999;

    var set;
    while (diff > tol) {
        if (target_r == 1) {

            set = [range(nStim, mu[0] - ranges[0] / 2, ranges[0] / (nStim - 1)), range(nStim, mu[1] - ranges[1] / 2, ranges[1] / (nStim - 1))];

        } else if (target_r == -1) {

            set = [range(nStim, mu[0] - ranges[0] / 2, ranges[0] / (nStim - 1)), range(nStim, mu[1] + ranges[1] / 2, -(ranges[1] / (nStim - 1)))];

        }

        else if (target_r == 0) {

            set = [jsPsych.randomization.shuffle(range(nStim, mu[0] - ranges[0] / 2, ranges[0] / (nStim - 1))), jsPsych.randomization.shuffle(range(nStim, mu[1] - ranges[1] / 2, ranges[1] / (nStim - 1)))];

        }
        diff = Math.abs(target_r - jStat.corrcoeff(set[0], set[1]))

    }
    return set
}
// function polygonal_coords(n, radius, tilt = 0, center_x = 0, center_y = 0, x_jitter = 0, y_jitter = x_jitter) {
//     var angle_deg = range(n, 0, 360 / n);
//     var angle_rad = []
//     angle_deg.forEach(num => {
//         angle_rad.push(num * Math.PI / 180)
//     });

//     var xposvector = [];
//     var yposvector = [];

//     angle_rad.forEach(num => {
//         xposvector.push(-x_jitter + 2 * x_jitter * Math.random() + Math.cos(num) * radius + center_x),
//             yposvector.push(-y_jitter + 2 * y_jitter * Math.random() + Math.sin(num) * radius + center_y)
//     })

//     var coords = rotate_xy([xposvector, yposvector], tilt, center_x, center_y)

//     return coords
// }

function distnorm(mat, m, sd) {
    var z_mat = [];
    var new_mat = [];
    mat.forEach(num => {
        z_mat.push((num - jStat.mean(mat)) / jStat.stdev(mat))
    })
    z_mat.forEach(num => {
        new_mat.push(m + sd * num)
    })

    return new_mat
}


function mk_grid_coord(nGrid, interval, jitter = 0, rm_corner = 0) {
    var coords = [[], []];
    var remove_index = [];
    if (Math.sqrt(nGrid) % 1 != 0 || nGrid == 0) {
        var msg = 'please insert nGrid as a square number (e.g., 1, 4, 9, 16 ...)'
        console.error(msg);
    }
    sg_row = range(Math.sqrt(nGrid), 0, interval);
    sg_row = sg_row.map(function (x) { return (x - sg_row[sg_row.length - 1] / 2) });

    for (i = 0; i < nGrid; i++) {
        coords[0][i] = sg_row[i % sg_row.length]
        coords[1][i] = sg_row[parseInt(i / sg_row.length)]
        if (rm_corner == 1 && (coords[0][i] == sg_row[0] || coords[0][i] == sg_row[sg_row.length - 1]) && (coords[1][i] == sg_row[0] || coords[1][i] == sg_row[sg_row.length - 1])) {
            remove_index.push(i)
        }
    }
    if (rm_corner == 1) {
        for (i = 0; i < remove_index.length; i++) {
            coords[0].splice(remove_index[i] - i, 1);
            coords[1].splice(remove_index[i] - i, 1);
        }

    }
    coords[0] = coords[0].map(function (x) { return (x + (-jitter + 2 * jitter * Math.random())) });
    coords[1] = coords[1].map(function (x) { return (x + (-jitter + 2 * jitter * Math.random())) });
    return coords
}

function drawTriangle(context, btm_side, height, posX = 0, posY = 0, angle = 0, fillcolor = '#000000') {

    var base_triangle = [[-btm_side / 2, btm_side / 2, 0], [height / 2, height / 2, -height / 2]];   // [[x][y]] of [btm_left, btm_right, top_center ]/

    var tilted_triangle = rotate_xy(base_triangle, angle);
    context.translate(ws.cx + posX, ws.cy + posY)
    context.beginPath();
    context.moveTo(tilted_triangle[0][0], tilted_triangle[1][0]); //bottom-left
    context.lineTo(tilted_triangle[0][1], tilted_triangle[1][1]); //bottom-right
    context.lineTo(tilted_triangle[0][2], tilted_triangle[1][2]); // top-center


    // // the outline
    // context.lineWidth = 1;
    // context.strokeStyle = fillcolor;
    // context.stroke();

    // the fill color
    context.fillStyle = fillcolor;
    context.fill();
    context.closePath();
    context.translate(-ws.cx - posX, -ws.cy - posY)  //restore starting point
}

function generateRandomCode(n) {
    let str = ''
    for (let i = 0; i < n; i++) {
        str += Math.floor(Math.random() * 10)
    }
    return str
}


// sample function that might be used to check if a subject has given
// consent to participate.
var check_consent = function (elem) {
    if (document.getElementById('consent_checkbox').checked) {
        return true;
    }
    else {
        alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
        return false;
    }
    return false;
};

function pixelperdegree(view_dist_mm, pxpermm) {

    var view_dist_px = view_dist_mm * pxpermm;
    var degperpx = 2 * Math.atan((1 / 2) / view_dist_px) * (180 / Math.PI);

    return (1 / degperpx)
}