import Contour from "./Contour";

export default function ContourCanvas({pitch, periodicity}) {
  if (!pitch || !periodicity) {
    return null;
  }
  console.log(pitch.splice(0, 10));
  console.log(periodicity.splice(0, 10));
  const charData = [{
    id: 'pitch',
    data: pitch.map((value, index) => {
      return {
        x: index,
        y: periodicity[index] > 0.1 ? value : null
      };
    })
  }]
  return (
    <div style={{height: '500px', border: '1px solid black'}}>
      <p>ContourCanvas</p>
      <Contour
        data={charData}
      />
    </div>
  )
}