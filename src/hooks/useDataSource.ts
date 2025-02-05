import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {DataSource} from '@/types';

export const useDataSource = ():[DataSource[], string, Dispatch<SetStateAction<string>>] => {
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

    return [dataSources, selectedSource, setSelectedSource];
}
