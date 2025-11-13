import type { Rider } from '../types';

export const RIDERS: Rider[] = [
  {
    id: 'mile-high',
    name: 'Team Mile High',
    team: 'Mile High',
    colors: {
      primary: '#0066FF', // blue
      secondary: '#FFD700', // yellow
      tertiary: '#FF0000', // red
    },
    jerseyDesign: '5280',
  },
  {
    id: 'dacono',
    name: 'Team Dacono',
    team: 'Dacono',
    colors: {
      primary: '#FF0000', // red
      secondary: '#FFFFFF', // white
    },
    jerseyDesign: 'oil-derrick',
  },
  {
    id: 'county-line',
    name: 'Team County Line',
    team: 'County Line',
    colors: {
      primary: '#0066FF', // blue
      secondary: '#FFFFFF', // white
    },
    jerseyDesign: 'mountain',
  },
  {
    id: 'twin-silo',
    name: 'Team Twin Silo',
    team: 'Twin Silo',
    colors: {
      primary: '#800080', // purple
      secondary: '#FFFFFF', // white
    },
    jerseyDesign: 'silos',
  },
];

