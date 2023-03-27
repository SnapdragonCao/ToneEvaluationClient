from flask_restful import Resource
from flask import request, jsonify
import penn
from pydub import AudioSegment
import torch
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

# Set parameters
hopsize = 0.005
fmin = 30.
fmax = 1000.

gpu = None
batch_size = 2048

checkpoint = penn.DEFAULT_CHECKPOINT
pad = False
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
    
    draw_test(pitch, periodicity)
    pitch_output = pitch[0].tolist()
    periodicity_output = periodicity[0].tolist()
    return jsonify({
      'pitch': pitch_output,
      'periodicity': periodicity_output
    })
  
def draw_test(pitch, periodicity):
    # Draw the contour
    mask = periodicity < 0.1
    # mask
    pitch_tensor = torch.masked_fill(pitch, mask, torch.nan)[0].cpu()
    pitch_tensor
    periodicity_tensor = periodicity.cpu()[0]
    plt.figure()
    plt.plot(pitch_tensor)
    plt.xlabel("Frame")
    plt.ylabel("Pitch (Hz)")
    plt.title("Pitch contour")
    plt.savefig('storage/pitch.png')
    plt.figure()
    plt.plot(periodicity_tensor)
    plt.xlabel("Periodicity")
    plt.ylabel("Count")
    plt.title("Periodicity histogram")
    plt.savefig('storage/periodicity.png')
    