import Plotly, {Config, Data, Layout} from 'plotly.js-basic-dist';
import {useEffect, useRef} from 'react';

const defaultConfig = {'displayModeBar': true, 'responsive': true, 'displaylogo': false};

export default function Plot({data, layout, width = '100%', height = '600px', config = defaultConfig}: {
    data: Partial<Data>[],
    layout: Partial<Layout>,
    width: string,
    height: string,
    config?: Partial<Config>
}) {
    const graphRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (graphRef.current && data && data.length>0) {
            // Apply filtering without re-rendering the entire chart
            Plotly.react(graphRef.current, data, layout, config).catch(console.error);
        }
    }, [data, layout]);

    return <div ref={graphRef} style={{height:`${height}`,width:`${width}`}}></div>;
}
