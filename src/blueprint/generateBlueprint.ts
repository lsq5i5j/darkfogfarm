import { ALL_AREA_INFO, getAreaAndLocalOffset, AreaInfo } from "./planet";
import {
  BlueprintData,
  BlueprintBuilding,
  BlueprintArea,
  toStr,
} from "./parser";
import * as THREE from "three";
import { error } from "console";
import { itemIconId } from "../data/icons";

interface BuildingInfo {
  itemId: number;
  modelIndex: number;
  itemName: string;
}

interface BuildingConfig {
  onGrid: boolean;
  rotate: boolean;
  num: number;
}

export interface FarmConfig {
  longitude: number;
  latitude: number;
  theta: number; // define farm size in degree (0 - 180)
  turretLaser: BuildingConfig;
  turretSignal: BuildingConfig;
  battleBase: BuildingConfig;
  orbitalSubstation: BuildingConfig;
}

const BUILDING_INFO: { [key: string]: BuildingInfo } = {
  turretLaser: {
    itemId: 3002,
    modelIndex: 373,
    itemName: "高频激光塔",
  },
  orbitalSubstation: {
    itemId: 2212,
    modelIndex: 68,
    itemName: "卫星配电站",
  },
  battleBase: {
    itemId: 3009,
    modelIndex: 453,
    itemName: "战场分析基站",
  },
  turretSignal: {
    itemId: 3007,
    modelIndex: 403,
    itemName: "信标",
  },
  teslaCoil: {
    itemId: 2201,
    modelIndex: 44,
    itemName: "电力感应塔",
  },
};

function mod(a: number, b: number): number {
  return ((a % b) + b) % b;
}

function createRotationMatrix(
  axis: THREE.Vector3,
  angle: number
): THREE.Matrix4 {
  // Normalize the axis vector
  axis.normalize();

  // // Create a quaternion representing the rotation
  // const quaternion = new THREE.Quaternion();
  // quaternion.setFromAxisAngle(axis, angle);

  // Create a rotation matrix from the quaternion
  const rotationMatrix = new THREE.Matrix4();
  rotationMatrix.makeRotationAxis(axis, angle);

  return rotationMatrix;
}

// convert latitude and longitude to cartition coordinate
function latLonToCartesian(
  latitude: number,
  longitude: number,
  radius = 1
): THREE.Vector3 {
  // Convert latitude and longitude from degrees to radians
  const latRad = THREE.MathUtils.degToRad(latitude);
  const lonRad = THREE.MathUtils.degToRad(longitude);

  // Compute Cartesian coordinates
  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.cos(latRad) * Math.sin(lonRad);
  const z = radius * Math.sin(latRad);

  return new THREE.Vector3(x, y, z);
}

// convert xyz coordinate to latitude and longitude
function cartesianToLatLon(
  x: number,
  y: number,
  z: number
): { latitude: number; longitude: number } {
  // Compute the radius
  const r = Math.sqrt(x * x + y * y + z * z);

  // Compute latitude and longitude
  const latitude = Math.asin(z / r);
  const longitude = Math.atan2(y, x);

  // Convert latitude and longitude from radians to degrees
  const latDeg = THREE.MathUtils.radToDeg(latitude);
  const lonDeg = THREE.MathUtils.radToDeg(longitude);

  return { latitude: latDeg, longitude: lonDeg };
}

// generate points with in the circle, ratio is a value between 0-1, used to choose radius of points
function generatePoints(
  n: number,
  degree: number
): { x: number; y: number; z: number; angle: number }[] {
  const points = [];
  const r = Math.sin(THREE.MathUtils.degToRad(degree / 2));
  for (let i = 0; i < n; ++i) {
    const angle = (i * 2 * Math.PI) / n;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    const z = Math.sqrt(1 - r * r);
    points.push({
      x,
      y,
      z,
      angle,
    });
  }
  return points;
}

