import React, {FC, useEffect, useState} from 'react';
import {Layout, ScatterData} from 'plotly.js-basic-dist';
import filterActions from '../filter-actions';
import ToggleGrid from '@components/ToggleGrid';
import {useDataContext} from '@/contexts/DataSourceContext';
import Plot from '@components/Plot';
import {PlotContainer} from '@components/PlotContainer';
import addTimeTracer from '@/addVideoTimeTracerToPlot';
import {Data} from 'plotly.js';

const ActionsPlot: FC<{currentTime: number}> = ({currentTime}) => {
    const {data, layout, isActionsLoading, groupIcons, selectedActions, setSelectedActions} = useDataContext().actionsPlotData;
    const [actionsData, setPlotData] = useState<Partial<ScatterData>[]>(data);
    const [plotLayout, setPlotLayout] = useState<Partial<Layout>>(layout);
    const plotData: Data[] = addTimeTracer(currentTime, actionsData, {yMin:0, yMax: plotLayout.shapes?Number(plotLayout.shapes[0]?.y1):undefined, color: 'red', width: 2});

    const handleSelect = (selectedItems: string[]) => {
        setSelectedActions(selectedItems);
    };

    useEffect(() => {
        if (data && data.length > 0) {
            const {plotData: filteredData, actionsLayout: filteredLayout} = filterActions(selectedActions, data, layout);
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

