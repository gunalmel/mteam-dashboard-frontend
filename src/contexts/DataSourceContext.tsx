import {createContext, useContext,  ReactNode, FC} from 'react';
import {useDataSource} from '@/hooks/useDataSource';
import {useActionsData} from '@/hooks/useActionsData';
import {DataSourceContextType} from '@/types';

const DataSourceContext = createContext<DataSourceContextType | undefined>(undefined);

export const DataSourceProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [dataSources, selectedSource, setSelectedSource] = useDataSource();
    const actionsPlot = useActionsData(selectedSource);

    return (
        <DataSourceContext.Provider value={{ dataSources, selectedSource, setSelectedSource, actionsPlot }}>
            {children}
        </DataSourceContext.Provider>
    );
};

export const useDataContext = (): DataSourceContextType => {
    const context = useContext(DataSourceContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataSourceProvider');
    }
    return context;
};
