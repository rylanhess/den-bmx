'use client';

import Link from "next/link";
import Image from "next/image";
import {
  MapPinIcon,
  LinkIcon,
  StarIcon,
  BoltIcon,
} from '@heroicons/react/24/solid';
import Footer from '@/components/Footer';
import ParkFinderMap from '@/components/ParkFinderMap';

export interface Park {
  name: string;
  location: string;
  type: 'Bike Park' | 'Skate Park' | 'Pump Track' | 'BMX Track' | 'Indoor Park';
  googleMapsUrl: string;
  size: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  sizeRating: number; // 1-5
  quality: 'Basic' | 'Good' | 'Excellent' | 'World Class';
  qualityRating: number; // 1-5
  skillLevels: string[];
  description: string;
  toddlerApproved?: boolean;
  coordinates: [number, number]; // [lat, lng] for map
}

const parks: Park[] = [
  {
    name: 'Valmont Bike Park',
    location: 'Boulder, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Valmont+Bike+Park+Boulder+Colorado',
    size: 'Extra Large',
    sizeRating: 5,
    quality: 'World Class',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    description: 'World-class 42-acre facility with over 30 jumps, cyclocross courses, and diverse terrain features. One of the premier bike parks in the region with professional-grade features.',
    coordinates: [40.03160823798708, -105.23424042526366], // [lat, lng]
  },
  {
    name: 'Ruby Hill Bike Park',
    location: 'Denver, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ruby+Hill+Bike+Park+Denver+Colorado',
    size: 'Large',
    sizeRating: 4,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    description: '7.5-acre park featuring slopestyle courses, dirt jumps, pump tracks, and skills courses. Includes expert lines for professional riders and beginner-friendly areas.',
    toddlerApproved: true,
    coordinates: [39.683854540367726, -105.00535349867998], // [lat, lng]
  },
  {
    name: 'Barnum Bike Park',
    location: 'Denver, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Barnum+Bike+Park+Denver+Colorado',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Urban bike park with multiple slope lines for different skill levels and a pump track. Well-maintained with diverse features in a convenient city location.',
    coordinates: [39.726146473685674, -105.02946638153433], // [lat, lng]
  },
  {
    name: 'Golden Bike Park',
    location: 'Golden, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Golden+Bike+Park+Colorado',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Excellent',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Features a downhill flow trail with widened jumps and rollable options. Trails split into separate beginner, intermediate, and advanced sections with creative design.',
    coordinates: [39.78076926473103, -105.18797966659338], // [lat, lng]
  },
  {
    name: 'McKay Lake Bike Park',
    location: 'Broomfield, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=McKay+Lake+Bike+Park+Broomfield+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Well-designed paved pump track perfect for skill development. Great for practicing pumping technique and building confidence.',
    toddlerApproved: true,
    coordinates: [39.951894491114956, -105.01612951808588], // [lat, lng]
  },
  {
    name: 'Ulysses Skate Park',
    location: 'Golden, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ulysses+Skate+Park+Golden+Colorado',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Well-maintained skate park with a variety of features catering to different skill levels. Suitable for BMX riders looking to practice tricks and jumps.',
    coordinates: [39.73681324947393, -105.19595282242263], // [lat, lng] Ulysses Park, Golden
  },
  {
    name: 'Wheat Ridge Skate Park',
    location: 'Wheat Ridge, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wheat+Ridge+Skate+Park+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Basic',
    qualityRating: 2,
    skillLevels: ['Beginner'],
    description: 'Neighborhood skate park with basic features. Good for beginners learning the fundamentals of park riding.',
    coordinates: [39.76798838350004, -105.10916988153407], // [lat, lng]
  },
  {
    name: 'Anthem Pump Track',
    location: 'Broomfield, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Anthem+Pump+Track+Broomfield+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Paved pump track designed for skill development. Great for practicing pumping technique and building bike handling skills.',
    coordinates: [39.982258508505566, -105.02395022092766], // [lat, lng] Anthem neighborhood, Broomfield
  },
  {
    name: 'Revolution Pump Track',
    location: 'Superior, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Revolution+Pump+Track+Superior+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Paved pump track providing a smooth surface for practicing pumping technique. Ideal for riders looking to improve their skills.',
    coordinates: [40.0409153760191, -105.05081357733108], // [lat, lng]
  },
  {
    name: 'Apple Meadows Bike Park',
    location: 'Golden, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://maps.app.goo.gl/SbwtWAvDtGp2GFY5A',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Community bike park in Golden featuring trails and bike features. Great for practicing skills and enjoying outdoor riding.',
    toddlerApproved: true,
    coordinates: [39.806185, -105.2144612], // [lat, lng]
  },
  {
    name: 'Mile High BMX',
    location: 'Denver, CO',
    type: 'BMX Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mile+High+BMX+Denver+Colorado',
    size: 'Large',
    sizeRating: 5,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    description: 'Home to the longest BMX track in the nation, offering riders an extended racing experience with challenging features. High-elevation racing (5,280+ feet) with technical layout and competitive racing environment.',
    coordinates: [39.65242677248604, -105.1008732491447], // [lat, lng] - approximate Denver area
  },
  {
    name: 'Dacono BMX',
    location: 'Dacono, CO',
    type: 'BMX Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Dacono+BMX+Colorado',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Welcoming environment for BMX racing enthusiasts in the northern Denver metro area. Community-focused atmosphere that encourages new riders to join the sport with regular race schedule throughout the season.',
    coordinates: [40.080700313397536, -104.93410276336377], // [lat, lng] - approximate Dacono area
  },
  {
    name: 'County Line BMX',
    location: 'Englewood, CO',
    type: 'BMX Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=County+Line+BMX+Englewood+Colorado',
    size: 'Medium',
    sizeRating: 4,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    description: 'Located in David A. Lorenz Regional Park, one of the only tracks in south metro Denver. Modern track design with 3 paved turns and paved start hill. Gate practice available on Thursdays during season.',
    coordinates: [39.56430805076575, -104.93776458185582], // [lat, lng]
  },
  {
    name: 'Twin Silo BMX',
    location: 'Fort Collins, CO',
    type: 'BMX Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Twin+Silo+BMX+Fort+Collins+Colorado',
    size: 'Large',
    sizeRating: 4,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
    description: 'Located in Twin Silo Park, a 54-acre modern park facility in Fort Collins. Part of the City of Fort Collins park system with excellent maintenance. Track is open to the public when not in use for racing or practices.',
    coordinates: [40.511200198946774, -105.01271478454838], // [lat, lng] - approximate Fort Collins area
  },
  {
    name: 'Golden Heights Skate Park',
    location: 'Golden, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/DG52AkL7cv63MmC88',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Skate park in Golden with various features for BMX riders and skaters. Good for practicing tricks and improving skills.',
    coordinates: [39.72130829578785, -105.18446614850718], // [lat, lng]
  },
  {
    name: 'Lakewood Skate Park',
    location: 'Lakewood, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/oSheCiAhjeaPD1Hi9',
    size: 'Small',
    sizeRating: 1,
    quality: 'Basic',
    qualityRating: 2,
    skillLevels: ['Beginner'],
    description: 'Small neighborhood skate park. Perfect for beginners learning the basics of park riding.',
    toddlerApproved: true,
    coordinates: [39.70623063034705, -105.13956498955588], // [lat, lng] - approximate Lakewood area
  },
  {
    name: 'Lakewood Link Skate Park',
    location: 'Lakewood, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/E94xRYEehwRcmTJ66',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Small to medium-sized skate park with good features for skill development. Suitable for beginners and intermediate riders.',
    coordinates: [39.694782940303476, -105.07540636598253], // [lat, lng] Lakewood Link area
  },
  {
    name: 'Bates-Logan Park',
    location: 'Denver, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Logan+Bates+Park+Denver+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner'],
    description: 'Neighborhood park near Logan St & Bates Ave with smooth paths and gentle grades that are perfect for balance bikes and first pedal strokes.',
    toddlerApproved: true,
    coordinates: [39.66391634233429, -104.98140786482803], // [lat, lng] approximate
  },
  {
    name: "Sloan's Lake Pump Track",
    location: 'Denver, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sloans+Lake+Pump+Track+Denver+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate'],
    description: "Compact pump track near Sloans Lake with mellow rollers and low berms, ideal for toddler balance bikes and early riders.",
    toddlerApproved: true,
    coordinates: [39.74484832646096, -105.04445994619498], // [lat, lng] approximate Sloan's Lake area
  },
  {
    name: 'Denver Skatepark',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Denver+Skatepark+Denver+Colorado',
    size: 'Large',
    sizeRating: 5,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Intermediate', 'Advanced', 'Expert'],
    description: 'Iconic 2.5-acre downtown skatepark just north of Elitch Gardens, with massive bowls, street plazas, and flow lines. Best for confident riders and advanced park skills.',
    coordinates: [39.759771950253565, -105.0028542545725], // [lat, lng] approximate
  },
  {
    name: 'La Alma Lincoln Park Skate Area',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=La+Alma+Lincoln+Park+Skate+Park+Denver+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Neighborhood skate area in La Alma Lincoln Park with smaller features and open flat space. Good warm-up spot close to downtown.',
    coordinates: [39.734695558116854, -105.00432800920038], // [lat, lng] approximate
  },
  {
    name: 'Elyria Skatepark',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Elyria+Skatepark+Denver+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Compact 3,500 sq ft metal-ramp park in Elyria with mellow transitions and slower features. Friendly spot to get comfortable riding park.',
    coordinates: [39.816313280859376, -104.95460165012099], // [lat, lng] approximate
  },
  {
    name: 'Wheel Park',
    location: 'Aurora, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/w9jT8gKDCDkmySc4A',
    size: 'Large',
    sizeRating: 4,
    quality: 'Excellent',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Nearly 20,000 sq ft well-lit concrete park at Wheel Park in Aurora with street course and 10-foot bowl. Good coverage for east-metro riders.',
    coordinates: [39.67210999050533, -104.80825333931942], // [lat, lng] approximate
  },
  {
    name: 'Green Valley Ranch Skatepark',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Green+Valley+Ranch+Skatepark+Denver+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: '2,000 sq ft neighborhood concrete park in Green Valley Ranch with mini-ramp, small bowl, and simple street features.',
    coordinates: [39.788739028365654, -104.76645225171562], // [lat, lng] approximate
  },
  {
    name: 'Central Park Skatepark',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Central+Park+Skatepark+Denver+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Small beginner-friendly bowl and a few street-style obstacles in Central Park (Stapleton) serving north-east Denver.',
    coordinates: [39.75450423758318, -104.88666908659067], // [lat, lng] approximate
  },
  {
    name: 'Montbello Skatepark',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/b6wbrqvtvwbFewhy8',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Skate area in Parkfield Lake Park providing additional east Denver coverage with basic ramps and rails.',
    coordinates: [39.79650095332542, -104.8058623565479], // [lat, lng] approximate
  },
  {
    name: 'Cornerstone Skate Park',
    location: 'Littleton, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cornerstone+Skate+Park+Littleton+Colorado',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Full concrete skatepark and inline hockey rink at Cornerstone Park in Littleton, with bowls and street features serving south-metro riders.',
    coordinates: [39.621804271186505, -105.00091983094093], // [lat, lng] approximate Belleview & Windermere
  },
  {
    name: 'Redstone Skate Park',
    location: 'Highlands Ranch, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Redstone+Skate+Park+Highlands+Ranch+Colorado',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Outdoor concrete park in Redstone Park with bowl and street elements, primary skatepark serving Highlands Ranch and surrounding suburbs.',
    coordinates: [39.54763797704579, -105.02818950000326], // [lat, lng] approximate Redstone Park Cir
  },
  {
    name: 'SNÖBAHN Action Sports Center',
    location: 'Thornton, CO',
    type: 'Indoor Park',
    googleMapsUrl: 'https://maps.app.goo.gl/z5W86KkBxNpwBkG37',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Indoor action sports center with year-round skiing, snowboarding, bike and skate features, and trampolines. Great bad-weather option for progression sessions.',
    coordinates: [39.95378885637944, -104.98423755886438], // [lat, lng] approximate for 14200 Lincoln St, Thornton
  },
  {
    name: 'High Plains Pump Track',
    location: 'Aurora, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://share.google/zhMfqXYHBCfP8BvHS',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Neighborhood pump track at High Plains Park with mellow rollers and low berms, giving southeast Aurora riders a local place to lap.',
    coordinates: [39.8008005182916, -104.87252688250375], // [lat, lng] approximate
  },
  {
    name: 'Montbello Central Pump Track',
    location: 'Denver, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://share.google/DWLXg2UuK0XdUmfpe',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Compact pump track at Montbello Central Park, adding a freestyle option on Denver’s far northeast side.',
    coordinates: [39.7859465565771, -104.82921009795255], // [lat, lng] approximate
  },
  {
    name: 'Via Varra Pump Track',
    location: 'Broomfield, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://share.google/qXU7sWUAcxGOjMclI',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Paved neighborhood pump track off Via Varra in Broomfield, serving riders along US‑36 between Denver and Boulder.',
    coordinates: [39.94701598990804, -105.12420417114396], // [lat, lng] approximate
  },
  {
    name: 'Superior Bike Park',
    location: 'Superior, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://share.google/D60nqEg5vXollwumI',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Dirt jump and skills park in Superior with progressive lines and small pump features, filling a freestyle gap between Denver and Boulder.',
    coordinates: [39.935917410569544, -105.14403175572266], // [lat, lng] approximate
  },
  {
    name: 'Mountain Shadows Bike Park & Pump Track',
    location: 'Colorado Springs, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://share.google/obWMcirUzc41Wq2N4',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Neighborhood bike park and pump track in the Mountain Shadows area of Colorado Springs, with views of the Front Range and a mix of rollers and jumps.',
    coordinates: [40.16459178036965, -104.94948138658627], // [lat, lng] approximate
  },
  {
    name: 'Sugar Beet Bike Park',
    location: 'Brighton, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://share.google/2an5TskOtJcw92Yc2',
    size: 'Small',
    sizeRating: 2,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Modern neighborhood bike park in Sugar Beet Park, with jump lines and a small pump track that complement the larger Fort Collins bike parks.',
    coordinates: [39.97078718100292, -104.76466581551468], // [lat, lng] approximate
  },
  {
    name: 'Don Anema Memorial Skatepark',
    location: 'Brighton, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://share.google/tVU3xVTSN3FuV5Sum',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Outdoor concrete skatepark honoring Don Anema, with bowls and street features serving riders in the Brighton area.',
    coordinates: [39.90822973230898, -104.9837432442758], // [lat, lng] approximate
  },
  {
    name: 'Thomas J. Slocum Memorial Skatepark',
    location: 'Thornton, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://share.google/4Jv40KYu1yjx1xj43',
    size: 'Large',
    sizeRating: 4,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: '22,000 sq ft Team Pain–built park in Thornton with peanut bowl, street course, and modern features, completely rebuilt in a recent renovation.',
    coordinates: [39.867728798765356, -104.95813305769727], // [lat, lng] approximate 2211 Eppinger Blvd
  },
  {
    name: 'Blue Skies Neighborhood Park',
    location: 'Longmont, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Blue+Skies+Neighborhood+Park+Longmont+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Intermediate', 'Advanced'],
    description: '11-acre park featuring a skate area themed around the history of flight. Suitable for intermediate to advanced riders with various features.',
    coordinates: [40.14237202342511, -105.1724236980156], // [lat, lng] 1520 Mountain Drive
  },
  {
    name: 'Quail Campus Community Park',
    location: 'Longmont, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Quail+Campus+Community+Park+Longmont+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Skate park at Quail Campus Community Park designed for beginner to intermediate riders. Note: Currently closed for scheduled maintenance.',
    coordinates: [40.14586372689992, -105.10001027730533], // [lat, lng] 310 Quail Road
  },
  {
    name: 'Rough and Ready Neighborhood Park',
    location: 'Longmont, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rough+and+Ready+Neighborhood+Park+Longmont+Colorado',
    size: 'Small',
    sizeRating: 1,
    quality: 'Basic',
    qualityRating: 2,
    skillLevels: ['Beginner'],
    description: 'Small skate park with basic rail features designed for beginners. Perfect for learning the fundamentals of park riding.',
    coordinates: [40.19506931223507, -105.088547855697], // [lat, lng] 301 E 21st Ave
  },
  {
    name: 'Sandstone Ranch Community Park',
    location: 'Longmont, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/vYNYVSRsBYnWXidi7',
    size: 'Large',
    sizeRating: 4,
    quality: 'Excellent',
    qualityRating: 5,
    skillLevels: ['Intermediate', 'Advanced'],
    description: '17,700 sq ft lighted skate park with both street course and vert skating. One of the premier skate parks in the Longmont area with modern features.',
    coordinates: [40.15982031197992, -105.04154824233038], // [lat, lng] 3001 Colorado Highway 119
  },
  {
    name: 'Longmont BMX Park',
    location: 'Longmont, CO',
    type: 'BMX Track',
    googleMapsUrl: 'https://maps.app.goo.gl/vYNYVSRsBYnWXidi7',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner'],
    description: 'Neighborhood skate park suitable for beginners. Good for learning the basics of park riding in a friendly environment.',
    coordinates: [40.18322469573814, -105.06322557444402], // [lat, lng] 1340 Deerwood Drive
  },
  {
    name: 'Loveland Sports Park',
    location: 'Loveland, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/RVnjurqoHs5PZTZ47',
    size: 'Medium',
    sizeRating: 3,
    quality: 'Good',
    qualityRating: 4,
    skillLevels: ['Beginner', 'Intermediate', 'Advanced'],
    description: 'Concrete skate park with various ramps and bowls suitable for different skill levels. Part of the larger Loveland Sports Park complex.',
    coordinates: [40.402559488526485, -105.01758136227281], // [lat, lng] 950 N. Boyd Lake Ave
  },
  {
    name: 'Fairgrounds Park',
    location: 'Loveland, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Fairgrounds+Park+skate+park+Loveland+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Skate park at Fairgrounds Park with features suitable for beginners and intermediate riders. Part of a larger park with dog park, playgrounds, and spray park.',
    coordinates: [40.38732278877799, -105.07714178158825], // [lat, lng] 700 S. Railroad Avenue
  },
  {
    name: 'Mehaffey Park',
    location: 'Loveland, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mehaffey+Park+skate+park+Loveland+Colorado',
    size: 'Small',
    sizeRating: 2,
    quality: 'Good',
    qualityRating: 3,
    skillLevels: ['Beginner', 'Intermediate'],
    description: 'Skate park in the 64-acre Mehaffey Park complex. Features suitable for beginners and intermediate riders, along with dog park and adventure playground.',
    coordinates: [40.419199236428504, -105.12378824466703], // [lat, lng] 3350 W. 29th St
  },
];

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          className={`w-5 h-5 ${
            star <= rating ? 'text-[#00ff0c] fill-[#00ff0c]' : 'text-gray-600'
          }`}
        />
      ))}
    </div>
  );
};

