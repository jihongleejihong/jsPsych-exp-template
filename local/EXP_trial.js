preparation =  
{
    type: 'psychophysics',
    response_type: 'key',
    choices: ['a'],
    canvas_width: function () { return ws.canvas_size[0] },
    canvas_height: function () { return ws.canvas_size[1] },
    background_color: ws.bg_color,
    stimuli: [fixation_obj],
    origin_center: 'true',
    on_start: function () {
        jsPsych.getDisplayContainerElement().style.backgroundColor = ws.bg_color;
        jsPsych.getDisplayContainerElement().style.cursor = 'none';
    },
    data: {
        'content': 'data',
        'trial_num': jsPsych.timelineVariable('trial_num'),
        'stdev': jsPsych.timelineVariable('stdev'),
        'block_type': jsPsych.timelineVariable('b_type')
    }
    // mouse_up_func: function (event) {
    //     context = jsPsych.currentTrial().context;

    //     current_X = event.offsetX
    //     current_Y = event.offsetY

    // },
    // mouse_move_func: function (event) {

    //     context = jsPsych.currentTrial().context;

    //     current_X = event.offsetX
    //     current_Y = event.offsetY

    //     if ((Math.abs(current_X - ws.cx) < 1 * ws.pxpd) && (Math.abs(current_Y - ws.cy) < 1 * ws.pxpd)) {
    //         jsPsych.currentTrial().stim_array[0].line_color = "#ffffff";
    //         jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startX = ws.cx;
    //         jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startY = ws.cy;
    //     } else if ((Math.abs(current_X - jsPsych.currentTrial().stim_array[2].startX)) < 1 * ws.pxpd && (Math.abs(current_Y - jsPsych.currentTrial().stim_array[2].startY)) < 1 * ws.pxpd) {
    //         jsPsych.currentTrial().stim_array[2].text_color = '#ffffff'
    //         jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startX = current_X
    //         jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startY = current_Y
    //     } else {
    //         jsPsych.currentTrial().stim_array[0].line_color = "#000000";
    //         jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startX = current_X
    //         jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startY = current_Y
    //         jsPsych.currentTrial().stim_array[2].content = "?"
    //         jsPsych.currentTrial().stim_array[2].text_color = "#000000"
    //         jsPsych.currentTrial().stim_array[1].scale = 0;
    //         jsPsych.currentTrial().stim_array[0].line_length = 0.5 * ws.pxpd;

    //         jsPsych.currentTrial().stim_array[1].img.attributes.src.nodeValue = tutorial_images[0]
    //     }
    // },
    // mouse_down_func: function (event) {
    //     current_X = jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startX;
    //     current_Y = jsPsych.currentTrial().stim_array[jsPsych.currentTrial().stim_array.length - 1].startY;
    //     tutorial_path = jsPsych.currentTrial().stim_array[1].img.src;
    //     if ((Math.abs(current_X - ws.cx) < 1 * ws.pxpd) && (Math.abs(current_Y - ws.cy) < 1 * ws.pxpd)) {
    //         jsPsych.currentTrial().response_ends_trial = true;
    //     } else if ((Math.abs(current_X - jsPsych.currentTrial().stim_array[2].startX)) < 1 * ws.pxpd && (Math.abs(current_Y - jsPsych.currentTrial().stim_array[2].startY)) < 1 * ws.pxpd) {
    //         jsPsych.currentTrial().response_ends_trial = false;
    //         if (jsPsych.currentTrial().stim_array[2].content == "?") {
    //             jsPsych.currentTrial().stim_array[1].scale = img_scale;
    //             jsPsych.currentTrial().stim_array[0].line_length = 0;
    //             jsPsych.currentTrial().stim_array[2].content = ">"
    //         } else {
    //             current_img_index = tutorial_images.indexOf(jsPsych.currentTrial().stim_array[1].img.attributes.src.nodeValue);
    //             jsPsych.currentTrial().stim_array[1].img.attributes.src.nodeValue = tutorial_images[(current_img_index + 1) % tutorial_images.length]
    //         }
    //     } else {
    //         jsPsych.currentTrial().response_ends_trial = false;
    //     }
    // }
}

set_display = {
    type: 'psychophysics',
    choices: jsPsych.NO_KEYS,
    canvas_width: function () { return ws.canvas_size[0] },
    canvas_height: function () { return ws.canvas_size[1] },
    origin_center: 'true',
    background_color: ws.bg_color,
    trial_duration: ws.ISI + ws.stim_present,
    data: {
        'content': 'set_display',
        'trial_num': jsPsych.timelineVariable('trial_num'),
        'stdev': jsPsych.timelineVariable('stdev'),
        'test_level': jsPsych.timelineVariable('test_level'),
        'block_type': jsPsych.timelineVariable('b_type')
    },
    stimuli: function () {
        var stim = [];
        var set = [];
        var array = [];
        var trial_num = jsPsych.timelineVariable('trial_num', true);
        var stdev = jsPsych.timelineVariable('stdev', true);
        var test_level = jsPsych.timelineVariable('test_level', true);
    
        set_stimSet = distnorm((jStat.rand(1, ws.setSize)[0]), test_level, stdev)
        

        var array = mk_grid_coord(ws.nGrid, ws.grid_interval, 0.3 * ws.pxpd, 1);

        var rand_allocate = jsPsych.randomization.shuffle(range(ws.setSize, 0, 1))

        for (i = 0; i < ws.setSize; i++) {
        stim[i] = gabor_obj(array[0][rand_allocate[i]], array[1][rand_allocate[i]], set_stimSet[i], 90*(-1 + 2 * Math.random()))

        set.push(stim[i])
        }
  
        return set
    }
}

response =  {
    type: 'psychophysics',
    response_type: 'key',
    choices: [',', '.'],
    canvas_width: function () { return ws.canvas_size[0] },
    canvas_height: function () { return ws.canvas_size[1] },
    background_color: ws.bg_color,
    show_start_time: function () { return (ws.ISI) }, // ISI
    origin_center: 'true',
    data: {
        'content': 'resp',
        'trial_num': jsPsych.timelineVariable('trial_num'),
        'stdev': jsPsych.timelineVariable('stdev'),
        'test_level': jsPsych.timelineVariable('test_level'),
        'block_type': jsPsych.timelineVariable('b_type')
    },
    stimuli: [resp_obj]
}