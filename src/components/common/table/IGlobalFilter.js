/* eslint-disable */

import React, { useState } from "react";
import { useAsyncDebounce } from "react-table";
import { TextField, InputLabel } from "@mui/material";
import PropTypes from "prop-types";

function IGlobalFilter({ filter, setFilter }) {
  const [value, setValue] = useState(filter);
  const handleFilter = useAsyncDebounce((value) => {
    setFilter(value || undefined);
  }, 400);

  return (
    <div>
      <TextField
        type="text"
        id="search"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          handleFilter(e.target.value);
        }}
        autoComplete="off"
        variant="outlined"
        size="small"
        placeholder="Search"
      />
    </div>
  );
}

export default IGlobalFilter;
