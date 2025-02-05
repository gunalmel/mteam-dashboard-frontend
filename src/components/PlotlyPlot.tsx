import React, { forwardRef, RefObject } from 'react';
import PulseLoader from './PulseLoader';

const PlotlyPlot = forwardRef<HTMLDivElement, PlotlyPlotProps>(
    ({ className, isLoading, isDataAvailable, noDataMessage, width = '100%', height = '600px', loaderText = 'Fetching data...' }, ref) => {
        return <div className={`flex flex-col items-center ${className}`} style={{ position: 'relative' }}>
            <PulseLoader isLoading={isLoading} text={loaderText} />
            {!isDataAvailable() ? (
                <div className={`p-8 text-center text-gray-600 ${className}`}>{noDataMessage}</div>
            ) : (

                <div ref={ref as RefObject<HTMLDivElement>} style={{height:`${height}`,width:`${width}`}}></div>
            )}
            </div>
    }
);

PlotlyPlot.displayName = 'PlotlyPlot';

export default PlotlyPlot;
