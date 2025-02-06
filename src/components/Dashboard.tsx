import { DataSourceProvider, useDataContext } from '@/contexts/DataSourceContext';
import DropdownSelector from './DataSourceSelector';
import {FC} from 'react';
import CognitiveLoadPlot from '@components/CognitiveLoadPlot';
import ActionsPlot from '@components/ActionsPlot';

const DashboardContent: FC = () => {
    const { selectedSource } = useDataContext();

    return (
        <div className='flex flex-col justify-evenly'>
            <DropdownSelector/>
            <ActionsPlot/>
            <CognitiveLoadPlot dataSource={selectedSource}/>
        </div>
    );
};

const Dashboard: FC = () => (
    <DataSourceProvider>
        <DashboardContent />
    </DataSourceProvider>
);

export default Dashboard;


