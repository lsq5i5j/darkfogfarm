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
  latitude: number;
  longitude: number;
  setLatitude: React.Dispatch<React.SetStateAction<number>>;
  setLongitude: React.Dispatch<React.SetStateAction<number>>;
}

function decimalToTime(decimal: number): string {
  const hours = Math.floor(decimal);
  const minutes = Math.floor((decimal - hours) * 60);

  const hoursString = String(hours).padStart(2, "0");
  const minutesString = String(minutes).padStart(2, "0");

  return `${hoursString}° ${minutesString}'`;
}

const FarmPoseConfig: React.FC<FarmSizeProps> = ({
  name,
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}) => {
  //   const [latitudeString, setLatitudeString] = useState<string>("0");
  //   const [longitudeString, setLongitudeString] = useState<string>("0");
  const [latitudeError, setLatitudeError] = useState<boolean>(false);
  const [longitudeError, setLongitudeError] = useState<boolean>(false);

  const handleLatitudeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numericValue = Number(value);
    if (!isNaN(numericValue) && -90 <= numericValue && numericValue <= 90) {
      setLatitude(numericValue);
      setLatitudeError(false);
    } else {
      setLatitudeError(true);
    }
  };

  const handleLongitudeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    const numericValue = Number(value);
    if (!isNaN(numericValue) && -180 <= numericValue && numericValue <= 180) {
      setLongitude(numericValue);
      setLongitudeError(false);
    } else {
      setLongitudeError(true);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item md>
        <TextField
          label={"黑屋基地纬度"}
          variant="outlined"
          fullWidth
          defaultValue={latitude}
          onChange={handleLatitudeChange}
          margin="normal"
          type="number"
          error={latitudeError}
        />
        <Typography variant="body1" component="h2" gutterBottom>
          {`${decimalToTime(Math.abs(latitude))} ${
            latitude >= 0 ? "北" : "南"
          }`}
        </Typography>
      </Grid>
      <Grid item md>
        <TextField
          label={"黑屋基地经度"}
          variant="outlined"
          fullWidth
          defaultValue={longitude}
          onChange={handleLongitudeChange}
          margin="normal"
          type="number"
          error={longitudeError}
        />
        <Typography variant="body2" component="h2" gutterBottom>
          {`${decimalToTime(Math.abs(longitude))} ${
            longitude >= 0 ? "东" : "西"
          }`}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default FarmPoseConfig;
