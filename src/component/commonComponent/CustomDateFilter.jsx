// import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
// import { Select, Space, DatePicker } from "antd";
// import dayjs from "dayjs";

// const { RangePicker } = DatePicker;

// const CustomDateFilter = forwardRef(({ onDateChange }, ref) => {
//   const [selectedFilter, setSelectedFilter] = useState("7d");
//   const [range, setRange] = useState([dayjs().subtract(7, "day"), dayjs()]);
//   const [tempRange, setTempRange] = useState(range);

//   const getDateRange = (key) => {
//     const endDate = dayjs();
//     let startDate;

//     switch (key) {
//       case "7d":
//         startDate = dayjs().subtract(7, "day");
//         break;
//       case "15d":
//         startDate = dayjs().subtract(15, "day");
//         break;
//       case "1m":
//         startDate = dayjs().subtract(1, "month");
//         break;
//       case "3m":
//         startDate = dayjs().subtract(3, "month");
//         break;
//       case "custom":
//         startDate = null;
//         break;
//       default:
//         startDate = null;
//     }
//     return [startDate, endDate];
//   };

//   const handleSelectChange = (value) => {
//     setSelectedFilter(value);

//     if (value !== "custom") {
//       const [start, end] = getDateRange(value);
//       setRange([start, end]);
//       setTempRange([start, end]);
//     } else {
//       setTempRange([]);
//       setRange([]);
//     }
//   };

//   const handleRangeChange = (dates) => {
//     setTempRange(dates);
//   };

//   const applyFilter = () => {
//     if (selectedFilter === "custom") {
//       if (tempRange && tempRange[0] && tempRange[1]) {
//         onDateChange({
//           startDate: tempRange[0].format("YYYY-MM-DD"),
//           endDate: tempRange[1].format("YYYY-MM-DD"),
//         });
//       } else {
//         onDateChange({ startDate: "", endDate: "" });
//       }
//     } else {
//       onDateChange({
//         startDate: range[0].format("YYYY-MM-DD"),
//         endDate: range[1].format("YYYY-MM-DD"),
//       });
//     }
//   };

//   useImperativeHandle(ref, () => ({
//     applyFilter,
//   }));

//   useEffect(() => {
//     const [start, end] = getDateRange(selectedFilter);
//     setRange([start, end]);
//     setTempRange([start, end]);
//   }, []);

//   const options = [
//     { value: "7d", label: "Last 7 Days" },
//     { value: "15d", label: "Last 15 Days" },
//     { value: "1m", label: "Last 1 Month" },
//     { value: "3m", label: "Last 3 Months" },
//     { value: "custom", label: "Custom Range" },
//   ];

//   return (
//     <Space.Compact>
//       <Select
//         value={selectedFilter}
//         style={{ width: 180 }}
//         onChange={handleSelectChange}
//         options={options}
//       />

//       <RangePicker
//         value={selectedFilter === "custom" ? tempRange : range}
//         onChange={selectedFilter === "custom" ? handleRangeChange : undefined}
//         format="YYYY-MM-DD"
//         allowClear={selectedFilter === "custom"}
//         disabled={selectedFilter !== "custom"}
//       />
//     </Space.Compact>
//   );
// });

// export default CustomDateFilter;

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from "react";
import { Select, Space, DatePicker } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const presetOptions = [
  { value: "7d", label: "Last 7 Days" },
  { value: "15d", label: "Last 15 Days" },
  { value: "1m", label: "Last 1 Month" },
  { value: "3m", label: "Last 3 Months" },
  { value: "custom", label: "Custom Range" },
];

const getPresetRange = (key) => {
  const end = dayjs();
  switch (key) {
    case "7d":
      return [end.subtract(6, "day"), end];
    case "15d":
      return [end.subtract(14, "day"), end];
    case "1m":
      return [end.subtract(1, "month"), end];
    case "3m":
      return [end.subtract(3, "month"), end];
    default:
      return [end, end];
  }
};

