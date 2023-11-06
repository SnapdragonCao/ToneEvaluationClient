import Recorder from "./components/Recorder";
import { useState } from "react";
import ContourCanvas from "./components/ContourCanvas";

function App() {
  const [pitch, setPitch] = useState(null);
  const [periodicity, setPeriodicity] = useState(null);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-700">
      <div className="card flex h-4/5 w-4/5 flex-col items-center justify-around bg-slate-100 lg:max-w-7xl">
        <div className="w-max">
          <h1 className="text-center text-4xl font-bold text-gray-700">
            Pitch Contour Recognition
          </h1>
          <p className="mt-8 text-right italic text-gray-700">Powered by AI</p>
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

        <div
          className="flex flex-col w-4/5 h-3/5 justify-between items-start"
          
        >
          <Recorder setPitch={setPitch} setPeriodicity={setPeriodicity} />
          <ContourCanvas pitch={pitch} periodicity={periodicity} />
        </div>
      </div>
    </div>
  );
}

export default App;
