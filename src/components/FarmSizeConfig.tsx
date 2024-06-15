import React, { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Container,
  Typography,
  Grid,
} from "@mui/material";

interface FarmSizeProps {
  name: string;
  theta: number;
  setTheta: React.Dispatch<React.SetStateAction<number>>;
}

const FarmSizeConfig: React.FC<FarmSizeProps> = ({ name, theta, setTheta }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      setTheta(numericValue);
    }
  };
  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Input and Display
      </Typography>
      <TextField
        label="Enter Number"
        variant="outlined"
        fullWidth
        value={theta}
        onChange={handleInputChange}
        margin="normal"
        type="number"
      />
      <Typography variant="h6" component="h2" gutterBottom>
        Displayed Value: {theta}
      </Typography>
    </Container>
  );
};

export default FarmSizeConfig;
