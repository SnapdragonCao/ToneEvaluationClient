import Recorder from "./components/Recorder"
import {useState} from 'react';
import ContourCanvas from "./components/ContourCanvas";

function App() {
  const [pitch, setPitch] = useState(null);
  const [periodicity, setPeriodicity] = useState(null);
  return (
    <div className="App">
      <p>Hello World</p>
      <Recorder
        setPitch={setPitch}
        setPeriodicity={setPeriodicity}
      />
      <ContourCanvas
        pitch={pitch}
        periodicity={periodicity}
      />
    </div>
  )
}

export default App
