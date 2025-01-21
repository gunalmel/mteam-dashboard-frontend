import React, {useEffect, useRef, useState} from "react";
import Plotly, {Layout, ScatterData} from 'plotly.js-basic-dist';
import config from '../sample-data/config.json';
import filterActions from "../filter-actions";

const Graph: React.FC = () => {
  const graphDiv = useRef<HTMLDivElement>(null);
  const [plotData, setPlotData] = useState<Partial<ScatterData>[]>([]);
  const [actionsLayout, setActionLayout] = useState<Partial<Layout>>([] as Partial<Layout>);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);

  const toggleVisibility = () => {
    setSelectedActions((prevFilter) => (prevFilter.includes('Pulse Check') ? ['Order EKG'] : ['Pulse Check']));
  };

  useEffect(() => {
    const url = "/api/actions/plotly/1Ae95pvrZsV32qBCSnCw_xkOKEw9BrI17";

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        const {data, layout, actionGroups} = json;
        setPlotData(data);
        setActionLayout(layout);
        setSelectedActions(actionGroups);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    if (graphDiv.current && plotData && plotData.length>0) {
      filterActions(selectedActions, plotData, actionsLayout);
      // Apply filtering without re-rendering the entire chart
      Plotly.react(graphDiv.current, plotData, actionsLayout, config).catch(console.error);
    }
  }, [selectedActions, plotData, actionsLayout]);

  return (
      <>
        <button onClick={toggleVisibility}>
          Toggle Pulse Check Visibility
        </button>
        <div ref={graphDiv} style={{width: "100%", height: "100%"}}/>
      </>
  );
};

export default Graph;

