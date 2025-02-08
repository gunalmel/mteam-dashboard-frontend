import clsx from 'clsx';
import {FC, MouseEvent, useCallback} from 'react';
import {ButtonProps, SelectorButtonGroupProps} from '@/types';

const selectionPositionSpecificClasses = (type: 'first' | 'middle' | 'last', selected: boolean) =>
  clsx({
    'border-gray-200 rounded-s-lg': type === 'first',
    'border-gray-200 rounded-s-none': type === 'middle',
    'border-gray-200 rounded-e-lg': type === 'last',
    'bg-white text-gray-900': !selected,
    'bg-blue-600 text-white': selected
  });

const Button: FC<ButtonProps> = ({value, label, position, selected, ...rest}) => (
  <button
    value={value}
    type='button'
    className={`${selectionPositionSpecificClasses(position, selected)} px-4 py-2 text-sm font-medium border hover:bg-blue-200 hover:text-blue-700 focus:ring-2 focus:ring-blue-700`}
    {...rest}>
    {label}
  </button>
);

const SelectorButtonGroup: FC<SelectorButtonGroupProps> = ({selections, selectedValue, onSelect, className}) => {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const selectedButtonValue = event.currentTarget.value;
      const val = selectedButtonValue.split('::');
      onSelect({selectedName: val[0], selectedValue: val[1]});
    },
    [onSelect]
  );

  return (
    <div className={clsx('selector-button-group', 'inline-flex rounded-md shadow-xs', className)} role='group'>
      {Object.entries(selections).map(([label, value], index) => {
        const position = index === 0 ? 'first' : index === Object.keys(selections).length - 1 ? 'last' : 'middle';
        return (
          <Button
            key={value}
            value={`${label}::${value}`}
            label={label}
            position={position}
            selected={selectedValue === value}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
};

export default SelectorButtonGroup;