const typeBorderColors: Record<Park['type'], string> = {
  'Bike Park': '#00ff0c',      // neon green
  'Skate Park': '#0066ff',     // blue
  'Pump Track': '#ffaa00',     // orange
  'BMX Track': '#ff0000',      // red
  'Indoor Park': '#ff00ff',    // magenta
};

const ParkCard = ({ park }: { park: Park }) => {
  const borderColor = typeBorderColors[park.type] ?? '#00ff0c';

  return (
    <div
      className="bg-black border-8 rounded-xl overflow-hidden transform hover:scale-105 transition-transform"
      style={{ borderColor }}
    >
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-3xl font-black text-[#00ff0c] mb-2">{park.name}</h2>
          <div className="flex items-center gap-2 text-white font-bold bg-[#00ff0c] px-3 py-1 inline-block border-2 border-black rounded-lg mb-2">
            <MapPinIcon className="w-4 h-4" />
            <span>{park.location}</span>
          </div>
          <div className="text-[#00ff0c] font-bold text-sm mb-3">
            {park.type}
          </div>
        </div>

        <p className="text-white mb-4 leading-relaxed font-bold">{park.description}</p>

        {/* Ratings */}
        <div className="mb-4 space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-bold">Size:</span>
              <span className="text-[#00ff0c] font-black">{park.size}</span>
            </div>
            <RatingStars rating={park.sizeRating} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-bold">Quality:</span>
              <span className="text-[#00ff0c] font-black">{park.quality}</span>
            </div>
            <RatingStars rating={park.qualityRating} />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-white font-bold">Skill Levels:</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {park.skillLevels.map((level) => (
                <span
                  key={level}
                  className="bg-[#00ff0c] text-black font-black px-2 py-1 text-xs border-2 border-black rounded-lg"
                >
                  {level}
                </span>
              ))}
            </div>
          </div>
          {park.toddlerApproved && (
            <div className="flex items-center gap-2 mt-2">
              <span className="bg-[#00ff0c] text-black font-black px-2 py-1 text-xs border-2 border-black rounded-lg animate-bounce-slow">
                ★ TODDLER APPROVED
              </span>
            </div>
          )}
        </div>

        <div className="border-t-4 border-[#00ff0c] pt-4">
          <a
            href={park.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-black text-[#00ff0c] hover:text-white font-black px-4 py-3 border-4 border-[#00ff0c] rounded-xl hover:border-white transition-colors"
          >
            <LinkIcon className="w-5 h-5" />
            <span>View on Google Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default function FreestylePage() {
  return (
    <main className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 w-full h-full" 
        style={{ 
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      >
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/low-section-man-with-bicycle-performing-stunt-against-clear-sky.jpg')`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        />
        <div className="absolute inset-0 w-full h-full bg-black/50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 relative z-10">
        {/* Back Button - Mobile Only */}
        <Link 
          href="/"
          className="md:hidden inline-block mb-6 sm:mb-8 bg-black text-[#00ff0c] font-black px-4 sm:px-6 py-3 border-4 border-[#00ff0c] rounded-xl active:bg-[#00ff0c] active:text-black transition-all transform active:scale-95 min-h-[44px] flex items-center justify-center"
        >
          ← BACK TO HOME
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-black border-4 border-[#00ff0c] rounded-xl p-8 mb-6">
            <h1 className="text-5xl md:text-7xl font-black text-[#00ff0c] mb-2" style={{textShadow: '0 0 20px #00ff0c, 4px 4px 0px rgba(0,0,0,0.8)'}}>
              FREESTYLE & PRACTICE
            </h1>
            <div className="h-2 bg-[#00ff0c]"></div>
          </div>
          <p className="text-white font-bold text-xl max-w-3xl mx-auto">
            Find the best skate parks, bike parks, and pump tracks in the Denver metro area to practice your jumping skills and freestyle riding.
          </p>
        </div>

        {/* Park Finder Map */}
        <div className="mb-12">
          <div className="bg-black border-4 border-[#00ff0c] rounded-xl p-6 mb-4">
            <h2 className="text-3xl font-black text-[#00ff0c] mb-2 text-center">
              PARK FINDER MAP
            </h2>
            <p className="text-white font-bold text-center">
              <span className="hidden md:inline">Hover over the pins to see park details. Click for more information!</span>
              <span className="md:hidden">Tap the pins to see park details and get directions!</span>
            </p>
          </div>
          <ParkFinderMap parks={parks} />
        </div>

        {/* Park Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {parks.map((park) => (
            <ParkCard key={park.name} park={park} />
          ))}
        </div>

        {/* Info Box */}
        <div className="text-center bg-black border-4 border-[#00ff0c] rounded-xl p-8 mb-12">
          <h2 className="text-4xl font-black text-[#00ff0c] mb-4">
            READY TO RIDE?
          </h2>
          <p className="text-white mb-6 font-bold text-xl">
            Always wear a helmet, protective gear, and check park hours before visiting. Respect other riders and follow park rules!
          </p>
          <Link
            href="/calendar"
            className="inline-block bg-[#00ff0c] hover:bg-white text-black font-black px-8 py-4 border-4 border-black rounded-xl transition-colors transform hover:scale-110 text-xl"
          >
            <BoltIcon className="w-5 h-5 inline mr-2" />
            VIEW RACE CALENDAR
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}

