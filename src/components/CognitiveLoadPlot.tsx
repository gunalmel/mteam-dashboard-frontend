import React, {useEffect, useRef, useState} from 'react';
import Plotly, {Data, Layout} from 'plotly.js-basic-dist';
import config from '@/sample-data/config.json';
import PlotlyPlot from '@components/PlotlyPlot';
import {useDataContext} from '@/contexts/DataSourceContext';

const url = `/api/cognitive-load/plotly/1UcGMtx0K_eS7SEDUlo9W44jgb7BwPs0m`;
const averageUrl = `/api/cognitive-load/plotly/1a0Fs8wKjKD7ZoMumqbigYkb2L0m59Uj_`;

export default function CognitiveLoadPlot({ dataSource }: { dataSource: string }) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [plotData, setPlotData] = useState<Data[]>([]);
    const plotRef = useRef<HTMLDivElement>(null);
    const {layout: actionsLayout} = useDataContext().actionsPlot;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response1, response2] = await Promise.all([
                    fetch(url),
                    fetch(averageUrl),
                ]);

                const [json1, json2] = await Promise.all([response1.json(), response2.json()]);

                json1['line'] = { color: 'blue' };
                json1['name'] = 'Team Lead';

                json2['line'] = { color: 'red' };
                json2['name'] = 'Average';

                setPlotData([json1, json2]);
            } catch (error) {
                setPlotData([]);
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
        const filteredShapes = actionsLayout.shapes?.filter(shape=>shape.y1 as number>0);
        const cognitivePlotLayout  = {...layoutTemplate, shapes: filteredShapes, xaxis: actionsLayout.xaxis};
        if (plotRef.current && plotData && plotData.length>0) {
            Plotly.react(plotRef.current, plotData, cognitivePlotLayout, config).catch(console.error);
        }
    }, [plotData, actionsLayout]);

    return <PlotlyPlot ref={plotRef}
                       className='mt-6'
                       width='100%'
                       height='300px'
                       isLoading={isLoading}
                       isDataAvailable={() => plotData.length > 0}
                       noDataMessage='No data found for Cognitive Load Plot'
                       loaderText='Loading Cognitive Load Plot Data...'/>;
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
