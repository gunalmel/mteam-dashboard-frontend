import { DataSourceProvider, useDataSource } from '../contexts/DataSourceContext';
import DropdownSelector from './DataSourceSelector';
import ActionsPlot from './ActionsPlot';
import {FC} from 'react';

const DashboardContent: FC = () => {
    const { selectedSource } = useDataSource();

    return (
            <div>
                <h1>Dashboard</h1>
                <DropdownSelector />
                <ActionsPlot dataSource={selectedSource} />
            </div>
    );
};

const Dashboard: FC = () => (
    <DataSourceProvider>
        <DashboardContent />
    </DataSourceProvider>
);

export default Dashboard;


