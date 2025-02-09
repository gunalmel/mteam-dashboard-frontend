import {useEffect, useState} from 'react';
import {Layout, ScatterData} from 'plotly.js-basic-dist';
import {ImageToggleItem} from '@/types';

export const useActionsData = (dataSource: string) => {
    const [data, setData] = useState<Partial<ScatterData>[]>([]);
    const [layout, setLayout] = useState<Partial<Layout>>({});
    const [groupIcons, setGroupIcons] = useState<ImageToggleItem[]>([]);
    const [selectedActions, setSelectedActions] = useState<string[]>([]);
    const [isActionsLoading, setIsActionsLoading] = useState<boolean>(false);

    useEffect(() => {
        const url = `/api/data-sources/${dataSource}/actions`;

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const json = await response.json();
                const {data, layout, actionGroupIcons: allActionGroupIcons}:{data:Partial<ScatterData>[], layout:Partial<Layout>,actionGroupIcons: Record<string,string>} = json;
                const actionGroupIconMap:ImageToggleItem[] = Object.entries(allActionGroupIcons).map(([group, icon]:[string,string]) => ({value: group, source: icon}));
                setGroupIcons(actionGroupIconMap)
                setData(data);
                setLayout(layout);
                setSelectedActions(Object.keys(allActionGroupIcons));
            } catch (error) {
                setData([]);
                setLayout({});
                console.log('error', error);
            }
            setIsActionsLoading(false);
        };
        setIsActionsLoading(true);
        if(dataSource) {
            fetchData().catch(console.error);
        }
    }, [dataSource]);

    return {data, layout, isActionsLoading, groupIcons, selectedActions, setSelectedActions};
}
