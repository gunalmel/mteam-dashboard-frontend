import { DataSourceProvider, useDataContext } from '@/contexts/DataSourceContext';
import DataSourceSelector from './DataSourceSelector';
import React, {FC, useCallback, useRef, useState} from 'react';
import CognitiveLoadPlot from '@components/CognitiveLoadPlot';
import ActionsPlot from '@components/ActionsPlot';
import SelectorButtonGroup from '@components/SelectorButtonGroup';
import useCognitiveLoadVisualAttentionFiles from '@/hooks/useCognitiveLoadVisualAttentionFiles';
import VisualAttentionPlot from '@components/VisualAttentionPlot';
import VideoPlayer from '@components/VideoPlayer';
import StickyDiv from '@components/StickyDiv';


const DashboardContent: FC = () => {
    const { selectedDataFilesContainerId, actionsPlotData } = useDataContext();
    const [currentVideoTime, setCurrentVideoTime] = useState<number>(0);
    const {cognitiveLoadFiles, cognitivePlotDataUrls, selectedCognitiveLoadFiles, setSelectedCognitiveLoadFiles, visualAttentionFiles, visualAttentionDataUrl, setSelectedVisualAttentionFile} = useCognitiveLoadVisualAttentionFiles(selectedDataFilesContainerId);
    const videoSeekTo = useRef(0);

    const handleVideoTimelineUpdate = useCallback((time: number) => {
        setCurrentVideoTime(time);
    }, []);

    return (
        <div className='flex flex-col justify-evenly'>
            <StickyDiv>
            <VideoPlayer
                videoElementId='video'
                onTimeUpdate={handleVideoTimelineUpdate}
                seekTo={videoSeekTo.current}
                videoUrl={selectedDataFilesContainerId?`/api/data-sources/${selectedDataFilesContainerId}/video`:undefined}
            />
            </StickyDiv>
            <DataSourceSelector/>
            <ActionsPlot actionsPlotData={actionsPlotData} currentTime={currentVideoTime}/>
            <div className='flex flex-col items-center p-2'>
                <SelectorButtonGroup selections={cognitiveLoadFiles}
                                     selectedValue={selectedCognitiveLoadFiles[1][1]}
                                     onSelect={({selectedName, selectedValue}) => {
                                         setSelectedCognitiveLoadFiles((prev) => [[prev[0][0], prev[0][1]], [selectedName, selectedValue]]); //keep average in the set always
                                         setSelectedVisualAttentionFile(visualAttentionFiles[selectedName])
                                     }}
                />
            </div>
            <CognitiveLoadPlot currentTime={currentVideoTime} fileUrls={cognitivePlotDataUrls} actionsLayout={actionsPlotData.layout}/>
            <VisualAttentionPlot currentTime={currentVideoTime} fileUrl={visualAttentionDataUrl}/>
        </div>
    );
};

const Dashboard: FC = () => (
    <DataSourceProvider>
        <DashboardContent />
    </DataSourceProvider>
);

export default Dashboard;


