// import { Euler, Matrix4 } from "three";
// import { BlueprintArea, BlueprintBuilding } from "./parser";
// import { NONAME } from "dns";
// import { isTemplateLiteralToken } from "typescript";

export interface AreaInfo {
  name: string;
  parentArea: AreaInfo | null;
  childArea: AreaInfo | null;
  segment: number;
  longitudeSegment: number;
  latitudeSegment: number;
  startLatitude: number;
  endLatitude: number;
  index: number;
}

const latitudeSplitters: number[] = [
  28.8, 46.8, 55.8, 64.8, 70.2, 75.6, 79.2, 82.8, 84.6, 86.4, 88.2, 90,
];

// how many grid do each segment contains along longitude
const longitudeSegmentNum: number[] = [
  200, 160, 120, 100, 80, 60, 40, 32, 20, 16, 8, 4,
];

// how many grid do each segment contains along latitude
const latitudeSegmentNum: number[] = [
  160, 50, 25, 25, 15, 15, 10, 10, 5, 5, 5, 5,
];

// construct an array that include all segments on the planet.
function buildAllAreaInfo(): AreaInfo[] {
  // add center of the planet
  const temp: AreaInfo[] = [
    {
      name: "center",
      parentArea: null,
      childArea: null,
      segment: longitudeSegmentNum[0],
      longitudeSegment: longitudeSegmentNum[0] * 5,
      latitudeSegment: latitudeSegmentNum[0],
      startLatitude: -latitudeSplitters[0],
      endLatitude: latitudeSplitters[0],
      index: NaN,
    },
  ];

  const length = latitudeSplitters.length;
  for (let i = 1; i < length; i++) {
    // add the segment before the first item in the array
    const prevArea: AreaInfo = {
      name: "south" + i,
      parentArea: temp[0],
      childArea: null,
      segment: longitudeSegmentNum[i],
      longitudeSegment: longitudeSegmentNum[i] * 5,
      latitudeSegment: latitudeSegmentNum[i],
      startLatitude: -latitudeSplitters[i],
      endLatitude: temp[0].startLatitude,
      index: NaN,
    };
    temp[0].childArea = prevArea;
    temp.unshift(prevArea);

    // add the segment after the last item in the arrat
    const nextArea: AreaInfo = {
      name: "north" + i,
      parentArea: temp[temp.length - 1],
      childArea: null,
      segment: longitudeSegmentNum[i],
      longitudeSegment: longitudeSegmentNum[i] * 5,
      latitudeSegment: latitudeSegmentNum[i],
      startLatitude: temp[temp.length - 1].endLatitude,
      endLatitude: latitudeSplitters[i],
      index: NaN,
    };
    temp[temp.length - 1].childArea = nextArea;

    temp.push(nextArea);
  }

  // add index for each segment
  for (let i = 0; i < temp.length; i++) {
    temp[i].index = i;
  }

  return temp;
}

// the list that contains all
export const ALL_AREA_INFO: AreaInfo[] = buildAllAreaInfo();

// get object area and local offset based on its longitude and latitude
export function getAreaAndLocalOffset(longitude: number, latitude: number) {
  const length = ALL_AREA_INFO.length;
  for (let i = 0; i < length; ++i) {
    const area = ALL_AREA_INFO[i];
    if (area.startLatitude <= latitude && latitude < area.endLatitude) {
      // object belong to this area according to the latitude value
      const longitudeGridSize = 360 / area.longitudeSegment;
      const latitudeGridSize =
        (area.endLatitude - area.startLatitude) / area.latitudeSegment;
      // X is the shift along Longitude
      const localOffsetX = longitude / longitudeGridSize;
      const localOffsetY = (area.endLatitude - latitude) / latitudeGridSize;
      return {
        area,
        localOffsetX,
        localOffsetY,
      };
    }
  }
  throw new Error("Can not find area ot its offset");
}
