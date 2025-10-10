import React from "react";
import { Select, Input, Switch } from "antd";
import { filterInputEnum } from "../../utlis/constants";
const { Search } = Input;

const FilterInput = ({
  name,
  label,
  placeHolder = "",
  value,
  onSerch = () => {},
  onClear = () => {},
  type,
  selectionOptions = [],
  className = "",
  allowClear = false,
  setFilter,
  showSearch = true,
  mode = false,
  disabled = false,
  extraFilterValues = {},
  notFoundContent = null,
  required = false,
}) => {
  const onChange = (event, name) => {
    if (event?.target) {
      const { value } = event.target;
      setFilter((prev) => ({
        ...prev,
        [name]: value,
        ...(extraFilterValues || {}),
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [name]: event,
        ...(extraFilterValues || {}),
      }));
    }
  };

  return (
    <>
      {label && (
        <div
          className={`text-sm font-medium text-gray-700 ${
            required ? "ant-form-item-required" : ""
          }`}
        >
          {label}
        </div>
      )}
      {type === filterInputEnum?.SELECT ? (
        <Select
          showSearch={showSearch}
          mode={mode}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          placeholder={placeHolder}
          className={`w-full ${className} 
            [&_.ant-select-selector]:!text-start 
        `}
          options={selectionOptions}
          value={value || undefined}
          onChange={(event) => onChange(event, name)}
          maxTagCount="responsive"
          allowClear={allowClear}
          disabled={disabled}
          notFoundContent={notFoundContent}
        />
      ) : type === filterInputEnum?.SEARCH ? (
        <div className="flex items-center gap-4 w-full lg:w-96">
          <Search
            placeholder={placeHolder}
            allowClear
            value={value || undefined}
            onChange={(event) => {
              onChange(event, name);
            }}
            className="flex-grow"
            onSearch={onSerch}
            onClear={onClear}
          />
        </div>
      ) : type === filterInputEnum?.SWITCH ? (
        <Switch
          id={name}
          checked={value}
          onChange={(event) => {
            onChange(event, name);
          }}
          className={`custom-switch font-normal ${className}`}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default FilterInput;
