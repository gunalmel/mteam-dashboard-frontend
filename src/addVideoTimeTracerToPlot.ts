// A vertical line traces the video playback time on the plot allowing the user to see the actions taken at that time
import {Data, PlotType} from 'plotly.js';
import {Today} from '@/TodayDateTimeConverter';
import {ScatterData} from 'plotly.js-basic-dist';

function getMaxY(plotData: Partial<ScatterData>[]) {
  let maxY = -Infinity;
  plotData.forEach((trace) => {
    if (trace.y) {
      const maxTraceY = Math.max(...trace.y.map(Number));
      maxY = Math.max(maxY, maxTraceY);
    }
  });
  return maxY;
}

const addTimeTracer = (currentTime: number, plotData: Partial<ScatterData>[], line: {yMin?:number, yMax?: number, color?:string, width?: number}) => {
  const currentTimeFormatted = Today.parseSeconds(currentTime).dateTimeString;
  const currentTimeMarker: Data = new PlotlyCurrentTimeMarker(
    [currentTimeFormatted, currentTimeFormatted],
    [line.yMin??0, line.yMax??getMaxY(plotData)],
    line.color??'red',
    line.width??2
  ).toPlotlyFormat();
  return [...plotData, currentTimeMarker];
};

class PlotlyCurrentTimeMarker {
  readonly #type:PlotType ;
  readonly #mode:'number' | 'lines' | 'text' | 'delta' | 'gauge' | 'markers' | 'lines+markers' | 'text+markers' | 'text+lines' | 'text+lines+markers' | 'none' | 'number+delta' | 'gauge+number' | 'gauge+number+delta' | 'gauge+delta';
  readonly #x:string[];// = [currentTimeFormatted, currentTimeFormatted];
  readonly #y:number[];// Adjust y range as needed - must be equal or greater than y1 value in createTransition boundary
  readonly #line:{color:string, width:number};
  readonly #name:string;

  constructor(x: string[], y: number[], color = 'red', width = 2) {
    this.#type = 'scatter';
    this.#mode = 'lines';
    this.#line = {color, width};
    this.#x = x;
    this.#y = y;
    this.#name = 'Video Tracer';
  }

  toPlotlyFormat(): Data{
    return {
      type: this.#type,
      mode: this.#mode,
      x: this.#x,
      y: this.#y,
      line: this.#line,
      name: this.#name,
      showlegend: false
    };
  }
}

export default addTimeTracer;