// generate object locations around the dark fog base
export function generateFarmObjPositions(
  latitude: number,
  longitude: number,
  theta: number,
  objNum: number
): {
  area: AreaInfo;
  localOffsetX: number;
  localOffsetY: number;
  yaw: number;
  name: string | null;
}[] {
  // get xyz coordinates on the dark fog base
  const targetVec = latLonToCartesian(latitude, longitude);

  // generate points around the north pole ([0, 0, 1])
  const points = generatePoints(objNum, theta);

  // find the matrix that rotate the points from the north pole to farm location
  const sourceVec = new THREE.Vector3(0, 0, 1.0);
  const rotateVec = new THREE.Vector3();
  rotateVec.crossVectors(sourceVec, targetVec);
  const angle = sourceVec.angleTo(targetVec);
  const r = createRotationMatrix(rotateVec, angle);
  // console.log(sourceVec, targetVec, sourceVec.angleTo(targetVec))

  // rotate each point of the farm from the north pole to the dark fog base.
  const objPoses: {
    area: AreaInfo;
    localOffsetX: number;
    localOffsetY: number;
    yaw: number;
    name: string | null;
  }[] = [];
  for (const p of points) {
    // rotate each point
    const vector = new THREE.Vector3(p.x, p.y, p.z);
    vector.applyMatrix4(r);
    const pose = cartesianToLatLon(vector.x, vector.y, vector.z);
    const areaPose = getAreaAndLocalOffset(pose.longitude, pose.latitude);

    // compute yaw angle on the object
    // vector that point from the current point to the north pole
    const vecNorth = new THREE.Vector3(
      0 - vector.x,
      0 - vector.y,
      1.0 - vector.z
    );
    // vector that point from the current point to the center of all the points
    const vecCenter = new THREE.Vector3(
      targetVec.x - vector.x,
      targetVec.y - vector.y,
      targetVec.z - vector.z
    );
    // Project these 2 vector to the plane that is orthogonal to the point
    vecNorth.projectOnPlane(vector);
    vecCenter.projectOnPlane(vector);
    const crossProduct = new THREE.Vector3().crossVectors(vecNorth, vecCenter);
    const sign = Math.sign(vector.dot(crossProduct));
    const yaw = sign * THREE.MathUtils.radToDeg(vecNorth.angleTo(vecCenter));
    // console.log(t, getAreaAndLocalOffset(t.longitude, t.latitude), mod(yaw, 360) - 180)

    objPoses.push({
      area: areaPose.area,
      localOffsetX: areaPose.localOffsetX,
      localOffsetY: areaPose.localOffsetY,
      yaw: mod(yaw, 360) - 180,
      name: null,
    });
  }
  return objPoses;
}

function alignObject(
  onGrid: boolean,
  rotate: boolean,
  objPose: {
    area: AreaInfo;
    localOffsetX: number;
    localOffsetY: number;
    yaw: number;
    name: string | null;
  }
) {
  if (onGrid) {
    objPose.localOffsetX = Math.round(objPose.localOffsetX);
    objPose.localOffsetY = Math.round(objPose.localOffsetY);
  }
  if (!rotate) {
    objPose.yaw = Math.round(Math.round(objPose.yaw / 90) * 90);
  }
}

// generate building
function generateBuilding(
  index: number,
  areaIndex: number,
  localOffsetX: number,
  localOffsetY: number,
  yaw: number,
  objName: string | null
): BlueprintBuilding {
  if (objName === null) {
    throw new Error("Need name for the building");
  } else if (!(objName in BUILDING_INFO)) {
    console.log(objName);
    throw new Error("Building name is not in the list");
  }

  const offset = { x: localOffsetX, y: localOffsetY, z: 0 };
  return {
    index,
    areaIndex,
    localOffset: [offset, offset],
    yaw: [yaw, yaw],
    itemId: BUILDING_INFO[objName].itemId,
    modelIndex: BUILDING_INFO[objName].modelIndex,
    outputObjIdx: -1,
    inputObjIdx: -1,
    outputToSlot: 0,
    inputFromSlot: 0,
    outputFromSlot: 0,
    inputToSlot: 0,
    outputOffset: 0,
    inputOffset: 0,
    recipeId: 0,
    filterId: 0,
    parameters: null,
  };
}

