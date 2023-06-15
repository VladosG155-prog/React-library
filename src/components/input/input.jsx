import { Icon } from '../icon/icon';

import './input.scss';

export const Input = ({ value, onChange, iconName, iconPosition, placeholder, iconAction, ...props }) => {
  const change = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className='input-wrap' data-position={iconPosition}>
      {iconName ? (
        <button type='button' data-test-id='button-search-close' onClick={iconAction} className='icon-wrap'>
          <Icon name={iconName} />
        </button>
      ) : null}

      <input
        className='input'
        data-test-id='input-search'
        value={value}
        onChange={change}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};
