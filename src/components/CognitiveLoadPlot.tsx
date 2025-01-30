import {useEffect, useRef, useState} from 'react';
import Plotly, {Data, Layout} from 'plotly.js-basic-dist';
import config from '@/sample-data/config.json';
import PlotlyPlot from '@components/PlotlyPlot';

const url = `/api/cognitive-load/plotly/1UcGMtx0K_eS7SEDUlo9W44jgb7BwPs0m`;
const averageUrl = `/api/cognitive-load/plotly/1a0Fs8wKjKD7ZoMumqbigYkb2L0m59Uj_`;

export default function CognitiveLoadPlot({ dataSource }: { dataSource: string }) {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [plotData, setPlotData] = useState<Data[]>([]);
    const plotRef = useRef<HTMLDivElement>(null);

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
        if (plotRef.current && plotData && plotData.length>0) {
            Plotly.react(plotRef.current, plotData, layout, config).catch(console.error);
        }
    }, [plotData]);

    return <PlotlyPlot className='mt-6' ref={plotRef}
                       width='100%'
                       height='300px'
                       isLoading={isLoading}
                       isDataAvailable={() => plotData.length > 0}
                       noDataMessage='No data found for Cognitive Load Plot'
                       loaderText='Loading Cognitive Load Plot Data...'></PlotlyPlot>;
}

const layout: Partial<Layout> = {
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
    'shapes': [
        {
            'x0': '2025-01-30 00:00:00',
            'x1': '2025-01-30 00:01:55',
            'fillcolor': '#1f77b433',
            'name': 'V Tach WITH Pulse',
            'y0': 0,
            'y1': 12.5,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        },
        {
            'x0': '2025-01-30 00:00:00',
            'x1': '2025-01-30 00:01:55',
            'fillcolor': '#1f77b433',
            'name': 'V Tach WITH Pulse',
            'y0': -1,
            'y1': -4,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        },
        {
            'x0': '2025-01-30 00:01:55',
            'x1': '2025-01-30 00:04:36',
            'fillcolor': '#d6272833',
            'name': 'V Tach NO Pulse.A',
            'y0': 0,
            'y1': 12.5,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        },
        {
            'x0': '2025-01-30 00:01:55',
            'x1': '2025-01-30 00:04:36',
            'fillcolor': '#d6272833',
            'name': 'V Tach NO Pulse.A',
            'y0': -1,
            'y1': -4,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        },
        {
            'x0': '2025-01-30 00:04:36',
            'x1': '2025-01-30 00:05:51',
            'fillcolor': '#2ca02c33',
            'name': 'V Tach NO Pulse.B',
            'y0': 0,
            'y1': 12.5,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        },
        {
            'x0': '2025-01-30 00:04:36',
            'x1': '2025-01-30 00:05:51',
            'fillcolor': '#2ca02c33',
            'name': 'V Tach NO Pulse.B',
            'y0': -1,
            'y1': -4,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        },
        {
            'x0': '2025-01-30 00:05:51',
            'x1': '2025-01-30 00:06:10',
            'fillcolor': '#8c564b33',
            'name': 'Asystole',
            'y0': 0,
            'y1': 12.5,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        },
        {
            'x0': '2025-01-30 00:05:51',
            'x1': '2025-01-30 00:06:10',
            'fillcolor': '#8c564b33',
            'name': 'Asystole',
            'y0': -1,
            'y1': -4,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        },
        {
            'x0': '2025-01-30 00:06:10',
            'x1': '2025-01-30 00:08:15',
            'fillcolor': '#9467bd33',
            'name': 'VF -V FIB',
            'y0': 0,
            'y1': 12.5,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        },
        {
            'x0': '2025-01-30 00:06:10',
            'x1': '2025-01-30 00:08:15',
            'fillcolor': '#9467bd33',
            'name': 'VF -V FIB',
            'y0': -1,
            'y1': -4,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        },
        {
            'x0': '2025-01-30 00:08:15',
            'x1': '2025-01-30 00:10:56',
            'fillcolor': '#ff7f0e33',
            'name': 'ROSC',
            'y0': 0,
            'y1': 12.5,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        },
        {
            'x0': '2025-01-30 00:08:15',
            'x1': '2025-01-30 00:10:56',
            'fillcolor': '#ff7f0e33',
            'name': 'ROSC',
            'y0': -1,
            'y1': -4,
            'type': 'rect',
            'xref': 'x',
            'yref': 'y',
            'line': {
                'width': 0
            },
            'layer': 'below'
        }
    ],
    'annotations': [],
    'xaxis': {
        'range': [
            '2025-01-30 00:00:00',
            '2025-01-30 00:11:10'
        ],
        'title': 'Time (seconds)',
        'showgrid': false,
        'tickformat': '%H:%M:%S'
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
    'images': [],
    'showlegend': true,
    'legend': {
        'x': 1,
        'xanchor': 'right',
        'y': 1
    }
};
