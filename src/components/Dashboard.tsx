import { DataSourceProvider, useDataSource } from '@/contexts/DataSourceContext';
import DropdownSelector from './DataSourceSelector';
import ActionsPlot from './ActionsPlot';
import {FC} from 'react';

const DashboardContent: FC = () => {
    const { selectedSource } = useDataSource();

    return (
        <div className='flex flex-col justify-evenly'>
            <DropdownSelector/>
            <ActionsPlot dataSource={selectedSource}/>
        </div>
    );
};

const Dashboard: FC = () => (
    <DataSourceProvider>
        <DashboardContent />
    </DataSourceProvider>
);

export default Dashboard;


