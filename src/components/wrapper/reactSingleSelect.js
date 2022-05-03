import React from 'react';
import Select from 'react-select';


const ClearIndicator = props => {
    const {
      innerProps: { ref, ...restInnerProps }
    } = props;
    return null;
  };
  
  const DropdownIndicator = props => {
    return <span className="icon icon-chevron-down" />;
  };
  
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'black',
      backgroundColor: state.isSelected ? '#00A69E' : null,
      padding: '0 10px',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#00A69E',
        color: '#FFFFFF'
      }
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    },
    dropdownIndicator: (provided, state) => {
      return {
        ...provided
      };
    },
    indicatorSeparator: (provided, state) => {}
  };

  

export const ReactSingleSelect = (props) => {
    const {
        options,
        selectedOption,
        name,
        className,
        classNamePrefix,
        isDisabled = false,
        isClearable,
        isSearchable,
        placeholder,
        handleChange,
        defaultValue
      } = props;
  
    return (
    <Select
        value={selectedOption}
        className={className}
        defaultValue={defaultValue}
        classNamePrefix={classNamePrefix}
        isDisabled={isDisabled}
        components={{ ClearIndicator, DropdownIndicator }}
        isClearable={isClearable}
        isSearchable={isSearchable}
        name={name}
        styles={customStyles}
        options={options}
        onChange={handleChange}
        placeholder={placeholder}
    />
    );
}
