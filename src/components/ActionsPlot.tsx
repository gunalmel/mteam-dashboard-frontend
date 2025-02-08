import React, {FC, useEffect, useState} from 'react';
import {Layout, ScatterData} from 'plotly.js-basic-dist';
import filterActions from '../filter-actions';
import ToggleGrid from '@components/ToggleGrid';
import {useDataContext} from '@/contexts/DataSourceContext';
import Plot from '@components/Plot';
import {PlotContainer} from '@components/PlotContainer';

const ActionsPlot: FC = () => {
  const {data, layout, isActionsLoading, groupIcons, selectedActions, setSelectedActions} = useDataContext().actionsPlotData;
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

  return <PlotContainer isLoading={isActionsLoading}
                        dataLoadingMessage='Fetching data for Clinical Review Timeline...'
                        noDataFoundMessage='Complete simulation data is not available for the selected date. Please select a different date.'
                        noDataFoundFn={() => plotData.length === 0}>
      <ToggleGrid items={groupIcons} onChange={handleSelect}/>
      <Plot data={plotData} layout={plotLayout} width='100%' height='600px'/>
  </PlotContainer>;
};

export default ActionsPlot;

