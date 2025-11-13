import type { Track } from '../types';

export const TRACKS: Track[] = [
  {
    id: 'mile-high',
    name: 'Mile High BMX',
    terrain: 'mountainous',
    trackColor: '#808080', // gray
    turnColor: '#404040', // dark gray (asphalt)
    description: 'Denver Cup - Race at your home track!',
    order: 1,
  },
  {
    id: 'isabella-state',
    name: 'Isabella State',
    terrain: 'mountainous',
    trackColor: '#8B4513', // brown dirt
    turnColor: '#654321', // darker brown
    description: 'State Championship - Race against Isabella!',
    order: 2,
  },
  {
    id: 'dacono-national',
    name: 'Dacono National',
    terrain: 'grassy-plains',
    trackColor: '#8B4513', // brown dirt
    turnColor: '#654321', // darker brown
    description: 'National Championship - Show your skills!',
    order: 3,
  },
  {
    id: 'county-line',
    name: 'County Line',
    terrain: 'suburban',
    trackColor: '#8B4513', // brown dirt
    turnColor: '#654321', // darker brown
    description: 'Regional Qualifier - Suburban challenge!',
    order: 4,
  },
  {
    id: 'grands',
    name: 'Grand Nationals',
    terrain: 'stadium',
    trackColor: '#8B4513', // brown dirt
    turnColor: '#654321', // darker brown
    description: 'The Grand Nationals - The ultimate race!',
    order: 5,
  },
  {
    id: 'space',
    name: 'Space Race',
    terrain: 'space',
    trackColor: '#FF00FF', // magenta (rainbow road style)
    turnColor: '#00FFFF', // cyan
    description: 'Race in space against alien BMX riders!',
    order: 6,
  },
];

export const getTrackById = (id: string): Track | undefined => {
  return TRACKS.find(track => track.id === id);
};

export const getNextTrack = (currentTrack: Track | null): Track | null => {
  if (!currentTrack) return TRACKS[0];
  const currentIndex = TRACKS.findIndex(t => t.id === currentTrack.id);
  if (currentIndex === -1 || currentIndex === TRACKS.length - 1) return null;
  return TRACKS[currentIndex + 1];
};

