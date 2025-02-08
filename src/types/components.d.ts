import {ButtonHTMLAttributes} from 'react';

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

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
    label: string;
    position: 'first' | 'middle' | 'last';
    selected: boolean;
}

interface SelectorButtonGroupProps {
    selections: Record<string,string>;
    selectedValue: string;
    onSelect: ({selectedName:string, selectedValue: string}) => void;
    className?: string;
}
