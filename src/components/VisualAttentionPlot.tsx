import React, {useEffect, useState} from 'react';
import {Data, Layout} from 'plotly.js-basic-dist';
import {useDataContext} from '@/contexts/DataSourceContext';
import Plot from '@components/Plot';
import {PlotContainer} from '@components/PlotContainer';

async function fetchPlotData(selectionFileId: string) {
    if(!selectionFileId){
        return [];
    }
    const selectedDataResponse = await fetch(getPlotDataUrl(selectionFileId));
    return await selectedDataResponse.json();
}

function getPlotDataUrl(fileId: string){
    return `/api/visual-attention/plotly/${fileId}`;
}

export default function VisualAttentionPlot({selectionFileId}:{ selectionFileId?: string }) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [plotData, setPlotData] = useState<Data[]>([]);
    const {layout: actionsLayout} = useDataContext().actionsPlotData;
    const [plotLayout, setPlotLayout] = useState<Partial<Layout>>(layoutTemplate);

    useEffect(() => {
        const fetchData = async (fileId: string) => {
            try {
                const selectedData = await fetchPlotData(fileId);
                setPlotData(selectedData);
            } catch (error) {
                setPlotData([]);
                console.log('error', error);
            }
            setLoading(false);
        }
        if(selectionFileId){
            setLoading(true);
            fetchData(selectionFileId).catch(console.error);
        }
        else {
            setPlotData([]);
        }
    }, [selectionFileId]);

    useEffect(() => {
        if(selectionFileId && (plotData && plotData.length>0) && actionsLayout){
            const cognitivePlotLayout = {...layoutTemplate, xaxis: actionsLayout.xaxis};
            setPlotLayout(cognitivePlotLayout);
        }
        else {
            setPlotLayout({});
        }
    }, [plotData, actionsLayout]);

    return <PlotContainer isLoading={isLoading}
                          dataLoadingMessage='Loading Visual Attention Plot Data...'
                          noDataFoundMessage='No data found for Visual Attention Plot'
                          noDataFoundFn={() => plotData.length === 0}>
        <Plot data={plotData} layout={plotLayout} width='100%' height='500px'/>
    </PlotContainer>;
}

const layoutTemplate: Partial<Layout> = {
    'title': {
        'text': 'Visual Attention - (sliding window: 10 s, step: 10 s)',
        'y': 0.98
    },
    'margin': {
        't': 60,
        'l': 50,
        'r': 50,
        'b': 50
    },
    'yaxis': {
        'title': 'Proportion of time spent looking at each area of interest',
        'range': [
            0,
            1
        ]
    },
    'barmode': 'stack',
    'bargap': 0,
    'autosize': true,
    'modebar': {
        'orientation': 'v'
    },
    'legend': {
        'orientation': 'h',
        'x': 0.5,
        'y': 1,
        'xanchor': 'center',
        'yanchor': 'bottom',
        'traceorder': 'normal'
    }
};
