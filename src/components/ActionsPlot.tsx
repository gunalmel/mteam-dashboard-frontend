import {FC, useEffect, useRef, useState} from 'react';
import Plotly, {Layout, ScatterData} from 'plotly.js-basic-dist';
import config from '../sample-data/config.json';
import filterActions from '../filter-actions';
import ToggleGrid from '@components/ToggleGrid';
import PulseLoader from '@components/PulseLoader';

type PlotComponentProps = {
  dataSource: string;
};

const ActionsPlot: FC<PlotComponentProps> = ({ dataSource }) => {
  const graphDiv = useRef<HTMLDivElement>(null);
  const [plotData, setPlotData] = useState<Partial<ScatterData>[]>([]);
  const [actionsLayout, setActionLayout] = useState<Partial<Layout>>({});
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [actionGroupIcons, setActionGroupIcons] = useState<ImageToggleItem[]>([]);

  const handleSelect = (selectedItems: string[]) => {
    setSelectedActions(selectedItems);
  };

  useEffect(() => {
    const url = `/api/actions/plotly/${dataSource}`;

    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        const {data, layout, actionGroupIcons} = json;
        const actionGroupIconMap:ImageToggleItem[] = Object.entries(actionGroupIcons as Record<string,string>).map(([group, icon]:[string,string]) => ({value: group, source: icon}));
        setActionGroupIcons(actionGroupIconMap)
        setPlotData(data);
        setActionLayout(layout);
        setSelectedActions(Object.keys(actionGroupIcons));
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

  return plotData.length===0 ? <div className='p-8 text-center text-gray-600'>Complete simulation data is not available for the selected date. Please select a different date.</div> : (
      <div className={'flex flex-col items-center'} style={{position: 'relative'}}>
        <PulseLoader isLoading={isLoading} text={'Fetching data for Clinical Review Timeline'}/>
        <ToggleGrid items={actionGroupIcons} onChange={handleSelect}/>
        <div ref={graphDiv} style={{width: '100%', height: '500px'}}></div>
      </div>
  );
};

export default ActionsPlot;

