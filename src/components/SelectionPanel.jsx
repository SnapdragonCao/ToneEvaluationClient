import { useCallback, useContext } from "react";
import { DictContext } from "../utilities/contexts";
import {
  getCharacter,
  getRandomTarget,
  u2v,
  v2u,
} from "../utilities/utilities";

export default function SelectionPanel({
  setTarget,
  target,
  setTargetBlobUrl,
  setUserBlobUrl,
  setUserResult,
}) {
  const dictionaries = useContext(DictContext);
  const handleChange = useCallback(
    (e) => {
      const [name, value] = [e.target.name, e.target.value];
      const character =
        name === "pinyin"
          ? getCharacter(dictionaries, u2v(value), target.tone)
          : getCharacter(dictionaries, u2v(target.pinyin), value);
      setTarget((prev) => ({
        ...prev,
        [name]: value,
        character: character,
      }));
    },
    [setTarget, target]
  );

  return (
    <div
      className="join flex w-full items-center justify-center"
    >
      <select
        className="select join-item select-bordered"
        value={target ? target.pinyin : "Select a pinyin"}
        name="pinyin"
        onChange={handleChange}
      >
        {dictionaries &&
          dictionaries.pinyins.map((pinyin) => (
            <option key={pinyin} value={v2u(pinyin)}>
              {v2u(pinyin)}
            </option>
          ))}
      </select>
      <select
        className="select join-item select-bordered"
        value={target ? target.tone : "Select a tone"}
        name="tone"
        onChange={handleChange}
      >
        {dictionaries &&
          dictionaries.tones.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
      </select>
      <button
        onClick={() => {
          const newTarget = getRandomTarget(dictionaries);
          setTarget(newTarget);
          setTargetBlobUrl("");
          setUserBlobUrl("");
          setUserResult(null);
        }}
        type="button"
        className="btn btn-info join-item"
      >
        <span class="material-symbols-outlined">Autorenew</span>
      </button>
    </div>
  );
}
