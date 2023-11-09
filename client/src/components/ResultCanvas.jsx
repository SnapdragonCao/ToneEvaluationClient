import { convert } from "pinyin-pro";

export default function ResultCanvas({ content }) {
  if (!content) return;

  const { pinyin, character, tone } = content;

  return (
    <div className="flex h-96 w-5/12 items-center justify-center rounded-2xl bg-slate-200 shadow-inner">
      <div className="flex flex-col items-center justify-around">
        <p className="mb-4 text-5xl">{convert(pinyin + tone)}</p>
        <p className="text-8xl text-gray-700">{character}</p>
      </div>
    </div>
  );
}
