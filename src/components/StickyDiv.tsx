import {HTMLAttributes, ReactNode} from 'react';

export default function StickyDiv({stickyClassName = 'sticky', children, ...rest}: {
  stickyClassName?: string,
  children: ReactNode,
  rest?: HTMLAttributes<HTMLDivElement>
}) {
  return (
    <div className={stickyClassName} {...rest}>
      {children}
    </div>
  );
}
