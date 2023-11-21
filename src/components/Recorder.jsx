import { useState, useContext, useCallback } from "react";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import { DictContext } from "../utilities/contexts";
import { getCharacter, v2u } from "../utilities/utilities";

export default function Recorder({
  setUserResult,
  target,
  setUserBlobUrl,
  setTargetBlobUrl,
}) {
  const dictionaries = useContext(DictContext);
  const [recording, setRecording] = useState(RecordState.STOP);

  const getInferenceResult = useCallback(
    async (file) => {
      const formData = new FormData();
      formData.append("file", file, "input.wav");
      formData.append("character", target.character);
      formData.append("tone", target.tone);
      formData.append("pinyin", target.pinyin);
      const response = await fetch(
        `${import.meta.env.VITE_HOST_URL}/inference`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      const { pinyin, tone, score } = data;
      const character = getCharacter(dictionaries, pinyin, tone);
      setUserResult({ pinyin: v2u(pinyin), character, tone, score });
    },
    [dictionaries, target, setUserResult]
  );

  const onStop = useCallback(
    async (audio) => {
      setUserBlobUrl(audio.url);
      const blob = audio.blob;
      // Update the blob file to the server
      await getInferenceResult(blob);
    },
    [dictionaries, target, setUserResult]
  );

  const onUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    setUserBlobUrl(URL.createObjectURL(file));
    await getInferenceResult(file);
  }, []);

  const getReference = useCallback(async () => {
    const characterUrl = encodeURIComponent(target.character);
    const response = await fetch(
      `${import.meta.env.VITE_HOST_URL}/reference?character=${characterUrl}`
    );
    const blob = await response.blob();
    const referenceUrl = URL.createObjectURL(blob);
    setTargetBlobUrl(referenceUrl);
  }, [target, setTargetBlobUrl]);

  return (
    <div className="flex w-full items-center justify-evenly">
      <div className="hidden">
        <AudioReactRecorder state={recording} onStop={onStop} />
      </div>
      <div className="tooltip" data-tip="Record your own pronunciation.">
        <button
          onClick={() => {
            setRecording(RecordState.START);
            // Only record up to 3 seconds
            setTimeout(() => {
              setRecording(RecordState.STOP);
            }, 3000);
          }}
          type="button"
          className="btn btn-circle h-24 w-24 border-none bg-emerald-700 text-slate-100 shadow-xl hover:bg-emerald-600"
          disabled={
            recording === RecordState.START ||
            !target ||
            target.character === "⊗"
          }
        >
          Record
        </button>
      </div>
      <div className="tooltip flex" data-tip="Upload your own recording.">
        <label
          disabled={!target || target.character === "⊗"}
          className="btn btn-circle h-24 w-24 border-none bg-sky-700 text-slate-100 shadow-xl hover:bg-sky-600"
        >
          Upload
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={onUpload}
          />
        </label>
      </div>
      <div className="tooltip" data-tip="Get the standard pronunciation.">
        <button
          onClick={getReference}
          type="button"
          className="btn btn-circle h-24 w-24 border-none bg-sky-700 text-slate-100 shadow-xl hover:bg-sky-600"
          disabled={!target || target.character === "⊗"}
        >
          Reference
        </button>
      </div>
    </div>
  );
}
