interface PlotlyPlotProps {
    isLoading: boolean;
    isDataAvailable: () => boolean;
    noDataMessage: string;
    width?: string;
    height?: string;
    loaderText?: string;
    className?: string;
}

interface ImageToggleItem {
    source: string;
    value: string;
}

interface ImageToggleProps extends ImageToggleItem {
    checked: boolean;
    onToggle: (selectedItem: string, selected: boolean) => void;
}

interface ToggleGridProps {
    items: ImageToggleItem[];
    onChange: (selectedItems: string[]) => void;
}
