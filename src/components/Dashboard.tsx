import { DataSourceProvider, useDataContext } from '@/contexts/DataSourceContext';
import DataSourceSelector from './DataSourceSelector';
import React, {FC} from 'react';
import CognitiveLoadPlot from '@components/CognitiveLoadPlot';
import ActionsPlot from '@components/ActionsPlot';
import SelectorButtonGroup from '@components/SelectorButtonGroup';
import useCognitiveLoadVisualAttentionFiles from '@/hooks/useCognitiveLoadVisualAttentionFiles';
import VisualAttentionPlot from '@components/VisualAttentionPlot';

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
    const {cognitiveLoadFiles, selectedCognitiveLoadFiles, setSelectedCognitiveLoadFiles, visualAttentionFiles, selectedVisualAttentionFile, setSelectedVisualAttentionFile} = useCognitiveLoadVisualAttentionFiles(getSelectedDataSourceUrl(selectedDataFilesContainerId));

    return (
        <div className='flex flex-col justify-evenly'>
            <DataSourceSelector/>
            <ActionsPlot/>
            <div className='flex flex-col items-center p-2'>
                <SelectorButtonGroup selections={cognitiveLoadFiles}
                                     selectedValue={selectedCognitiveLoadFiles[1][1]}
                                     onSelect={({selectedName, selectedValue}) => {
                                         setSelectedCognitiveLoadFiles((prev) => [[prev[0][0], prev[0][1]], [selectedName, selectedValue]]);
                                         setSelectedVisualAttentionFile(visualAttentionFiles[selectedName])
                                     }}
                />
            </div>
            <CognitiveLoadPlot fileUrls={getCognitiveLoadPlotDataUrl(selectedDataFilesContainerId, selectedCognitiveLoadFiles)}/>
            <VisualAttentionPlot fileUrl={getVisualAttentionDataUrl(selectedDataFilesContainerId, selectedVisualAttentionFile??'')}/>
        </div>
    );
};

const Dashboard: FC = () => (
    <DataSourceProvider>
        <DashboardContent />
    </DataSourceProvider>
);

export default Dashboard;


