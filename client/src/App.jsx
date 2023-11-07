import Recorder from "./components/Recorder";
import { useEffect, useState } from "react";
import ResultCanvas from "./components/ResultCanvas";
import SelectionPanel from "./components/SelectionPanel";
import useData from "./hooks/useData";

function App() {
  const dictUrl = import.meta.env.VITE_HOST_URL + "/getDict";
  const pinyinDict = useData(dictUrl);
  const [characterDict, setCharacterDict] = useState(null);
  const [target, setTarget] = useState(null); 
  const [userResult, setUserResult] = useState(null);

  useEffect(() => {
    // Randomly select a target on first render
    if (pinyinDict) {
      const pinyinIndex = Math.floor(Math.random() * pinyinDict.pinyins.length);
      const toneIndex = Math.floor(Math.random() * pinyinDict.tones.length);
      setTarget({
        pinyin: pinyinDict.pinyins[pinyinIndex],
        tone: pinyinDict.tones[toneIndex],
      });
      setCharacterDict(pinyinDict.characterDict);
    }
  }, [pinyinDict])

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-700">
      <div className="card flex h-4/5 w-4/5 flex-col items-center justify-around bg-slate-100 lg:max-w-7xl">
        <div className="w-max">
          <h1 className="text-center text-4xl font-bold text-gray-700">
            Mandarin Tone Coach
          </h1>
        </div>

        <div>
          <form
            method="POST"
            action="http://localhost:5000/inference"
            encType="multipart/form-data"
            >
              <input type="file" name="file" />
              <button type="submit">Submit</button>
            </form>
        </div>

        <SelectionPanel pinyinDict={pinyinDict} setTarget={setTarget} target={target}/>

        <div
          className="flex flex-col w-4/5 h-3/5 justify-between items-start"
          
        >
          <Recorder setUserResult={setUserResult} />
          <ResultCanvas  />
        </div>
      </div>
    </div>
  );
}

export default App;
