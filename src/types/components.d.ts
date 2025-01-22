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
