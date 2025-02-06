import React, {useEffect, useState} from 'react';
import {Data, Layout} from 'plotly.js-basic-dist';
import {useDataContext} from '@/contexts/DataSourceContext';
import PulseLoader from '@components/PulseLoader';
import Plot from '@components/Plot';

async function fetchPlotData(dataSource: string, selectedDataSet: string) {
    const data = await fetchAndCacheDataSources(dataSource);
    if(!data){
        return [];
    }
    const averageFileId = data['Average'];
    const selectedFileId = data[selectedDataSet];
        const averageDataCacheKey = `cognitiveLoad::${averageFileId}::average`;
        const averageDataAsString = sessionStorage.getItem(averageDataCacheKey);
        if(averageDataAsString){
            const averageData = JSON.parse(averageDataAsString);
            averageData['line'] = { color: 'red' };
            averageData['name'] = 'Average';

            const selectedDataResponse = await fetch(getPlotDataUrl(selectedFileId));
            const selectedData = await selectedDataResponse.json();
            selectedData['line'] = { color: 'red' };
            selectedData['name'] = selectedDataSet;
            return[averageData, selectedData];
        } else {
            const [averageResponse, selectedResponse] = await Promise.all([
                fetch(getPlotDataUrl(averageFileId)),
                fetch(getPlotDataUrl(selectedFileId))
            ]);

            const [averageData, selectedData] = await Promise.all([averageResponse.json(), selectedResponse.json()]);

            averageData['line'] = {color: 'blue'};
            averageData['name'] = selectedDataSet;

            selectedData['line'] = {color: 'red'};
            selectedData['name'] = 'Average';

            return[averageData, selectedData];
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
    const [plotData, setPlotData] = useState<Data[]>([]);
    const {layout: actionsLayout} = useDataContext().actionsPlot;
    const [plotLayout, setPlotLayout] = useState<Partial<Layout>>(layoutTemplate);
    const [selectedDataSet, setSelectedDataSet] = useState<string>('Team Lead');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await fetchPlotData(dataSource, selectedDataSet);
                setPlotData(data);
            } catch (error) {
                setPlotData([]);
                console.log('error', error);
            } finally {
                setLoading(false);
            }
        }
        if(dataSource) {
            fetchData().catch(console.error);
        }
    }, [dataSource]);

    useEffect(() => {
        const filteredShapes = actionsLayout.shapes?.filter(shape=>shape.y1 as number>0);
        const cognitivePlotLayout  = {...layoutTemplate, shapes: filteredShapes, xaxis: actionsLayout.xaxis};
        setPlotLayout(cognitivePlotLayout);
    }, [plotData, actionsLayout]);

    return     <div className={`flex flex-col items-center mt-6`} style={{ position: 'relative' }}>
        <PulseLoader isLoading={isLoading} text='Loading Cognitive Load Plot Data...' />
        {plotData.length === 0 ? (
            <div className={`p-8 text-center text-gray-600 mt-6`}>No data found for Cognitive Load Plot</div>
        ) : (
            <Plot data={plotData} layout={plotLayout} width='100%' height='300px' />
        )}
    </div>;
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
