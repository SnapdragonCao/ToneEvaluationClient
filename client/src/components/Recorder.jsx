import {useState} from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import AudioReactRecorder, { RecordState } from 'audio-react-recorder';

export default function Recorder({
  setPitch,
  setPeriodicity
}) {
  // const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
  //   blobPropertyBag: { type: 'audio/wav' },
  //   onStop: async(blobUrl, blob) => {
  //     // Update the blob file to the server
  //     const formData = new FormData();
  //     formData.append('soundFile', blob, 'input.wav');
  //     formData.append('name', 'test');
  //     const response = await fetch('http://localhost:5000/api/inference', {
  //       method: 'POST',
  //       body: formData
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //   }
  // });

  const [recording, setRecording] = useState(RecordState.STOP);
  const [blobUrl, setBlobUrl] = useState(null);
  const [buttonText, setButtonTest] = useState('Press to record');
  async function onStop(audio) {
    setBlobUrl(audio.url);
    const blob = audio.blob
    // Update the blob file to the server
    const formData = new FormData();
    formData.append('soundFile', blob, 'input.wav');
    formData.append('name', 'test');
    const response = await fetch('http://localhost:5000/api/inference', {
      method: 'POST',
      body: formData
    });
    const {pitch, periodicity} = await response.json();
    setPitch(pitch);
    setPeriodicity(periodicity);
  }
  return (
    <div>
      {/* <p>{status}</p>
      <button onClick={startRecording}>Start</button>
      <button onClick={stopRecording}>Stop</button>
      <audio src={mediaBlobUrl} autoPlay controls /> */}

      <div className='hidden'>
        <AudioReactRecorder
          state={recording}
          onStop={onStop}
        />
      </div>
      <button
        onMouseDown={() => {setRecording(RecordState.START)}}
        onMouseUp={() => {setRecording(RecordState.STOP)}}
      >{buttonText}</button>
      {/* <audio src={blobUrl} autoPlay controls /> */}
    </div>
  )
}