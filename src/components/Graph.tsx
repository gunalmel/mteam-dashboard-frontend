import React, {useEffect, useRef, useState} from "react";
import Plotly, {Layout, ScatterData} from 'plotly.js-basic-dist';
import data from '../sample-data/data.json';
import layout from '../sample-data/layout.json';
import config from '../sample-data/config.json';

const Graph: React.FC = () => {
  const graphDiv = useRef<HTMLDivElement>(null);
  const [plotData, setPlotData] = useState([]);
  const [actionsLayout, setActionLayout] = useState([]);

  useEffect(() => {
    const url = "/api/actions/plotly/1Ae95pvrZsV32qBCSnCw_xkOKEw9BrI17";

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        const {data, layout} = json;
        setPlotData(data);
        setActionLayout(layout);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData().catch(e=>{console.log("error",e);});
  }, []);

  useEffect(() => {
    if (graphDiv.current && plotData.length>1) {
      Plotly.newPlot(graphDiv.current, plotData as Partial<ScatterData>[], actionsLayout as Partial<Layout>, config).catch(console.error);
    }

    return () => {
      if (graphDiv.current) {
        Plotly.purge(graphDiv.current);
      }
    };
  }, [plotData, actionsLayout]);

  return <div ref={graphDiv} style={{ width: "100%", height: "100%"}} />;
};

export default Graph;

