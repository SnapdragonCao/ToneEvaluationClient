import { useCallback, useContext } from "react";
import { DictContext } from "../utilities/contexts";
import { getCharacter } from "../utilities/utilities";

export default function SelectionPanel({ setTarget, target }) {
  const dictionaries = useContext(DictContext);
  const handleChange = useCallback( e => {
    const [ name, value ] = [e.target.name, e.target.value]
    const character = name === "pinyin" ? getCharacter(dictionaries, value, target.tone) : getCharacter(dictionaries, target.pinyin, value);
    setTarget(prev => ({
      ...prev,
      [name]: value,
      character: character
    }));
  }, [setTarget, target])
  
  return (
    <div>
      <select
        className="select select-bordered"
        value={target ? target.pinyin : "Select a pinyin"}
        name="pinyin"
        onChange={handleChange}
      >
        {dictionaries && dictionaries.pinyins.map((pinyin) => (
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
        {dictionaries && dictionaries.tones.map((tone) => (
          <option key={tone} value={tone}>
            {tone}
          </option>
        ))}
      </select>
    </div>
  );
}