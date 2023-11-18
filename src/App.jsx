import Recorder from "./components/Recorder";
import { useEffect, useState } from "react";
import ResultCanvas from "./components/ResultCanvas";
import SelectionPanel from "./components/SelectionPanel";
import { useData } from "./utilities/hooks";
import { DictContext } from "./utilities/contexts";
import { getRandomTarget } from "./utilities/utilities";
import ScorePanel from "./components/ScorePanel";

function App() {
  const dictUrl = import.meta.env.VITE_HOST_URL + "/dictionaries";
  const dictionaries = useData(dictUrl);
  const [target, setTarget] = useState(null);
  const [userResult, setUserResult] = useState(null);
  const [userBlobUrl, setUserBlobUrl] = useState("");
  const [targetBlobUrl, setTargetBlobUrl] = useState("");
  useEffect(() => {
    // Randomly select a target on first render
    if (dictionaries) {
      const newTarget = getRandomTarget(dictionaries);
      setTarget(newTarget);
    }
  }, [dictionaries]);

  return (
    <DictContext.Provider value={dictionaries}>
      <div className="flex h-screen w-screen items-center justify-center bg-slate-700">
        <div className="card flex h-4/5 w-4/5 flex-col items-center justify-around bg-slate-100 lg:max-w-7xl">
          <div className="w-max py-8 text-center text-4xl font-bold text-gray-700">
            Mandarin Tone Coach
          </div>

          {/* <div>
          <form
            method="POST"
            action="http://localhost:5000/inference"
            encType="multipart/form-data"
            >
              <input type="file" name="file" />
              <button type="submit">Submit</button>
            </form>
        </div> */}

          <div className="flex h-4/5 w-4/5 flex-col items-center justify-around">
            <div className="flex h-2/5 w-full items-start justify-between">
              <div className="w-2/5 min-w-fit">
                <SelectionPanel
                  setTarget={setTarget}
                  target={target}
                  setTargetBlobUrl={setTargetBlobUrl}
                  setUserResult={setUserResult}
                />
                <div className="mt-12">
                  <Recorder
                    setUserResult={setUserResult}
                    target={target}
                    setUserBlobUrl={setUserBlobUrl}
                    setTargetBlobUrl={setTargetBlobUrl}
                  />
                </div>
              </div>
              <div className="h-full">
                <ScorePanel
                  userBlobUrl={userBlobUrl}
                  targetBlobUrl={targetBlobUrl}
                  score={userResult?.score}
                />
              </div>
            </div>

            <div className="flex h-2/5 w-full flex-row justify-between">
              <div className="h-full w-5/12">
                <p className="flex text-lg">
                  Your Target
                  <span
                    className="tooltip hover:cursor-pointer"
                    data-tip="Please pronounce the character according to its Pinyin."
                  >
                    <span class="material-symbols-outlined">help</span>
                  </span>
                </p>
                <ResultCanvas content={target} />
              </div>
              <div className="h-full w-5/12">
                <p className="flex text-lg">
                  Your Result
                  <span
                    className="tooltip hover:cursor-pointer"
                    data-tip="Prediction of your pronunciation by our model."
                  >
                    <span class="material-symbols-outlined">help</span>
                  </span>
                </p>
                <ResultCanvas content={userResult} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DictContext.Provider>
  );
}

export default App;
