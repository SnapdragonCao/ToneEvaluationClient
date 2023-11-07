

export default function ResultCanvas({ content }) {
  if (!content) return;

  const { pinyin, character, tone } = content;
  return (
    <div className="h-96 w-full rounded-2xl bg-slate-200 shadow-inner">
      <p>{character}</p>
    </div>
  );
}
