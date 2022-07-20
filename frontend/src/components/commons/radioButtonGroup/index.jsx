import React, { useState } from "react";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

const RadioButtonsGroup = () =>{

    const [value, setValue] = useState();
  
    const handleChange = (e) => {
      setValue(e.target.value);
      console.log(value);
    };
  
    return (   
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={value}
          onChange={(e) => handleChange(e)}
        >
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
        </RadioGroup>
    );
  }
  
export default RadioButtonsGroup;
