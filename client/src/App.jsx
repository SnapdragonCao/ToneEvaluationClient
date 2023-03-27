import Recorder from "./components/Recorder"
import {useState} from 'react';
import ContourCanvas from "./components/ContourCanvas";

function App() {
  const [pitch, setPitch] = useState(null);
  const [periodicity, setPeriodicity] = useState(null);
  return (
    <div className="App">
      <p>Pitch Contour Recognition</p>
      <div>
        <Recorder
          setPitch={setPitch}
          setPeriodicity={setPeriodicity}
        />
        <div>
          <ContourCanvas
            pitch={pitch}
            periodicity={periodicity}
          />
        </div>
      </div>
    </div>
  )
}

export default App