// generate dark fog farm blueprint data
export function generateFarmBlueprintData(farm: FarmConfig) {
  // adjust longitude since there is symmetries
  farm.latitude = Math.abs(farm.latitude);
  farm.longitude = mod(farm.longitude + 18, 36) - 18;

  // generate the position of each object according to the position of the dark fog base
  // positions for the turret and signal tower
  const objNum = farm.turretSignal.num + farm.turretLaser.num;
  const attackObjPoses = generateFarmObjPositions(
    farm.latitude,
    farm.longitude,
    farm.theta,
    objNum
  );

  // add names for the objects based on the building type
  const turretSignalGap = Math.round(objNum / farm.turretSignal.num);
  for (let i = 0; i < attackObjPoses.length; i++) {
    if (i % turretSignalGap == turretSignalGap - 1) {
      attackObjPoses[i].name = "turretSignal";
      alignObject(
        farm.turretSignal.onGrid,
        farm.turretSignal.rotate,
        attackObjPoses[i]
      );
    } else {
      attackObjPoses[i].name = "turretLaser";
      alignObject(
        farm.turretLaser.onGrid,
        farm.turretLaser.rotate,
        attackObjPoses[i]
      );
    }
  }

  // positions for the battlefield Analysis base behind the signal towers
  const defenseObjNum = farm.battleBase.num + farm.orbitalSubstation.num;
  const defenseObjPoses = generateFarmObjPositions(
    farm.latitude,
    farm.longitude,
    farm.theta + 7,
    defenseObjNum
  );
  // add names for the objects based on the building type
  const battleBaseGap = Math.round(defenseObjNum / farm.battleBase.num);
  for (let i = 0; i < defenseObjPoses.length; i++) {
    if (i % battleBaseGap == battleBaseGap - 1) {
      defenseObjPoses[i].name = "battleBase";
      alignObject(
        farm.battleBase.onGrid,
        farm.battleBase.rotate,
        defenseObjPoses[i]
      );
    } else {
      defenseObjPoses[i].name = "orbitalSubstation";
      alignObject(
        farm.orbitalSubstation.onGrid,
        farm.orbitalSubstation.rotate,
        defenseObjPoses[i]
      );
    }
  }

  const objPoses = [...attackObjPoses, ...defenseObjPoses];

  // if we choose to generate an object at the center of the base
  if (true) {
    const areaPose = getAreaAndLocalOffset(farm.longitude, farm.latitude);
    objPoses.unshift({
      area: areaPose.area,
      localOffsetX: areaPose.localOffsetX,
      localOffsetY: areaPose.localOffsetY,
      yaw: 0,
      name: "orbitalSubstation",
    });
  }

  // get all area of the base
  const areaList: AreaInfo[] = [];
  for (let objPose of objPoses) {
    const area = objPose.area;
    if (!areaList.includes(area)) {
      areaList.push(area);
    }
  }
  areaList.sort((a, b) => a.index - b.index);

  // find min and max area index of the area list
  const minArea: AreaInfo = areaList.reduce((prev, curr) => {
    return prev.index < curr.index ? prev : curr;
  });
  const maxArea: AreaInfo = areaList.reduce((prev, curr) => {
    return prev.index > curr.index ? prev : curr;
  });

  // add mission areas since there could be area whose parent is not in the list
  const fullAreaList = ALL_AREA_INFO.filter(
    (x) => minArea.index <= x.index && x.index <= maxArea.index
  );
  fullAreaList.sort((a, b) => b.index - a.index);
  console.log(fullAreaList);

  // build Area
  const fullAreaListLength: number = fullAreaList.length;
  const blueprintAreas: BlueprintArea[] = [];
  for (let i = 0; i < fullAreaListLength; i++) {
    const area = fullAreaList[i];
    const parentArea = area.parentArea;
    const parentAreaIndex =
      parentArea !== null && fullAreaList.includes(parentArea)
        ? fullAreaList.indexOf(parentArea)
        : -1;
    const blueprintArea = {
      index: i,
      parentIndex: parentAreaIndex,
      tropicAnchor: 0,
      areaSegments: area.segment,
      anchorLocalOffset: {
        x: 0,
        y: -area.latitudeSegment,
      },
      size: {
        x: 0,
        y: area.latitudeSegment,
      },
    };
    blueprintAreas.push(blueprintArea);
  }
  // find the area without the parent
  const noParentAreas = blueprintAreas.filter((x) => x.parentIndex === -1);
  if (noParentAreas.length !== 1) {
    throw new Error(
      "There should be one and only one area without the parent."
    );
  }
  const primaryAreaIdx = noParentAreas[0].index;

  // generate blue print building
  const blueprintBuildings: BlueprintBuilding[] = [];
  for (let i = 0; i < objPoses.length; i++) {
    // building value for turret
    const objPose = objPoses[i];
    blueprintBuildings.push(
      generateBuilding(
        i,
        fullAreaList.indexOf(objPose.area),
        objPose.localOffsetX,
        objPose.localOffsetY,
        Math.round(objPose.yaw),
        objPose.name
      )
    );
  }

  // generate the entire blueprint
  const bluePrint: BlueprintData = {
    header: {
      layout: 21,
      icons: [5206, 512, 0, 0, 0],
      time: new Date(),
      gameVersion: "0.10.30.22292",
      shortDesc: "Dark Fog Farm",
      desc: "Dark Fog Farm",
    },
    version: 1,
    cursorOffset: { x: 0, y: 0 },
    cursorTargetArea: primaryAreaIdx,
    dragBoxSize: { x: 100, y: 100 },
    primaryAreaIdx: primaryAreaIdx,
    areas: blueprintAreas,
    buildings: blueprintBuildings,
  };

  return toStr(bluePrint);
}

// const a = generateFarmBlueprintData(0, 0, 40, 6, 24, 12, 12, false);
// console.log(a);
