import {FC, useEffect, useState} from 'react';
import {Layout, ScatterData} from 'plotly.js-basic-dist';
import filterActions from '../filter-actions';
import ToggleGrid from '@components/ToggleGrid';
import PulseLoader from '@components/PulseLoader';
import {useDataContext} from '@/contexts/DataSourceContext';
import Plot from '@components/Plot';

const ActionsPlot: FC = () => {
  const {data, layout, isActionsLoading, groupIcons, selectedActions, setSelectedActions} = useDataContext().actionsPlot;
  const [plotData, setPlotData] = useState<Partial<ScatterData>[]>(data);
  const [plotLayout, setPlotLayout] = useState<Partial<Layout>>(layout);

  const handleSelect = (selectedItems: string[]) => {
    setSelectedActions(selectedItems);
  };

  useEffect(() => {
    if (data && data.length>0) {
      const {plotData:filteredData, actionsLayout:filteredLayout} = filterActions(selectedActions, data, layout);
      setPlotData(filteredData);
      setPlotLayout(filteredLayout);
    }
  }, [selectedActions, data, layout]);

  return data.length===0 ? <div className='p-8 text-center text-gray-600'>Complete simulation data is not available for the selected date. Please select a different date.</div> : (
      <div className={'flex flex-col items-center'} style={{position: 'relative'}}>
        <PulseLoader isLoading={isActionsLoading} text={'Fetching data for Clinical Review Timeline'}/>
        <ToggleGrid items={groupIcons} onChange={handleSelect}/>
        <Plot data={plotData} layout={plotLayout} width='100%' height='500px' />
      </div>
  );
};

export default ActionsPlot;

