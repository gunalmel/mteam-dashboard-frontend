import { useDataSource } from '../contexts/DataSourceContext';
import {ChangeEvent, FC} from 'react';

const DropdownSelector: FC = () => {
    const { dataSources, selectedSource, setSelectedSource } = useDataSource();

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedSource(event.target.value);
    };

    return (
        <select value={selectedSource} onChange={handleChange}>
            {dataSources.map((source) => (
                <option key={source.id} value={source.id}>
                    {source.name}
                </option>
            ))}
        </select>
    );
};

export default DropdownSelector;
