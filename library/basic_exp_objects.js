// init & finish pavlovia 

var pavlovia_init = {
    type: "pavlovia",
    command: "init"
};
var pavlovia_finish = {
    type: "pavlovia",

    command: "finish"
};

/* preload files in path lists
preload_list = [path1, path2] */
var preload_trial = {
    type: 'preload',
    auto_preload: true,
    show_progress_bar: true,
    images: function () { return (preload_list) }
}

// fullscreen on & off
var fullscreen_on = {
    type: 'fullscreen',
    fullscreen_mode: true
};
var fullscreen_off = {
    type: 'fullscreen',
    fullscreen_mode: false,
};

// display the viewing distance image
var viewing_distance = {
    type: 'image-button-response',
    stimulus: './src/view_dist.png',
    choices: ['Continue'],
    prompt: "<p>Please keep your viewing distance one arm-length away from the monitor during the experiment.</p>",
    on_start: function () { jsPsych.getDisplayContainerElement().style.backgroundColor = ws.bg_color },
};

/* generate random number
generateRandomCode(the number of digits) */
var gen_confirm_code = {
    type: 'call-function',
    func: function () {
        jsPsych.data.addProperties({ confirm_code: generateRandomCode(12) });
    }
}

/* record experiment_time (in sec) in data */
var experiment_time = {
    type: 'call-function',
    func: function () {
        jsPsych.data.addProperties({ exp_time: jsPsych.totalTime() / 1000 });
    }
}

