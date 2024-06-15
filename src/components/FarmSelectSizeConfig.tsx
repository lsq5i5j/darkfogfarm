import React, { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Container,
  Typography,
  Grid,
} from "@mui/material";

interface FarmSizeProps {
  name: string;
  size: string;
  setSize: React.Dispatch<React.SetStateAction<string>>;
}

const FarmSelectSizeConfig: React.FC<FarmSizeProps> = ({
  name,
  size,
  setSize,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSize(value);
  };
  return (
    <Container maxWidth="md">
      <FormControl component="fieldset" sx={{ margin: "10px" }}>
        <FormLabel component="legend">农场规模</FormLabel>
        <RadioGroup
          sx={{ alignItems: "flex-start" }}
          aria-label="position"
          name="position"
          value={size}
          //   row
          onChange={handleInputChange}
        >
          <FormControlLabel
            value="s"
            control={<Radio />}
            label="小型农场，仅保留3个强袭者营地"
          />
          <FormControlLabel
            value="m"
            control={<Radio />}
            label="中型农场，保留6个强袭者营地"
          />
          <FormControlLabel
            value="l"
            control={<Radio />}
            label="大形农场，保留6个强袭者营地，6个守卫者营地, 6个游骑兵营地"
          />
          <FormControlLabel
            value="xl"
            control={<Radio />}
            label="超大形农场，保留全部6个强袭者营地，6个守卫者营地, 9个游骑兵营地"
          />
        </RadioGroup>
      </FormControl>
    </Container>
  );
};

export default FarmSelectSizeConfig;
