export default function ScorePanel({ userBlobUrl, targetBlobUrl, score }) {
  const convertedScore = score ? (score * 100).toFixed(2) : null;
  return (
    <div className="card flex h-full flex-col items-start justify-around bg-slate-50 p-4 shadow-2xl">
      <div>
        <p>Your Pronunciation</p>
        <audio src={userBlobUrl} controls />
      </div>

      <div>
        <p>Standard Pronunciation</p>
        <audio src={targetBlobUrl} controls />
      </div>
      <p className="flex">
        Similarity Score{" "}
        <span
          className="tooltip hover:cursor-pointer"
          data-tip="Please pronounce the character according to its Pinyin."
        >
          <span class="material-symbols-outlined">help</span>
        </span>
        : {convertedScore || "(No attempts yet)"}
      </p>
    </div>
  );
}
