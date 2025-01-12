import React, { useEffect, useRef } from "react";
import Plotly, {Layout, ScatterData} from 'plotly.js-basic-dist';
import data from '../sample-data/data.json';
import layout from '../sample-data/layout.json';
import config from '../sample-data/config.json';

const Graph: React.FC = () => {
  const graphDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (graphDiv.current) {
      Plotly.newPlot(graphDiv.current, data as Partial<ScatterData>[], layout as Partial<Layout>, config).catch(console.error);
    }

    return () => {
      if (graphDiv.current) {
        Plotly.purge(graphDiv.current);
      }
    };
  }, []);

  return <div ref={graphDiv} style={{ width: "100%", height: "100%"}} />;
};

export default Graph;

