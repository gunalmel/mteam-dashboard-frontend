import {FC} from 'react';
import clsx from 'clsx';

const ImageToggle: FC<ImageToggleProps> = ({source, value, checked, onToggle}) => {
    const onChange = () => {
        onToggle(value, !checked);
    };

    return (
        <div className='flex items-center mb-2'>
            <label className='relative inline-flex items-center cursor-pointer select-none'>
                <input type='checkbox' className='peer sr-only' checked={checked} value={value} onChange={onChange} />
                <div
                    className={clsx(`h-3.5 w-11 rounded-md relative peer-focus:ring-blue-300 flex items-center p-1`, {
                        [`bg-blue-300`]: checked,
                        'bg-gray-200': !checked
                    })}>
                    <div
                        className={clsx(
                            'absolute h-5 w-5 rounded-md bg-white shadow-md transition-transform duration-200 ease-in-out',
                            {
                                'translate-x-full': checked,
                                'translate-x-0': !checked
                            }
                        )}>
                        <img
                            height={14}
                            width={14}
                            src={source}
                            alt='On/Off'
                            className={clsx('w-full h-full object-contain transition-filter duration-200 ease-in-out', {
                                grayscale: !checked
                            })}
                        />
                    </div>
                </div>
                <span className='ml-5 text-gray-700'>{value}</span>
            </label>
        </div>
    );
};
export default ImageToggle;
