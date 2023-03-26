from flask_restful import Resource
from flask import request, jsonify
import penn
from pydub import AudioSegment
import wave
import io

# Set parameters
hopsize = 0.005
fmin = 30.
fmax = 1000.

gpu = None
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
    sound_file.save('sound.wav') # Save the file to ./sound.wav

    track = AudioSegment.from_file('sound.wav', format='wav')
    track = track.set_channels(1) # convert to mono
    track.export('mono.wav', format='wav')
    audio = penn.load.audio('mono.wav')
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
    pitch_output = pitch[0].tolist()
    periodicity_output = periodicity[0].tolist()
    return jsonify({
      'pitch': pitch_output,
      'periodicity': periodicity_output
    })
    