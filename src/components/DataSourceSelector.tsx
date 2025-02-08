import {useDataContext} from '@/contexts/DataSourceContext';
import {ChangeEvent, FC} from 'react';

const DataSourceSelector: FC = () => {
    const {dataFilesContainers, selectedDataFilesContainerId, setSelectedDataFilesContainerId} = useDataContext();

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedDataFilesContainerId(event.target.value);
    };

    return (
        <div className='flex items-center justify-center gap-4 p-4 text-sm'>
            <label htmlFor='simulation-date' className='text-gray-700'>
                Select simulation data:
            </label>
            <select id='simulation-date' className='border rounded-md cursor-pointer text-xs' value={selectedDataFilesContainerId} onChange={handleChange}>
                {dataFilesContainers.map((source) => (
                    <option key={source.id} value={source.id}>
                        {source.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default DataSourceSelector;
