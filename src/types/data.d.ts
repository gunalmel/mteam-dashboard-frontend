import {Layout, ScatterData} from 'plotly.js-basic-dist';
import {Dispatch, SetStateAction} from 'react';

interface DataSource {
    id: string;
    name: string;
}

interface ActionsPlotData {
    data: Partial<ScatterData>[];
    layout: Partial<Layout>;
    isActionsLoading: boolean;
    groupIcons: ImageToggleItem[];
    selectedActions: string[];
    setSelectedActions: Dispatch<SetStateAction<string[]>>;
}

interface DataSourceContextType {
    dataFilesContainers: DataSource[];
    selectedDataFilesContainerId: string;
    setSelectedDataFilesContainerId: (source: string) => void,
    actionsPlotData: ActionsPlotData
}
