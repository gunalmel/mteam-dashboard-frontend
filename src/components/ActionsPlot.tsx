import {FC, useEffect, useRef} from 'react';
import Plotly from 'plotly.js-basic-dist';
import config from '../sample-data/config.json';
import filterActions from '../filter-actions';
import ToggleGrid from '@components/ToggleGrid';
import PulseLoader from '@components/PulseLoader';
import {useDataContext} from '@/contexts/DataSourceContext';

type PlotComponentProps = {
  dataSource: string;
};

const ActionsPlot: FC<PlotComponentProps> = () => {
  const graphDiv = useRef<HTMLDivElement>(null);
  const {data, layout, isActionsLoading, groupIcons, selectedActions, setSelectedActions} = useDataContext().actionsPlot;

  const handleSelect = (selectedItems: string[]) => {
    setSelectedActions(selectedItems);
  };

  useEffect(() => {
    if (graphDiv.current && data && data.length>0) {
      const {plotData, actionsLayout} = filterActions(selectedActions, data, layout);
      // Apply filtering without re-rendering the entire chart
      Plotly.react(graphDiv.current, plotData, actionsLayout, config).catch(console.error);
    }
  }, [selectedActions, data, layout]);

  return data.length===0 ? <div className='p-8 text-center text-gray-600'>Complete simulation data is not available for the selected date. Please select a different date.</div> : (
      <div className={'flex flex-col items-center'} style={{position: 'relative'}}>
        <PulseLoader isLoading={isActionsLoading} text={'Fetching data for Clinical Review Timeline'}/>
        <ToggleGrid items={groupIcons} onChange={handleSelect}/>
        <div ref={graphDiv} style={{width: '100%', height: '500px'}}></div>
      </div>
  );
};

export default ActionsPlot;

