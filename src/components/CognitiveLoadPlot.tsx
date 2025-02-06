import React, {useEffect, useState} from 'react';
import {Data, Layout} from 'plotly.js-basic-dist';
import {useDataContext} from '@/contexts/DataSourceContext';
import Plot from '@components/Plot';
import {PlotContainer} from '@components/PlotContainer';
import SelectorButtonGroup from '@components/SelectorButtonGroup';
import {SelectorButtonGroupProps} from '@/types';

async function fetchPlotData(dataSource: string, selectedDataSet: string) {
    const dataSets = await fetchAndCacheDataSources(dataSource);
    if(!dataSets){
        return [];
    }
    const averageFileId = dataSets['Average'];
    const selectedFileId = dataSets[selectedDataSet];
        const averageDataCacheKey = `cognitiveLoad::${averageFileId}::average`;
        const averageDataAsString = sessionStorage.getItem(averageDataCacheKey);
        if(averageDataAsString){
            const averageData = JSON.parse(averageDataAsString);
            averageData['line'] = { color: 'red' };
            averageData['name'] = 'Average';

            const selectedDataResponse = await fetch(getPlotDataUrl(selectedFileId));
            const selectedData = await selectedDataResponse.json();
            selectedData['line'] = { color: 'blue' };
            selectedData['name'] = selectedDataSet;
            return [dataSets, averageData, selectedData];
        } else {
            const [averageResponse, selectedResponse] = await Promise.all([
                fetch(getPlotDataUrl(averageFileId)),
                fetch(getPlotDataUrl(selectedFileId))
            ]);

            const [averageData, selectedData] = await Promise.all([averageResponse.json(), selectedResponse.json()]);
            sessionStorage.setItem(averageDataCacheKey, JSON.stringify(averageData));

            averageData['line'] = {color: 'red'};
            averageData['name'] = 'Average';

            selectedData['line'] = {color: 'blue'};
            selectedData['name'] = selectedDataSet;

            return [dataSets, averageData, selectedData];
        }
}

function getCognitiveLoadDataSourcesUrl(dataSourceId: string){
    return `/api/data-sources/${dataSourceId}/cognitive-load`;
}

function getPlotDataUrl(fileId: string){
    return `/api/cognitive-load/plotly/${fileId}`;
}

async function fetchAndCacheDataSources(dataSourceId: string) {
    const cacheKey = `cognitiveLoad::${dataSourceId}`;
    const data = sessionStorage.getItem(cacheKey);
    if (data) {
        return JSON.parse(data);
    }

    const response = await fetch(getCognitiveLoadDataSourcesUrl(dataSourceId));
    if(response?.status!=200){
        return undefined;
    }
    const dataSources = await response.json();
    sessionStorage.setItem(cacheKey, JSON.stringify(dataSources));
    return dataSources;
}

export default function CognitiveLoadPlot({ dataSource }: { dataSource: string }) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [dataSets, setDataSets] = useState<SelectorButtonGroupProps['selections']>([]);
    const [plotData, setPlotData] = useState<Data[]>([]);
    const {layout: actionsLayout} = useDataContext().actionsPlot;
    const [plotLayout, setPlotLayout] = useState<Partial<Layout>>(layoutTemplate);
    const [selectedDataSet, setSelectedDataSet] = useState<string>('Team Lead');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dataSets, averageData, selectedData] = await fetchPlotData(dataSource, selectedDataSet);
                setPlotData([averageData, selectedData]);
                setDataSets(Object.keys(dataSets).filter(set=>set!=='Average').map(set=>[set, set]));
            } catch (error) {
                setPlotData([]);
                console.log('error', error);
            }
                setLoading(false);
        }
        setLoading(true);
        if(dataSource) {
            fetchData().catch(console.error);
        }
    }, [dataSource, selectedDataSet]);

    useEffect(() => {
        const filteredShapes = actionsLayout.shapes?.filter(shape=>shape.y1 as number>0);
        const cognitivePlotLayout  = {...layoutTemplate, shapes: filteredShapes, xaxis: actionsLayout.xaxis};
        setPlotLayout(cognitivePlotLayout);
    }, [plotData, actionsLayout]);

    return <PlotContainer isLoading={isLoading}
                          dataLoadingMessage='Loading Cognitive Load Plot Data...'
                          noDataFoundMessage='No data found for Cognitive Load Plot'
                          noDataFoundFn={() => plotData.length === 0}>
        <SelectorButtonGroup className='mt-6 mb-4'
            selections={dataSets}
            selectedValue={selectedDataSet}
            onSelect={(selected) => {
                setSelectedDataSet(selected);
            }}
        />
        <Plot data={plotData} layout={plotLayout} width='100%' height='300px'/>
    </PlotContainer>;
}

const layoutTemplate: Partial<Layout> = {
    'title': {
        'text': 'Cognitive Load Over Time',
        'y': 0.98
    },
    'margin': {
        't': 0,
        'l': 50,
        'r': 50,
        'b': 50
    },
    'yaxis': {
        'title': 'Cognitive Load',
        'range': [
            0,
            1
        ]
    },
    'autosize': true,
    'modebar': {
        'orientation': 'v'
    },
    'showlegend': true,
    'legend': {
        'x': 1,
        'xanchor': 'right',
        'y': 1
    }
};
