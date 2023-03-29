import Contour from "./Contour";

export default function ContourCanvas({ pitch, periodicity }) {
  let canvas = null;
  if (pitch && periodicity && pitch.length > 0 && periodicity.length > 0) {
    const charData = [
      {
        id: "pitch",
        data: pitch.map((value, index) => {
          return {
            x: index,
            y: value == 0 ? null : value,
          };
        }),
      },
    ];
    canvas = <Contour data={charData} />;
  }
  return (
    <div className="h-96 w-full rounded-2xl bg-slate-200 shadow-inner">
      {canvas}
    </div>
  );
}
