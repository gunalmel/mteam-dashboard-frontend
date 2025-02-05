import {Layout, ScatterData} from 'plotly.js-basic-dist';
import {Dispatch, SetStateAction} from 'react';

interface DataSource {
    id: string;
    name: string;
}

interface DataSourceContextType {
    dataSources: DataSource[];
    selectedSource: string;
    setSelectedSource: (source: string) => void,
    actionsPlot: {data:Partial<ScatterData>[],
                  layout: Partial<Layout>,
                  isActionsLoading: boolean,
                  groupIcons: ImageToggleItem[],
                  selectedActions: string[],
                  setSelectedActions: Dispatch<SetStateAction<string[]>>};
}
