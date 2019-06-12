import React from 'react';

const styles = {
  error: {
    color: 'red',
  },
  inputDisabled: {
    background: '#efefef',
  },
  inputHorizontal: {
    margin: '0',
    padding: '5px',
    width: '100px',
  },
  inputInvalid: {
    border: '2px solid red',
  },
  inputTable: {
    padding: '5px',
    width: '100%',
  },
};

const BinningInput = ({
  binningMethod,
  disabled,
  handleChange,
  handleClick,
  inputError,
  inputId,
  valid,
  validateOnBlur,
  value,
}) => {
  // console.log('input', inputId, value);
  return (
    <React.Fragment>
      <input
        disabled={disabled}
        id={inputId}
        onBlur={validateOnBlur}
        onChange={handleChange}
        onClick={handleClick}
        style={{
          ...(binningMethod === 'interval' ? styles.inputHorizontal : styles.inputTable),
          ...(disabled ? styles.inputDisabled : {}),
          ...(valid ? {} : styles.inputInvalid),
        }}
        type="text"
        value={value}
        />
      {inputError && <div style={styles.error}>{inputError}</div>}
    </React.Fragment>
  );
};

export default BinningInput;