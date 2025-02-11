import { DataSourceProvider, useDataContext } from '@/contexts/DataSourceContext';
import DataSourceSelector from './DataSourceSelector';
import React, {FC, useCallback, useMemo, useRef, useState} from 'react';
import CognitiveLoadPlot from '@components/CognitiveLoadPlot';
import ActionsPlot from '@components/ActionsPlot';
import SelectorButtonGroup from '@components/SelectorButtonGroup';
import useCognitiveLoadVisualAttentionFiles from '@/hooks/useCognitiveLoadVisualAttentionFiles';
import VisualAttentionPlot from '@components/VisualAttentionPlot';
import VideoPlayer from '@components/VideoPlayer';

function getSelectedDataSourceUrl(dataFilesContainerId?: string){
    if(!dataFilesContainerId){
        return;
    }
    return `/api/data-sources/${dataFilesContainerId}`
}

function getCognitiveLoadPlotDataUrl(dataFilesContainerId: string|undefined, fileIds: [[string, string], [string, string]]):[[string, string], [string, string]]{
    const baseUrl = getSelectedDataSourceUrl(dataFilesContainerId);
    if(!baseUrl){
        return [['',''],['','']];
    }
    return [
        [fileIds[0][0],`${baseUrl}/cognitive-load/${fileIds[0][1]}`],
        [fileIds[1][0],`${baseUrl}/cognitive-load/${fileIds[1][1]}`]
    ];
}

function getVisualAttentionDataUrl(dataFilesContainerId: string|undefined, fileId?: string){
    if(!dataFilesContainerId||!fileId) {
        return;
    }
    return getSelectedDataSourceUrl(dataFilesContainerId) + `/visual-attention/${fileId}`;
}

const DashboardContent: FC = () => {
    const { selectedDataFilesContainerId } = useDataContext();
    const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
    const {cognitiveLoadFiles, selectedCognitiveLoadFiles, setSelectedCognitiveLoadFiles, visualAttentionFiles, selectedVisualAttentionFile, setSelectedVisualAttentionFile} = useCognitiveLoadVisualAttentionFiles(getSelectedDataSourceUrl(selectedDataFilesContainerId));
    const videoSeekTo = useRef(0);
    const memoizedFileUrls = useMemo(() => getCognitiveLoadPlotDataUrl(selectedDataFilesContainerId, selectedCognitiveLoadFiles), [selectedDataFilesContainerId,selectedCognitiveLoadFiles]);

    const handleVideoTimelineUpdate = useCallback((time: number) => {
        setCurrentVideoTime(time);
    }, []);

    return (
        <div className='flex flex-col justify-evenly'>
            <VideoPlayer
                videoElementId='video'
                onTimeUpdate={handleVideoTimelineUpdate}
                seekTo={videoSeekTo.current}
                videoUrl={selectedDataFilesContainerId?`/api/data-sources/${selectedDataFilesContainerId}/video`:undefined}
            />
            <DataSourceSelector/>
            <ActionsPlot currentTime={currentVideoTime}/>
            <div className='flex flex-col items-center p-2'>
                <SelectorButtonGroup selections={cognitiveLoadFiles}
                                     selectedValue={selectedCognitiveLoadFiles[1][1]}
                                     onSelect={({selectedName, selectedValue}) => {
                                         setSelectedCognitiveLoadFiles((prev) => [[prev[0][0], prev[0][1]], [selectedName, selectedValue]]);
                                         setSelectedVisualAttentionFile(visualAttentionFiles[selectedName])
                                     }}
                />
            </div>
            <CognitiveLoadPlot currentTime={currentVideoTime} fileUrls={memoizedFileUrls}/>
            <VisualAttentionPlot currentTime={currentVideoTime} fileUrl={getVisualAttentionDataUrl(selectedDataFilesContainerId, selectedVisualAttentionFile??'')}/>
        </div>
    );
};

const Dashboard: FC = () => (
    <DataSourceProvider>
        <DashboardContent />
    </DataSourceProvider>
);

export default Dashboard;


