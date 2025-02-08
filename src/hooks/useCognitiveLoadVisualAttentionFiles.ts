import {useEffect, useState} from 'react';
import {SelectorButtonGroupProps} from '@/types';

async function fetchAndCacheFileList(fileContainerId: string){
    const cognitiveLoadCacheKey = `cognitiveLoad::${fileContainerId}`;
    const visualAttentionCacheKey = `visualAttention::${fileContainerId}`;
    const cognitiveLoadFileString = sessionStorage.getItem(cognitiveLoadCacheKey);
    const visualAttentionFileString = sessionStorage.getItem(visualAttentionCacheKey);
    if (visualAttentionFileString && cognitiveLoadFileString) {
        return [JSON.parse(cognitiveLoadFileString), JSON.parse(visualAttentionFileString)];
    }

    const [cognitiveLoadResponse ,visualAttentionResponse]  = await Promise.all(
        [fetch(getFileListUrl('cognitiveLoad', fileContainerId)),
        fetch(getFileListUrl('visualAttention', fileContainerId))
        ]
    );
    if(cognitiveLoadResponse?.status!=200||visualAttentionResponse?.status!=200){
        return undefined;
    }
    const [cognitiveLoadFileList, visualAttentionFileList] = await Promise.all([cognitiveLoadResponse.json(), visualAttentionResponse.json()]);
    sessionStorage.setItem(cognitiveLoadCacheKey, JSON.stringify(cognitiveLoadFileList));
    return [cognitiveLoadFileList, visualAttentionFileList];
}

function getFileListUrl(dataSourceType: string, fileContainerId: string){
    if(dataSourceType==='cognitiveLoad'){
        return getCognitiveLoadDataSourcesUrl(fileContainerId);
    }
    if(dataSourceType==='visualAttention'){
        return getVisualAttentionDataSourcesUrl(fileContainerId);
    }
    return '';
}

function getCognitiveLoadDataSourcesUrl(dataSourceId: string){
    return `/api/data-sources/${dataSourceId}/cognitive-load`;
}

function getVisualAttentionDataSourcesUrl(dataSourceId: string){
    return `/api/data-sources/${dataSourceId}/visual-attention`;
}

export default function useCognitiveLoadVisualAttentionFiles(selectedDataFilesContainerId: string) {
    const [cognitiveLoadFiles, setCognitiveLoadFiles] = useState<SelectorButtonGroupProps['selections']>({});
    const [selectedCognitiveLoadFiles, setSelectedCognitiveLoadFiles] = useState<[[string, string], [string, string]]>([['', ''], ['', '']]);
    const [visualAttentionFiles, setVisualAttentionFiles] = useState<SelectorButtonGroupProps['selections']>({});
    const [selectedVisualAttentionFile, setSelectedVisualAttentionFile] = useState<string>();

    useEffect(() => {
        const fetchCognitiveLoadVisualAttentionFiles = async () => {
            const dataFilesArray = await fetchAndCacheFileList(selectedDataFilesContainerId);
            if (dataFilesArray && dataFilesArray.length>1) {
                const cognitiveFilesMap =  dataFilesArray[0] as Record<string, string>;
                const visualAttentionFilesMap =  dataFilesArray[1] as Record<string, string>;
                const filteredCognitiveLoadDataSetMap = {...cognitiveFilesMap};
                delete filteredCognitiveLoadDataSetMap['Average'];
                setCognitiveLoadFiles(filteredCognitiveLoadDataSetMap);
                setVisualAttentionFiles(visualAttentionFilesMap);
                const defaultSelection = Object.entries(filteredCognitiveLoadDataSetMap)[0];
                setSelectedCognitiveLoadFiles([['Average', cognitiveFilesMap['Average']], [defaultSelection[0], defaultSelection[1]]]);
                setSelectedVisualAttentionFile(visualAttentionFilesMap[defaultSelection[0]]);
            }
            else {
                setCognitiveLoadFiles({});
                setVisualAttentionFiles({});
                setSelectedCognitiveLoadFiles([['', ''], ['', '']]);
                setSelectedVisualAttentionFile('');
            }
        }
        if (selectedDataFilesContainerId) {
            fetchCognitiveLoadVisualAttentionFiles().catch(console.error);
        }
    }, [selectedDataFilesContainerId]);

    return {cognitiveLoadFiles, selectedCognitiveLoadFiles, setSelectedCognitiveLoadFiles, visualAttentionFiles, selectedVisualAttentionFile, setSelectedVisualAttentionFile};
}