const CustomDateFilter = forwardRef(({ onDateChange }, ref) => {
  const [selected, setSelected] = useState("1m");
  const [presetRange, setPresetRange] = useState(getPresetRange("1m"));
  const [customRange, setCustomRange] = useState([null, null]);

  useEffect(() => {
    if (selected !== "custom") {
      const range = getPresetRange(selected);
      setPresetRange(range);
      setCustomRange([null, null]);
    }
  }, [selected]);

  const applyFilter = () => {
    let range = null;

    if (selected !== "custom") {
      const [s, e] = presetRange;
      range = {
        startDate: s.format("YYYY-MM-DD"),
        endDate: e.format("YYYY-MM-DD"),
      };
    } else if (customRange[0] && customRange[1]) {
      range = {
        startDate: customRange[0].format("YYYY-MM-DD"),
        endDate: customRange[1].format("YYYY-MM-DD"),
      };
    }
    onDateChange(range);
    return range;
  };

  useImperativeHandle(ref, () => ({
    applyFilter,
  }));

  const onSelectChange = (value) => {
    setSelected(value);
  };

  const onRangeChange = (dates) => {
    setCustomRange(dates || [null, null]);
  };

  const pickerValue = selected === "custom" ? customRange : presetRange;

  return (
    <Space.Compact>
      <Select
        value={selected}
        style={{ width: 180 }}
        onChange={onSelectChange}
        options={presetOptions}
      />
      <RangePicker
        value={pickerValue}
        onChange={selected === "custom" ? onRangeChange : undefined}
        format="YYYY-MM-DD"
        allowClear={selected === "custom"}
        disabled={selected !== "custom"}
        placeholder={["Start", "End"]}
      />
    </Space.Compact>
  );
});

CustomDateFilter.displayName = "CustomDateFilter";

export default CustomDateFilter;
// src/component/commonComponent/CustomDateFilter.jsx
// import React, { useState, useEffect } from "react";
// import { Select, Space, DatePicker } from "antd";
// import dayjs from "dayjs";

// const { RangePicker } = DatePicker;

// const presetOptions = [
//   { value: "7d", label: "Last 7 Days" },
//   { value: "15d", label: "Last 15 Days" },
//   { value: "1m", label: "Last 1 Month" },
//   { value: "3m", label: "Last 3 Months" },
//   { value: "custom", label: "Custom Range" },
// ];

// const getPresetRange = (key) => {
//   const end = dayjs();
//   switch (key) {
//     case "7d":  return [end.subtract(6, "day"), end];
//     case "15d": return [end.subtract(14, "day"), end];
//     case "1m":  return [end.subtract(1, "month"), end];
//     case "3m":  return [end.subtract(3, "month"), end];
//     default:    return [end, end];
//   }
// };

// const CustomDateFilter = ({
//   value,
//   onChange,
//   onApply,
//   defaultPreset = "1m",
// }) => {
//   const [selected, setSelected] = useState(defaultPreset);
//   const [presetRange, setPresetRange] = useState(getPresetRange(defaultPreset));
//   const [customRange, setCustomRange] = useState([null, null]);

//   useEffect(() => {
//     if (value?.startDate && value?.endDate) {
//       const start = dayjs(value.startDate);
//       const end = dayjs(value.endDate);
//       const preset = presetOptions.find(opt => {
//         if (opt.value === "custom") return false;
//         const [s, e] = getPresetRange(opt.value);
//         return s.isSame(start, "day") && e.isSame(end, "day");
//       });
//       if (preset) {
//         setSelected(preset.value);
//         setPresetRange([start, end]);
//         setCustomRange([null, null]);
//       } else {
//         setSelected("custom");
//         setCustomRange([start, end]);
//       }
//     }
//   }, [value]);

//   useEffect(() => {
//     if (selected !== "custom") {
//       const range = getPresetRange(selected);
//       setPresetRange(range);
//       setCustomRange([null, null]);
//       const payload = {
//         startDate: range[0].format("YYYY-MM-DD"),
//         endDate: range[1].format("YYYY-MM-DD"),
//       };
//       onChange?.(payload); 
//     }
//   }, [selected, onChange]);

//   const handleSelect = (val) => setSelected(val);
//   const handleRange = (dates) => setCustomRange(dates || [null, null]);

//   const handleApply = () => {
//     let payload = null;
//     if (selected !== "custom") {
//       const [s, e] = presetRange;
//       payload = { startDate: s.format("YYYY-MM-DD"), endDate: e.format("YYYY-MM-DD") };
//     } else if (customRange[0] && customRange[1]) {
//       payload = {
//         startDate: customRange[0].format("YYYY-MM-DD"),
//         endDate: customRange[1].format("YYYY-MM-DD"),
//       };
//     }
//     onApply?.(payload);
//   };

//   const pickerValue = selected === "custom" ? customRange : presetRange;

//   return (
//     <Space.Compact style={{ width: "100%" }}>
//       <Select
//         value={selected}
//         style={{ width: 160 }}
//         onChange={handleSelect}
//         options={presetOptions}
//       />
//       <RangePicker
//         value={pickerValue}
//         onChange={selected === "custom" ? handleRange : undefined}
//         format="YYYY-MM-DD"
//         allowClear={selected === "custom"}
//         disabled={selected !== "custom"}
//         placeholder={["Start", "End"]}
//         style={{ flex: 1 }}
//       />
//     </Space.Compact>
//   );
// };

// export default CustomDateFilter;