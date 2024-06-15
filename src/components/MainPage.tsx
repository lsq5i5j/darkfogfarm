import React, { useState } from "react";
import { Container, Box, Typography, Grid } from "@mui/material";
import BuildingConfig from "./BuildingConfig";
import FarmSizeConfig from "./FarmSizeConfig";
import FarmPoseConfig from "./FarmPoseConfig";
import OutputBluePrint from "./OutputBlueprint";
import FarmSelectSizeConfig from "./FarmSelectSizeConfig";

interface FarmPresetConfig {
  theta: number;
  turretLaserNum: number;
  turretSignalNum: number;
  battleBaseNum: number;
  orbitalSubstationNum: number;
}

const FARM_PREDEFINE_CONFIG: { [key: string]: FarmPresetConfig } = {
  s: {
    theta: 31,
    turretLaserNum: 30,
    turretSignalNum: 6,
    battleBaseNum: 16,
    orbitalSubstationNum: 16,
  }, // 保留3个强袭者营地
  m: {
    theta: 35,
    turretLaserNum: 36,
    turretSignalNum: 6,
    battleBaseNum: 16,
    orbitalSubstationNum: 16,
  }, // 保留6个强袭者营地
  l: {
    theta: 38,
    turretLaserNum: 42,
    turretSignalNum: 6,
    battleBaseNum: 16,
    orbitalSubstationNum: 16,
  }, // 保留除激光塔之外全部建筑
  xl: {
    theta: 42,
    turretLaserNum: 48,
    turretSignalNum: 6,
    battleBaseNum: 16,
    orbitalSubstationNum: 16,
  }, // 保留除激光塔之外全部建筑
};

const MainPage: React.FC = () => {
  const [farmSize, setFarmSize] = useState<string>("xl");
  const [longitude, setLongitude] = useState<number>(0);
  const [latitude, setLatitude] = useState<number>(0);

  const [turretLaserOnGrid, setTurretLaserOnGrid] = useState<boolean>(false);
  const [turretSignalOnGrid, setTurretSignalOnGrid] = useState<boolean>(false);
  const [battleBaseOnGrid, setBattleBaseOnGrid] = useState<boolean>(false);
  const [orbitalSubstationOnGrid, setOrbitalSubstationOnGrid] =
    useState<boolean>(false);
  const [turretLaserRotate, setTurretLaserRotate] = useState<boolean>(true);
  const [turretSignalRotate, setTurretSignalRotate] = useState<boolean>(true);
  const [battleBaseRotate, setBattleBaseRotate] = useState<boolean>(false);
  const [orbitalSubstationRotate, setOrbitalSubstationRotate] =
    useState<boolean>(false);
  const [theta, setTheta] = useState<number>(40);

  // TODO define building number based on the farm size
  // const turretLaserNum = 30;
  // const turretSignalNum = 6;
  // const battleBaseNum = 16;
  // const orbitalSubstationNum = 16;

  return (
    <Container maxWidth="md">
      <Box
        mt={5}
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={4}
      >
        <Typography variant="h4">黑雾农场生成器</Typography>
        <FarmPoseConfig
          name="sad"
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
        />
        <Grid container spacing={2}>
          <BuildingConfig
            name="asd"
            imageSrc={`${process.env.PUBLIC_URL}/imgs/turretLaser.png`}
            onGrid={turretLaserOnGrid}
            rotate={turretLaserRotate}
            setOnGrid={setTurretLaserOnGrid}
            setRotate={setTurretLaserRotate}
          />
          <BuildingConfig
            name="asd"
            imageSrc={`${process.env.PUBLIC_URL}/imgs/turretSignal.png`}
            onGrid={turretSignalOnGrid}
            rotate={turretSignalRotate}
            setOnGrid={setTurretSignalOnGrid}
            setRotate={setTurretSignalRotate}
          />
          <BuildingConfig
            name="asd"
            imageSrc={`${process.env.PUBLIC_URL}/imgs/battleBase.png`}
            onGrid={battleBaseOnGrid}
            rotate={battleBaseRotate}
            setOnGrid={setBattleBaseOnGrid}
            setRotate={setBattleBaseRotate}
          />
          <BuildingConfig
            name="asd"
            imageSrc={`${process.env.PUBLIC_URL}/imgs/orbitalSubstation.png`}
            onGrid={orbitalSubstationOnGrid}
            rotate={orbitalSubstationRotate}
            setOnGrid={setOrbitalSubstationOnGrid}
            setRotate={setOrbitalSubstationRotate}
          />
        </Grid>
        {/* <FarmSizeConfig name="大小" theta={theta} setTheta={setTheta} /> */}

        <FarmSelectSizeConfig
          name="大小"
          size={farmSize}
          setSize={setFarmSize}
        />
        <OutputBluePrint
          farmConfig={{
            longitude,
            latitude,
            theta: FARM_PREDEFINE_CONFIG[farmSize].theta,
            turretLaser: {
              num: FARM_PREDEFINE_CONFIG[farmSize].turretLaserNum,
              onGrid: turretLaserOnGrid,
              rotate: turretLaserRotate,
            },
            turretSignal: {
              num: FARM_PREDEFINE_CONFIG[farmSize].turretSignalNum,
              onGrid: turretSignalOnGrid,
              rotate: turretSignalRotate,
            },
            battleBase: {
              num: FARM_PREDEFINE_CONFIG[farmSize].battleBaseNum,
              onGrid: battleBaseOnGrid,
              rotate: battleBaseRotate,
            },
            orbitalSubstation: {
              num: FARM_PREDEFINE_CONFIG[farmSize].orbitalSubstationNum,
              onGrid: orbitalSubstationOnGrid,
              rotate: orbitalSubstationRotate,
            },
          }}
        />
      </Box>
    </Container>
  );
};

export default MainPage;
