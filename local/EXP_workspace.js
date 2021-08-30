// workspace
var ws = {
  setSize: 32,
  n_rep: 25,
  p_rep: 2,
  stim_present: 250,
  ISI: 250,
  n_block: 4,
  nGrid: 36
}

// basic parmeters based on measured screen information

// function run after the resize trial
var after_resize = function (trial) {
  jsPsych.data.addProperties({ SID: jsPsych.data.getURLVariable('SID') });
  jsPsych.getDisplayContainerElement().style.overflow = 'hidden'
  ws.bg_color = 'grey'
  ws.pxpd = pixelperdegree(600, jsPsych.data.get().filter({ trial_type: 'virtual-chinrest' }).values()[0].px2mm);
  ws.canvas_size = [window.innerWidth, window.innerHeight];
  ws.cx = ws.canvas_size[0] / 2;
  ws.cy = ws.canvas_size[1] / 2;
  ws.grid_interval = 4 * ws.pxpd;
  img_scale = Math.pow(((0.5 * ws.canvas_size[1]) / 500), 2); // scale for tutorial images
}


var fixation_obj = {
  obj_type: 'cross',
  line_color: '#000000',
  line_length: function () { return (0.5 * ws.pxpd) },
  startX: 'center',
  startY: 'center',
  origin_center: 'true'
}

var resp_obj = {
  obj_type: 'cross',
  line_color: '#ff0000',
  line_length: function () { return (0.5 * ws.pxpd) },
  startX: 'center',
  startY: 'center',
  origin_center: 'true'
}


// intro screen 
var instruction = {
  type: 'psychophysics',
  response_type: 'key',
  choice: ['a'],
  canvas_width: function () { return ws.canvas_size[0] },
  canvas_height: function () { return ws.canvas_size[1] },
  vert_button_margin: 0,
  horiz_button_margin: 0,
  background_color: ws.bg_color,
  on_start: function () {
    jsPsych.getDisplayContainerElement().style.backgroundColor = ws.bg_color;
    jsPsych.getDisplayContainerElement().style.cursor = '';
  },
  stimuli: [{
    obj_type: 'text',
    font: "20px 'Arial'",
    text_color: '#000000',
    content: function () {
      if (p_done == 0) {
        return ('This is practice. \n If you are ready, press <a> key to proceed.')
      } else if (p_done == 1) { return ('Practice is over. \n If you are ready to start the main experiment, press <a> key.') }
    },
    startX: 'center',
    startY: 'center',
    origin_center: 'true'
  }],
  on_finish: function () { }
};

// closing screen 
var closing = {
  type: 'html-button-response',
  on_start: function () { jsPsych.getDisplayContainerElement().style.backgroundColor = '' },
  stimulus: function () {
    return ('Thank you for participation! <br> Please copy the confirmation code below and paste on the mTurk page. <br><br> Your confirmation code: ' + jsPsych.data.get().values()[0].confirm_code + '<br><br>')
  },
  prompt: 'If you surely recorded the confirmation code, you may press the button to close the experiment',
  choices: ['Done'],
  margin_vertical: '10px'
};

// break screen 
var break_screen = {
  type: 'psychophysics',
  response_type: 'key',
  choices: ['a'],
  canvas_width: function () { return ws.canvas_size[0] },
  canvas_height: function () { return ws.canvas_size[1] },
  vert_button_margin: 0,
  horiz_button_margin: 0,
  background_color: ws.bg_color,
  on_start: function () {
    jsPsych.getDisplayContainerElement().style.backgroundColor = ws.bg_color,
      jsPsych.getDisplayContainerElement().style.cursor = '';
  },
  stimuli: [{
    obj_type: 'text',
    font: "20px 'Arial'",
    text_color: '#000000',
    content: 'Take a break and press <a> key to start the next block.',
    startX: 'center',
    startY: 'center',
    origin_center: 'true'
  }]
};

// display tutorial images
tutorial_obj = {
  obj_type: 'image',
  file: './src/tutorial-1.png',
  startX: 'center',
  startY: 'center',
  origin_center: 'true',
  scale: 0
}

// ? shape icon for tutorial display
tutorial_icon = {
  obj_type: 'text',
  content: '?',
  font: "100px 'Arial'",
  startX: function () { return ws.canvas_size[0] - 100 },
  startY: function () { return ws.canvas_size[1] - 100 },

  // origin_center: 'true'
}

var gabor_obj = function(posX = 0, posY = 0, deg = 0, phase_jit = 0){
  return{
  obj_type: 'gabor',
  startX: posX, // location in the canvas
  startY: posY,
  show_start_time: ws.ISI,
  show_end_time: ws.ISI + ws.stim_present, // from the trial start (ms),
  sf: 2 / ws.pxpd, // cycle per pixels
  phase: 90 + phase_jit,
  width: Math.round(2 * ws.pxpd),
  sc: Math.round(2 * ws.pxpd / 8),
  contrast: 100,
  tilt: 90 + deg,
  origin_center: 'true'
}}
