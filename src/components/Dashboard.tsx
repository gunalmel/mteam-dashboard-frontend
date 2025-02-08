import { DataSourceProvider, useDataContext } from '@/contexts/DataSourceContext';
import DropdownSelector from './DataSourceSelector';
import React, {FC} from 'react';
import CognitiveLoadPlot from '@components/CognitiveLoadPlot';
import ActionsPlot from '@components/ActionsPlot';
import SelectorButtonGroup from '@components/SelectorButtonGroup';
import useCognitiveLoadVisualAttentionFiles from '@/hooks/useCognitiveLoadVisualAttentionFiles';
import VisualAttentionPlot from '@components/VisualAttentionPlot';

const DashboardContent: FC = () => {
    const { selectedDataFilesContainerId } = useDataContext();
    const {cognitiveLoadFiles, selectedCognitiveLoadFiles, setSelectedCognitiveLoadFiles, visualAttentionFiles, selectedVisualAttentionFile, setSelectedVisualAttentionFile} = useCognitiveLoadVisualAttentionFiles(selectedDataFilesContainerId);

    return (
        <div className='flex flex-col justify-evenly'>
            <DropdownSelector/>
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
            <CognitiveLoadPlot selections={selectedCognitiveLoadFiles}/>
            <VisualAttentionPlot selectionFileId={selectedVisualAttentionFile}/>
        </div>
    );
};

const Dashboard: FC = () => (
    <DataSourceProvider>
        <DashboardContent />
    </DataSourceProvider>
);

export default Dashboard;


