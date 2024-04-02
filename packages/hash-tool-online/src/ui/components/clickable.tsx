import { HTMLAttributes, KeyboardEvent, PropsWithChildren } from 'react';

export default function Clickable({
  onKeyDown,
  children,
  ...props
}: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (onKeyDown) {
      onKeyDown(e);

      if (e.defaultPrevented) {
        return;
      }
    }

    if (e.key === 'Enter') {
      e.currentTarget.click();
    }
  };

  return (
    <div tabIndex={0} {...props} onKeyDown={handleKeyDown}>
      {children}
    </div>
  );
}
