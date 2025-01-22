import {FC, useEffect, useRef, useState} from 'react';
import Plotly, {Layout, ScatterData} from 'plotly.js-basic-dist';
import config from '../sample-data/config.json';
import filterActions from '../filter-actions';

type PlotComponentProps = {
  dataSource: string;
};

const ActionsPlot: FC<PlotComponentProps> = ({ dataSource }) => {
  const graphDiv = useRef<HTMLDivElement>(null);
  const [plotData, setPlotData] = useState<Partial<ScatterData>[]>([]);
  const [actionsLayout, setActionLayout] = useState<Partial<Layout>>({});
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const toggleVisibility = () => {
    setSelectedActions((prevFilter) => (prevFilter.includes('Pulse Check') ? ['Order EKG'] : ['Pulse Check']));
  };

  useEffect(() => {
    const url = `/api/actions/plotly/${dataSource}`;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        const {data, layout, actionGroups} = json;
        setPlotData(data);
        setActionLayout(layout);
        setSelectedActions(actionGroups);
      } catch (error) {
        setPlotData([]);
        setActionLayout({});
        console.log('error', error);
      }
      setLoading(false);
    };
    setLoading(true);
    if(dataSource) {
      fetchData().catch(console.error);
    }
  }, [dataSource]);

  useEffect(() => {
    if (graphDiv.current && plotData && plotData.length>0) {
      filterActions(selectedActions, plotData, actionsLayout);
      // Apply filtering without re-rendering the entire chart
      Plotly.react(graphDiv.current, plotData, actionsLayout, config).catch(console.error);
    }
  }, [selectedActions, plotData, actionsLayout]);

  return isLoading? <div>Loading...</div> : plotData.length===0 ? <div>No data found</div> : (
      <>
        <button onClick={toggleVisibility}>
          Toggle Pulse Check Visibility
        </button>
        <div ref={graphDiv} style={{width: '100%', height: '100%'}}/>
      </>
  );
};

export default ActionsPlot;

