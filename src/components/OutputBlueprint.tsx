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
  Button,
  Box,
} from "@mui/material";
import {
  FarmConfig,
  generateFarmBlueprintData,
} from "../blueprint/generateBlueprint";

interface ReactFarmConfig {
  farmConfig: FarmConfig;
}

function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
    });
}

function downloadTextAsFile(text: string, filename: string) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

const OutputBluePrint: React.FC<ReactFarmConfig> = ({ farmConfig }) => {
  const [bpData, setBpData] = useState<string>("");
  const handleGenerate = () => {
    const data = generateFarmBlueprintData(farmConfig);
    setBpData(data);
  };

  return (
    <Container maxWidth="md">
      {/* <Typography variant="h4" component="h1" gutterBottom>
        Button Grid and Text Frame
      </Typography> */}

      <Box sx={{ marginBottom: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleGenerate}
            >
              生成蓝图
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              disabled={bpData === ""}
              onClick={() => copyToClipboard(bpData)}
            >
              复制到剪贴板
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              disabled={bpData === ""}
              onClick={() => downloadTextAsFile(bpData, "DarkFogFarm")}
            >
              下载
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <TextField
          label="Enter Text"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          value={bpData}
          // sx={{
          //   "& .MuiInputBase-root": {
          //     height: "50vh", // You can set the height you want here
          //   },
          // }}

          //   onChange={handleTextChange}
        />
      </Box>
    </Container>
  );
};

export default OutputBluePrint;
