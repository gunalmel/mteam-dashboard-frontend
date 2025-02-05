import {Layout, ScatterData} from 'plotly.js-basic-dist';

function show(index: number, series: Partial<ScatterData>, actionsLayout: Partial<Layout>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    series.hoverinfo[index] = 'text';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    series.textfont.color[index] = 'rgba(0,0,0,1)';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    series.marker.opacity[index] = 1;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    actionsLayout.images[index].opacity = 1;
}

function hide(index: number, series: Partial<ScatterData>, actionsLayout: Partial<Layout>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    series.hoverinfo[index] = 'none';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    series.textfont.color[index] = 'rgba(0,0,0,0)';
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    series.marker.opacity[index] = 0;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    actionsLayout.images[index].opacity = 0;
}

export default function filterActions(selectedActions: string[], plotData: Partial<ScatterData>[], actionsLayout: Partial<Layout>): {plotData: Partial<ScatterData>[], actionsLayout: Partial<Layout>} {
    plotData.forEach(series => {
        if (series.customdata && series.customdata.length > 0) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            series.hoverinfo = [];
            series.textfont = series.textfont || {};
            series.textfont.color = series.textfont.color || [];
            series.marker = series.marker || {};
            series.marker.color = series.marker.color|| [];
            series.marker.opacity = series.marker.opacity || [];

            series.customdata.forEach((value, index) => {
                const shouldDisplay = selectedActions.includes(value as string);

                if (shouldDisplay) {
                    show(index, series, actionsLayout);
                } else {
                    hide(index, series, actionsLayout);
                }
            });
        }
    });
    return {plotData:[...plotData], actionsLayout: {...actionsLayout}};
}
