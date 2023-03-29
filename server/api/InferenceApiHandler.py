from flask_restful import Resource
from flask import request, jsonify
import penn
from pydub import AudioSegment
# import matplotlib
# matplotlib.use('Agg')
# import matplotlib.pyplot as plt
from . import utils

# Set parameters
hopsize = 0.005
fmin = 70.
fmax = 500.

gpu = 0
batch_size = 2048

checkpoint = penn.DEFAULT_CHECKPOINT
pad = True
interp_unvoiced_at = 0.1

class InferenceApiHandler(Resource):
  def get(self):
    return {
      'resultStatus': 'SUCCESS',
      'message': "Hello Api Handler"
      }

  def post(self):
    print("data received")
    sound_file = request.files['soundFile'] # Retrieve the file from data
    sound_file.save('storage/sound.wav') # Save the file to ./sound.wav

    track = AudioSegment.from_file('storage/sound.wav', format='wav')
    track = track.set_channels(1) # convert to mono
    track.export('storage/mono.wav', format='wav')
    audio = penn.load.audio('storage/mono.wav')
    pitch, periodicity = penn.from_audio(
      audio,
      penn.SAMPLE_RATE,
      hopsize=hopsize,
      fmin=fmin,
      fmax=fmax,
      checkpoint=checkpoint,
      batch_size=batch_size,
      pad=pad,
      interp_unvoiced_at=interp_unvoiced_at,
      gpu=gpu)
    
    pitch_list = pitch.cpu()[0].tolist()
    periodicity_list = periodicity.cpu()[0].tolist()
    valid_pitch= utils.validate(pitch_list, periodicity_list, 0.3, 10)
    smoothed_pitch = utils.smoother(valid_pitch, 10, 10)
    # draw_test(smoothed_pitch, periodicity_list)
    return jsonify({
      'pitch': smoothed_pitch,
      'periodicity': periodicity_list
    })
  
# def draw_test(pitch, periodicity):
#     plt.figure()
#     plt.plot(pitch)
#     plt.xlabel("Frame")
#     plt.ylabel("Pitch (Hz)")
#     plt.title("Pitch contour")
#     plt.savefig('storage/pitch.png')
#     plt.figure()
#     plt.plot(periodicity)
#     plt.xlabel("Periodicity")
#     plt.ylabel("Count")
#     plt.title("Periodicity histogram")
#     plt.savefig('storage/periodicity.png')
    