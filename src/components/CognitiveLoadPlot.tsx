import React, {useEffect, useState} from 'react';
import {Data, Layout} from 'plotly.js-basic-dist';
import {useDataContext} from '@/contexts/DataSourceContext';
import Plot from '@components/Plot';
import {PlotContainer} from '@components/PlotContainer';

async function fetchPlotData([[averageName, averageFileId],[selectionName, selectionFileId]]:[[string, string],[string, string]]) {
    if(!averageName||!selectionName){
        return [];
    }
        const averageDataCacheKey = `cognitiveLoad::${averageFileId}::${averageName}`;
        const averageDataAsString = sessionStorage.getItem(averageDataCacheKey);
        if(averageDataAsString){
            const averageData = JSON.parse(averageDataAsString);
            averageData['line'] = { color: 'red' };
            averageData['name'] = averageName;

            const selectedDataResponse = await fetch(getPlotDataUrl(selectionFileId));
            const selectedData = await selectedDataResponse.json();
            selectedData['line'] = { color: 'blue' };
            selectedData['name'] = selectionName;
            return [averageData, selectedData];
        } else {
            const [averageResponse, selectedResponse] = await Promise.all([
                fetch(getPlotDataUrl(averageFileId)),
                fetch(getPlotDataUrl(selectionFileId))
            ]);

            const [averageData, selectedData] = await Promise.all([averageResponse.json(), selectedResponse.json()]);
            sessionStorage.setItem(averageDataCacheKey, JSON.stringify(averageData));

            averageData['line'] = {color: 'red'};
            averageData['name'] = averageName;

            selectedData['line'] = {color: 'blue'};
            selectedData['name'] = selectionName;

            return [averageData, selectedData];
        }
}

function getPlotDataUrl(fileId: string){
    return `/api/cognitive-load/plotly/${fileId}`;
}

export default function CognitiveLoadPlot({selections}:{ selections: [[string, string], [string, string]] }) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [plotData, setPlotData] = useState<Data[]>([]);
    const {layout: actionsLayout} = useDataContext().actionsPlotData;
    const [plotLayout, setPlotLayout] = useState<Partial<Layout>>(layoutTemplate);

    useEffect(() => {
        const fetchData = async (fileList: [[string, string], [string, string]]) => {
            try {
                const [averageData, selectedData] = await fetchPlotData(fileList);
                setPlotData([averageData, selectedData]);
            } catch (error) {
                setPlotData([]);
                console.log('error', error);
            }finally {
                setLoading(false);
            }
        }
        if(selections.length>1 && selections[0].length>0 && selections[1].length>0 && selections[0][1] && selections[1][1]){
            setLoading(true);
            fetchData(selections).catch(console.error);
        }
    }, [selections]);

    useEffect(() => {
        const filteredShapes = actionsLayout.shapes?.filter(shape=>shape.y1 as number>0);
        const cognitivePlotLayout  = {...layoutTemplate, shapes: filteredShapes, xaxis: actionsLayout.xaxis};
        setPlotLayout(cognitivePlotLayout);
    }, [plotData, actionsLayout]);

    return <PlotContainer isLoading={isLoading}
                          dataLoadingMessage='Loading Cognitive Load Plot Data...'
                          noDataFoundMessage='No data found for Cognitive Load Plot'
                          noDataFoundFn={() => plotData.length === 0}>
        <Plot data={plotData} layout={plotLayout} width='100%' height='500px'/>
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
