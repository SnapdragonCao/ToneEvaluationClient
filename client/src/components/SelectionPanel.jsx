import { useCallback } from "react";

export default function SelectionPanel({ pinyinDict, setTarget, target }) {
  
  const handleChange = useCallback( e => {
    const { name, value } = e.target;
    setTarget(prev => ({
      ...prev,
      [name]: value
    }))
  }, [setTarget])
  
  return (
    <div>
      <select
        className="select select-bordered"
        value={target ? target.pinyin : "Select a pinyin"}
        name="pinyin"
        onChange={handleChange}
      >
        {pinyinDict && pinyinDict.pinyins.map((pinyin) => (
          <option key={pinyin} value={pinyin}>
            {pinyin}
          </option>
        ))}
      </select>
      <select
        className="select select-bordered"
        value={target ? target.tone : "Select a tone"}
        name="tone"
        onChange={handleChange}
      >
        {pinyinDict && pinyinDict.tones.map((tone) => (
          <option key={tone} value={tone}>
            {tone}
          </option>
        ))}
      </select>
    </div>
  );
}