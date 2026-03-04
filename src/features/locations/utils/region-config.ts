import { FeatureCollection } from 'geojson';
import centralData from '../utils/central.json';
import eastData from '../utils/east.json';
import northData from '../utils/north.json';
import southData from '../utils/south.json';
import westData from '../utils/west.json';

export const regionConfig = [
  {
    key: 'central',
    data: centralData as FeatureCollection,
    style: { color: '#87A922' },
    active: (regions: Record<string, boolean>) => regions.central,
  },
  {
    key: 'south',
    data: southData as FeatureCollection,
    style: { color: '#AE00FF' },
    active: (regions: Record<string, boolean>) => regions.south,
  },
  {
    key: 'north',
    data: northData as FeatureCollection,
    style: { color: '#0066FF' },
    active: (regions: Record<string, boolean>) => regions.north,
  },
  {
    key: 'west',
    data: westData as FeatureCollection,
    style: { color: '#FBC740' },
    active: (regions: Record<string, boolean>) => regions.west,
  },
  {
    key: 'east',
    data: eastData as FeatureCollection,
    style: { color: '#00CCA6' },
    active: (regions: Record<string, boolean>) => regions.east,
  },
];