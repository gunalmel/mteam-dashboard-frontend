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

function urlsNotChanged(prevUrls: [[string, string], [string, string]], urls: [[string, string], [string, string]]){
    return prevUrls[0][0]===urls[0][0]&&prevUrls[0][1]===urls[0][1]&&prevUrls[1][0]===urls[1][0]&&prevUrls[1][1]===urls[1][1];
}

export default function useCognitiveLoadVisualAttentionFiles(selectedDataFilesContainerId?: string) {
    const selectedDataFilesContainerUrl = getSelectedDataSourceUrl(selectedDataFilesContainerId)
    const [cognitiveLoadFiles, setCognitiveLoadFiles] = useState<SelectorButtonGroupProps['selections']>({});
    const [selectedCognitiveLoadFiles, setSelectedCognitiveLoadFiles] = useState<[[string, string], [string, string]]>([['', ''], ['', '']]);
    const [visualAttentionFiles, setVisualAttentionFiles] = useState<SelectorButtonGroupProps['selections']>({});
    const [selectedVisualAttentionFile, setSelectedVisualAttentionFile] = useState<string>();
    const [cognitivePlotDataUrls, setCognitivePlotDataUrls] = useState<[[string, string], [string, string]]>([['',''],['','']]);
    const [visualAttentionDataUrl, setVisualAttentionDataUrl] = useState<string|undefined>();

    useEffect(() => {
        const fetchCognitiveLoadVisualAttentionFiles = async () => {
            const dataFilesArray = await fetchAndCacheFileList(selectedDataFilesContainerUrl);
                if (dataFilesArray && dataFilesArray.length > 1) {
                    const cognitiveFilesMap = dataFilesArray[0] as Record<string, string>;
                    const visualAttentionFilesMap = dataFilesArray[1] as Record<string, string>;
                    const filteredCognitiveLoadDataSetMap = {...cognitiveFilesMap};
                    delete filteredCognitiveLoadDataSetMap['Average'];
                    setCognitiveLoadFiles(filteredCognitiveLoadDataSetMap);
                    setVisualAttentionFiles(visualAttentionFilesMap);
                    const defaultSelection = Object.entries(filteredCognitiveLoadDataSetMap)[0];
                    setSelectedCognitiveLoadFiles([['Average', cognitiveFilesMap['Average']], [defaultSelection[0], defaultSelection[1]]]);
                    setSelectedVisualAttentionFile(visualAttentionFilesMap[defaultSelection[0]]);
                    setCognitivePlotDataUrls((prevUrls)=> {
                        const urls = getCognitiveLoadPlotDataUrl(selectedDataFilesContainerId, [['Average', cognitiveFilesMap['Average']], [defaultSelection[0], defaultSelection[1]]]);
                        return urlsNotChanged(prevUrls, urls)?prevUrls:urls;
                    });
                    setVisualAttentionDataUrl(getVisualAttentionDataUrl(selectedDataFilesContainerId, visualAttentionFilesMap[defaultSelection[0]]));
                } else {
                    setCognitiveLoadFiles({});
                    setVisualAttentionFiles({});
                    setSelectedCognitiveLoadFiles([['', ''], ['', '']]);
                    setSelectedVisualAttentionFile('');
                    setCognitivePlotDataUrls([['',''],['','']]);
                    setVisualAttentionDataUrl(undefined);
                }
        }
        if (selectedDataFilesContainerUrl) {
            fetchCognitiveLoadVisualAttentionFiles().catch(console.error);
        }
        else{
            setCognitiveLoadFiles({});
            setVisualAttentionFiles({});
            setSelectedCognitiveLoadFiles([['', ''], ['', '']]);
            setSelectedVisualAttentionFile('');
            setCognitivePlotDataUrls([['',''],['','']]);
            setVisualAttentionDataUrl(undefined);
        }
    }, [selectedDataFilesContainerUrl]);

    useEffect(() => {
        setCognitivePlotDataUrls((prevUrls)=> {
            const urls = getCognitiveLoadPlotDataUrl(selectedDataFilesContainerId, selectedCognitiveLoadFiles);
            return urlsNotChanged(prevUrls, urls)?prevUrls:urls;
        });
        setVisualAttentionDataUrl(getVisualAttentionDataUrl(selectedDataFilesContainerId, selectedVisualAttentionFile));
    },[selectedCognitiveLoadFiles, selectedVisualAttentionFile]);

    return {cognitiveLoadFiles, cognitivePlotDataUrls, selectedCognitiveLoadFiles, setSelectedCognitiveLoadFiles, visualAttentionDataUrl, visualAttentionFiles, selectedVisualAttentionFile, setSelectedVisualAttentionFile};
}


function getSelectedDataSourceUrl(dataFilesContainerId?: string){
    if(!dataFilesContainerId){
        return;
    }
    return `/api/data-sources/${dataFilesContainerId}`
}

function getCognitiveLoadPlotDataUrl(dataFilesContainerId: string|undefined, fileIds: [[string, string], [string, string]]):[[string, string], [string, string]]{
    const baseUrl = getSelectedDataSourceUrl(dataFilesContainerId);
    if(!baseUrl){
        return [['',''],['','']];
    }
    return [
        [fileIds[0][0],fileIds[0][1]?`${baseUrl}/cognitive-load/${fileIds[0][1]}`:''],
        [fileIds[1][0],fileIds[1][1]?`${baseUrl}/cognitive-load/${fileIds[1][1]}`:'']
    ];
}

function getVisualAttentionDataUrl(dataFilesContainerId: string|undefined, fileId?: string){
    if(!dataFilesContainerId||!fileId) {
        return;
    }
    return getSelectedDataSourceUrl(dataFilesContainerId) + `/visual-attention/${fileId}`;
}
