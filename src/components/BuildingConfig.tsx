import React, { useState } from "react";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Container,
  Box,
  Grid,
  Typography,
  Tooltip,
} from "@mui/material";

interface BuildingConfigProps {
  name: string;
  imageSrc: string;
  onGrid: boolean;
  rotate: boolean;
  setOnGrid: React.Dispatch<React.SetStateAction<boolean>>;
  setRotate: React.Dispatch<React.SetStateAction<boolean>>;
}

const BuildingConfig: React.FC<BuildingConfigProps> = ({
  name,
  imageSrc,
  onGrid,
  rotate,
  setOnGrid,
  setRotate,
}) => {
  const handleOnGridChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOnGrid(event.target.value === "yes");
  };
  const handleRotateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRotate(event.target.value === "yes");
  };
  return (
    <Grid item md={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 80, // Adjust height as needed
          marginBottom: 2,
        }}
      >
        <img
          src={imageSrc}
          alt="Placeholder"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      </Box>
      <FormControl component="fieldset" sx={{ margin: "10px" }}>
        <Tooltip title="选择’是‘表示建筑不会对齐星球格子, 更加美观。">
          <FormLabel component="legend">偏 移</FormLabel>
        </Tooltip>
        <RadioGroup
          sx={{ alignItems: "flex-start" }}
          aria-label="position"
          name="position"
          value={onGrid ? "yes" : "no"}
          onChange={handleOnGridChange}
        >
          <FormControlLabel value="yes" control={<Radio />} label="是" />
          <FormControlLabel value="no" control={<Radio />} label="否" />
        </RadioGroup>
      </FormControl>
      <FormControl component="fieldset" sx={{ margin: "10px" }}>
        <Tooltip title="选择’是‘表示建筑朝向将不会对齐经纬线，而是朝向黑雾基地中心。">
          <FormLabel component="legend">旋 转</FormLabel>
        </Tooltip>
        <RadioGroup
          sx={{ alignItems: "flex-start" }}
          aria-label="position"
          name="position"
          value={rotate ? "yes" : "no"}
          onChange={handleRotateChange}
        >
          <FormControlLabel value="yes" control={<Radio />} label="是" />
          <FormControlLabel value="no" control={<Radio />} label="否" />
        </RadioGroup>
      </FormControl>
    </Grid>
  );
};

export default BuildingConfig;
