import { useState } from "react";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";

export default function Recorder({ setPitch, setPeriodicity }) {
  const [recording, setRecording] = useState(RecordState.STOP);
  const [blobUrl, setBlobUrl] = useState(null);

  async function onStop(audio) {
    setBlobUrl(audio.url);
    const blob = audio.blob;
    // Update the blob file to the server
    const formData = new FormData();
    formData.append("soundFile", blob, "input.wav");
    formData.append("name", "test");
    const response = await fetch("http://localhost:5000/inference", {
      method: "POST",
      body: formData,
    });
    const { pitch, periodicity } = await response.json();
    setPitch(pitch);
    setPeriodicity(periodicity);
  }
  return (
    <div className="my-8 flex w-1/2 items-center justify-evenly">
      <div className="hidden">
        <AudioReactRecorder state={recording} onStop={onStop} />
      </div>
      <button
        onClick={() => {
          setRecording(RecordState.START);
        }}
        type="button"
        className="btn-circle btn h-24 w-24 border-none bg-emerald-700 shadow-xl hover:bg-emerald-600"
      >
        Record
      </button>
      <button
        onClick={() => {
          setRecording(RecordState.STOP);
        }}
        type="button"
        className="btn-circle btn h-24 w-24 border-none bg-red-700 shadow-xl hover:bg-red-600"
      >
        Stop
      </button>
      {/* <audio src={blobUrl} autoPlay controls/> */}
    </div>
  );
}
