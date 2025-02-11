import React, {useEffect, useState} from 'react';
import {Layout, ScatterData} from 'plotly.js-basic-dist';
import Plot from '@components/Plot';
import {PlotContainer} from '@components/PlotContainer';
import addTimeTracer from '@/addVideoTimeTracerToPlot';
import {Data} from 'plotly.js';

async function fetchPlotData([[averageName, averageFileUrl],[selectionName, selectionFileUrl]]:[[string, string],[string, string]]) {
    if(!averageName||!selectionName){
        return [];
    }
        const averageDataCacheKey = `cognitiveLoad::${averageFileUrl}::${averageName}`;
        const averageDataAsString = sessionStorage.getItem(averageDataCacheKey);
        if(averageDataAsString){
            const averageData = JSON.parse(averageDataAsString);
            averageData['line'] = { color: 'red' };
            averageData['name'] = averageName;

            const selectedDataResponse = await fetch(selectionFileUrl);
            const selectedData = await selectedDataResponse.json();
            selectedData['line'] = { color: 'blue' };
            selectedData['name'] = selectionName;
            return [averageData, selectedData];
        } else {
            const [averageResponse, selectedResponse] = await Promise.all([
                fetch(averageFileUrl),
                fetch(selectionFileUrl)
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

function receivedSelections(selections: [[string, string], [string, string]]) {
    return selections.every(([first, second]) => first && second);
}

export default function CognitiveLoadPlot({fileUrls, actionsLayout, currentTime}: { fileUrls: [[string, string], [string, string]], actionsLayout:Partial<Layout>, currentTime: number }) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [cognitiveLoadData, setCognitiveLoadData] = useState<ScatterData[]>([]);
    const plotData: Data[] = addTimeTracer(currentTime, cognitiveLoadData, {yMax:actionsLayout.yaxis?.range?.[1], color: 'red', width: 2});

    const filteredShapes = actionsLayout.shapes?.filter(shape => shape.y1 as number > 0);
    const cognitivePlotLayout = {...layoutTemplate, shapes: filteredShapes, xaxis: actionsLayout.xaxis};

    useEffect(() => {
        const fetchData = async (fileUrlList: [[string, string], [string, string]]) => {
            try {
                const [averageData, selectedData] = await fetchPlotData(fileUrlList);
                setCognitiveLoadData([averageData, selectedData] as ScatterData[]);
            } catch (error) {
                setCognitiveLoadData([]);
                console.log('error', error);
            }finally {
                setLoading(false);
            }
        }
        if(receivedSelections(fileUrls)){
            setLoading(true);
            fetchData(fileUrls).catch(console.error);
        }
        else {
            setCognitiveLoadData([]);
        }
    }, [fileUrls]);

    return <PlotContainer isLoading={isLoading}
                          dataLoadingMessage='Loading Cognitive Load Plot Data...'
                          noDataFoundMessage='No data found for Cognitive Load Plot'
                          noDataFoundFn={() => plotData.length < 2}>
        <Plot data={plotData} layout={cognitivePlotLayout} width='100%' height='500px'/>
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
