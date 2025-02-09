import {useEffect, useState} from 'react';
import {SelectorButtonGroupProps} from '@/types';

async function fetchAndCacheFileList(selectedDataFilesContainerUrl?: string){
    if(!selectedDataFilesContainerUrl){
        return undefined;
    }
    const cognitiveLoadCacheKey = `cognitiveLoad::${selectedDataFilesContainerUrl}`;
    const visualAttentionCacheKey = `visualAttention::${selectedDataFilesContainerUrl}`;
    const cognitiveLoadFileString = sessionStorage.getItem(cognitiveLoadCacheKey);
    const visualAttentionFileString = sessionStorage.getItem(visualAttentionCacheKey);
    if (visualAttentionFileString && cognitiveLoadFileString) {
        return [JSON.parse(cognitiveLoadFileString), JSON.parse(visualAttentionFileString)];
    }

    const [cognitiveLoadResponse ,visualAttentionResponse]  = await Promise.all(
        [fetch(getFileListUrl('cognitiveLoad', selectedDataFilesContainerUrl)),
        fetch(getFileListUrl('visualAttention', selectedDataFilesContainerUrl))
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

function getCognitiveLoadDataSourcesUrl(selectedDataFilesContainerUrl: string){
    return `${selectedDataFilesContainerUrl}/cognitive-load`;
}

function getVisualAttentionDataSourcesUrl(selectedDataFilesContainerUrl: string){
    return `${selectedDataFilesContainerUrl}/visual-attention`;
}

export default function useCognitiveLoadVisualAttentionFiles(selectedDataFilesContainerUrl?: string) {
    const [cognitiveLoadFiles, setCognitiveLoadFiles] = useState<SelectorButtonGroupProps['selections']>({});
    const [selectedCognitiveLoadFiles, setSelectedCognitiveLoadFiles] = useState<[[string, string], [string, string]]>([['', ''], ['', '']]);
    const [visualAttentionFiles, setVisualAttentionFiles] = useState<SelectorButtonGroupProps['selections']>({});
    const [selectedVisualAttentionFile, setSelectedVisualAttentionFile] = useState<string>();

    useEffect(() => {
        const fetchCognitiveLoadVisualAttentionFiles = async () => {
            const dataFilesArray = await fetchAndCacheFileList(selectedDataFilesContainerUrl);
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
        if (selectedDataFilesContainerUrl) {
            fetchCognitiveLoadVisualAttentionFiles().catch(console.error);
        }
    }, [selectedDataFilesContainerUrl]);

    return {cognitiveLoadFiles, selectedCognitiveLoadFiles, setSelectedCognitiveLoadFiles, visualAttentionFiles, selectedVisualAttentionFile, setSelectedVisualAttentionFile};
}
