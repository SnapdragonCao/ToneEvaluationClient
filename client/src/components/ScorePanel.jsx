export default function ScorePanel({ userBlobUrl, targetBlobUrl, score }) {
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
      <p>Similarity Score: {score || "(No attempts yet)"}</p>
    </div>
  );
}
