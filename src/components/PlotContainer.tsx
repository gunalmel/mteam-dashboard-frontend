import PulseLoader from '@components/PulseLoader';
import React from 'react';

export function PlotContainer({noDataFoundFn, noDataFoundMessage, dataLoadingMessage, isLoading, children}: {
    noDataFoundFn: () => boolean,
    noDataFoundMessage: string,
    dataLoadingMessage: string,
    isLoading: boolean,
    children: React.ReactNode
}) {
    return <div className={'flex flex-col items-center'} style={{position: 'relative'}}>
        <PulseLoader isLoading={isLoading} text={dataLoadingMessage}/>
        {noDataFoundFn() ? <div className='p-8 text-center text-gray-600'>{noDataFoundMessage}</div> : children}
    </div>;
}
