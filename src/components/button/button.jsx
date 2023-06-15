import './button.scss';

export const Button = ({
  onClick,
  children,
  btnType = 'default',
  rounded = 'false',
  fullwidth,
  disabled,
  className = '',
  dataTest,
  submit,
  height = 'auto',
}) => (
  <button
    style={fullwidth ? { width: '100%', height } : null}
    type={submit ? 'submit' : 'button'}
    className={`button ${className}`}
    data-type={btnType}
    disabled={disabled}
    data-rounded={rounded}
    onClick={onClick}
    data-test-id={dataTest}
  >
    {children}
  </button>
);
