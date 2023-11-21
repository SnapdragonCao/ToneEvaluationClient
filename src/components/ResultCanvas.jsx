import { convert } from "pinyin-pro";

export default function ResultCanvas({ content }) {
  const { pinyin, character, tone } = content
    ? content
    : { pinyin: "", character: "", tone: "" };

  return (
    <div className="flex h-full min-h-fit w-full items-center justify-center rounded-2xl bg-slate-200 shadow-inner">
      <div className="flex flex-col items-center justify-around">
        <p className="mb-4 text-5xl">{convert(pinyin + tone)}</p>
        <p className="text-8xl text-gray-700">{character}</p>
      </div>
    </div>
  );
}
