// contexts/DataSourceContext.tsx
import {createContext, useContext, useState, useEffect, ReactNode, FC} from 'react';

type DataSource = {
    id: string;
    name: string;
};

type DataSourceContextType = {
    dataSources: DataSource[];
    selectedSource: string;
    setSelectedSource: (source: string) => void;
};

const DataSourceContext = createContext<DataSourceContextType | undefined>(undefined);

export const DataSourceProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [dataSources, setDataSources] = useState<DataSource[]>([]);
    const [selectedSource, setSelectedSource] = useState<string>('');

    useEffect(() => {
        const fetchDataSources = async () => {
            try {
                const response = await fetch('/api/data-sources');
                const sources: DataSource[] = await response.json();
                setDataSources(
                    sources.map((source) => ({
                        id: source.id,
                        name: source.name
                    }))
                );
                if (sources.length > 0) {
                    setSelectedSource(sources[0].id); // Default to the first data source.
                }
            } catch (error) {
                console.error('Error fetching data sources:', error);
            }
        };

        fetchDataSources().catch(console.error);
    }, []);

    return (
        <DataSourceContext.Provider value={{ dataSources, selectedSource, setSelectedSource }}>
            {children}
        </DataSourceContext.Provider>
    );
};

export const useDataSource = (): DataSourceContextType => {
    const context = useContext(DataSourceContext);
    if (!context) {
        throw new Error('useDataSource must be used within a DataSourceProvider');
    }
    return context;
};
