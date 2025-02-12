import Plotly, {Config, Data, Layout} from 'plotly.js-basic-dist';
import {useEffect, useRef} from 'react';

interface PlotlyClickEvent {
    points: Array<{
        x: string;
        y: string;
    }>;
}

interface PlotlyHTMLElement extends HTMLDivElement {
    on(eventName: 'plotly_click', callback: (event: PlotlyClickEvent) => void): void;
    removeListener(eventName: 'plotly_click', callback: (event: PlotlyClickEvent) => void): void;
}

const defaultConfig = {'displayModeBar': true, 'responsive': true, 'displaylogo': false};

export default function Plot({data, layout, width = '100%', height = '600px', config = defaultConfig, onClick}: {
    data: Partial<Data>[],
    layout: Partial<Layout>,
    width: string,
    height: string,
    config?: Partial<Config>,
    onClick?: (x: string, y: string) => void
}) {
    const graphRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let handler: ((event: PlotlyClickEvent) => void) | undefined;

        if (graphRef.current && data && data.length > 0) {
            Plotly.react(graphRef.current, data, layout, config)
                .then(() => {
                    if (onClick) {
                        handler = (event: PlotlyClickEvent) => {
                            if (event.points && event.points.length > 0) {
                                const { x, y } = event.points[0];
                                onClick(x, y);
                            }
                        };
                        // Cast to our extended type so TypeScript knows about `on`
                        const graphDiv = graphRef.current as PlotlyHTMLElement;
                        graphDiv.on('plotly_click', handler);
                    }
                })
                .catch(console.error);
        }

        // Cleanup: remove the event listener when the effect re-runs or the component unmounts.
        return () => {
            if (graphRef.current && onClick && handler) {
                const graphDiv = graphRef.current as PlotlyHTMLElement;
                // Use removeListener to remove the specific event handler.
                graphDiv.removeListener('plotly_click', handler);
            }
        };
    }, [data, layout, config, onClick]);

    return <div ref={graphRef} style={{height:`${height}`,width:`${width}`}}></div>;
}
