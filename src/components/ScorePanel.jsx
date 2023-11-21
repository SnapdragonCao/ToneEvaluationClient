import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

export default function ScorePanel({ userBlobUrl, targetBlobUrl, score }) {
  const convertedScore = score ? (score * 100).toFixed(2) : null;
  let color = "text-gray-400";
  if (score && convertedScore > 50) {
    color = "text-green-600";
  } else if (score) {
    color = "text-red-600";
  }

  return (
    <div className="card flex h-full flex-col items-start justify-around gap-4 bg-slate-50 p-4 shadow-2xl">
      <div className="w-full">
        <p className="font-semibold text-slate-700">Your Pronunciation</p>
        <audio src={userBlobUrl} controls className="w-full" />
      </div>

      <div className="w-full">
        <p className="font-semibold text-slate-700">Standard Pronunciation</p>
        <audio src={targetBlobUrl} controls className="w-full" />
      </div>
      <p className="flex font-semibold text-slate-700">
        Similarity Score
        <span
          className="tooltip font-normal hover:cursor-pointer"
          data-tip="This is the similarity score between
           your pronunciation and the standard pronunciation produced by TTS.
           The higher the score, the better your pronunciation is.
           The score ranges from -100 to 100."
        >
          <span class="material-symbols-outlined">help</span>
        </span>
        :&nbsp;
        <span className={`${color}`}>
          {convertedScore || "(No attempts yet)"}
        </span>
      </p>
    </div>
  );
}
