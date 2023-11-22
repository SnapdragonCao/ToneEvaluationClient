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
      <div className="flex h-screen min-h-[1150px] w-screen min-w-fit items-center justify-center bg-slate-700">
        <div className="h-full w-full flex-col items-center justify-around bg-slate-100 md:card sm:flex md:h-5/6 md:w-4/5 lg:max-w-7xl">
          <div className="mx-auto w-max py-8 text-center text-4xl font-bold text-gray-700">
            Mandarin Tone Coach
          </div>

          <div className="mx-auto flex h-4/5 w-full flex-col items-center justify-around px-4 md:gap-36 md:px-8 lg:gap-0 lg:px-16">
            <div className="flex h-2/5 w-full flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div className="min-w-fit lg:w-2/5">
                <SelectionPanel
                  setTarget={setTarget}
                  target={target}
                  setTargetBlobUrl={setTargetBlobUrl}
                  setUserBlobUrl={setUserBlobUrl}
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
              <div className="h-full min-w-fit lg:w-5/12">
                <ScorePanel
                  userBlobUrl={userBlobUrl}
                  targetBlobUrl={targetBlobUrl}
                  score={userResult?.score}
                />
              </div>
            </div>

            <div className="flex h-2/5 w-full flex-col justify-between gap-10 pt-10 md:flex-row">
              <div className="h-56 min-h-[200px] md:h-5/6 md:w-5/12 lg:h-full">
                <p className="flex text-lg font-semibold text-slate-700">
                  Your Target
                  <span
                    className="tooltip font-normal hover:cursor-pointer"
                    data-tip="Please pronounce the character according to its Pinyin."
                  >
                    <span class="material-symbols-outlined">help</span>
                  </span>
                </p>
                <ResultCanvas content={target} />
              </div>
              <div className="h-56 min-h-[200px] md:h-5/6 md:w-5/12 lg:h-full">
                <p className="flex text-lg font-semibold text-slate-700">
                  Your Result
                  <span
                    className="tooltip font-normal hover:cursor-pointer"
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
