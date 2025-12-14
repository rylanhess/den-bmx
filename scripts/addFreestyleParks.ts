/**
 * Add Freestyle Parks Script
 * 
 * Adds skate parks, bike parks, pump tracks, and indoor parks from the Freestyle page
 * to the Supabase tracks table
 * Excludes BMX tracks that are already in the tracks table
 */

import { supabase } from './config';

interface Park {
  name: string;
  location: string;
  type: 'Bike Park' | 'Skate Park' | 'Pump Track' | 'BMX Track' | 'Indoor Park';
  googleMapsUrl: string;
  coordinates: [number, number]; // [lat, lng]
  description: string;
}

// Parks from the Freestyle page (excluding BMX tracks that are already in tracks table)
const freestyleParks: Park[] = [
  {
    name: 'Valmont Bike Park',
    location: 'Boulder, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Valmont+Bike+Park+Boulder+Colorado',
    coordinates: [40.03160823798708, -105.23424042526366],
    description: 'World-class 42-acre facility with over 30 jumps, cyclocross courses, and diverse terrain features. One of the premier bike parks in the region with professional-grade features.',
  },
  {
    name: 'Ruby Hill Bike Park',
    location: 'Denver, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ruby+Hill+Bike+Park+Denver+Colorado',
    coordinates: [39.683854540367726, -105.00535349867998],
    description: '7.5-acre park featuring slopestyle courses, dirt jumps, pump tracks, and skills courses. Includes expert lines for professional riders and beginner-friendly areas.',
  },
  {
    name: 'Barnum Bike Park',
    location: 'Denver, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Barnum+Bike+Park+Denver+Colorado',
    coordinates: [39.726146473685674, -105.02946638153433],
    description: 'Urban bike park with multiple slope lines for different skill levels and a pump track. Well-maintained with diverse features in a convenient city location.',
  },
  {
    name: 'Golden Bike Park',
    location: 'Golden, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Golden+Bike+Park+Colorado',
    coordinates: [39.78076926473103, -105.18797966659338],
    description: 'Features a downhill flow trail with widened jumps and rollable options. Trails split into separate beginner, intermediate, and advanced sections with creative design.',
  },
  {
    name: 'McKay Lake Bike Park',
    location: 'Broomfield, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=McKay+Lake+Bike+Park+Broomfield+Colorado',
    coordinates: [39.951894491114956, -105.01612951808588],
    description: 'Well-designed paved pump track perfect for skill development. Great for practicing pumping technique and building confidence.',
  },
  {
    name: 'Ulysses Skate Park',
    location: 'Golden, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ulysses+Skate+Park+Golden+Colorado',
    coordinates: [39.73681324947393, -105.19595282242263],
    description: 'Well-maintained skate park with a variety of features catering to different skill levels. Suitable for BMX riders looking to practice tricks and jumps.',
  },
  {
    name: 'Wheat Ridge Skate Park',
    location: 'Wheat Ridge, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wheat+Ridge+Skate+Park+Colorado',
    coordinates: [39.76798838350004, -105.10916988153407],
    description: 'Neighborhood skate park with basic features. Good for beginners learning the fundamentals of park riding.',
  },
  {
    name: 'Anthem Pump Track',
    location: 'Broomfield, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Anthem+Pump+Track+Broomfield+Colorado',
    coordinates: [39.982258508505566, -105.02395022092766],
    description: 'Paved pump track designed for skill development. Great for practicing pumping technique and building bike handling skills.',
  },
  {
    name: 'Revolution Pump Track',
    location: 'Superior, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Revolution+Pump+Track+Superior+Colorado',
    coordinates: [40.0409153760191, -105.05081357733108],
    description: 'Paved pump track providing a smooth surface for practicing pumping technique. Ideal for riders looking to improve their skills.',
  },
  {
    name: 'Apple Meadows Bike Park',
    location: 'Golden, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://maps.app.goo.gl/SbwtWAvDtGp2GFY5A',
    coordinates: [39.806185, -105.2144612],
    description: 'Community bike park in Golden featuring trails and bike features. Great for practicing skills and enjoying outdoor riding.',
  },
  {
    name: 'Golden Heights Skate Park',
    location: 'Golden, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/DG52AkL7cv63MmC88',
    coordinates: [39.72130829578785, -105.18446614850718],
    description: 'Skate park in Golden with various features for BMX riders and skaters. Good for practicing tricks and improving skills.',
  },
  {
    name: 'Lakewood Skate Park',
    location: 'Lakewood, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/oSheCiAhjeaPD1Hi9',
    coordinates: [39.70623063034705, -105.13956498955588],
    description: 'Small neighborhood skate park. Perfect for beginners learning the basics of park riding.',
  },
  {
    name: 'Lakewood Link Skate Park',
    location: 'Lakewood, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/E94xRYEehwRcmTJ66',
    coordinates: [39.694782940303476, -105.07540636598253],
    description: 'Small to medium-sized skate park with good features for skill development. Suitable for beginners and intermediate riders.',
  },
  {
    name: 'Bates-Logan Park',
    location: 'Denver, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Logan+Bates+Park+Denver+Colorado',
    coordinates: [39.66391634233429, -104.98140786482803],
    description: 'Neighborhood park near Logan St & Bates Ave with smooth paths and gentle grades that are perfect for balance bikes and first pedal strokes.',
  },
  {
    name: "Sloan's Lake Pump Track",
    location: 'Denver, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sloans+Lake+Pump+Track+Denver+Colorado',
    coordinates: [39.74484832646096, -105.04445994619498],
    description: "Compact pump track near Sloans Lake with mellow rollers and low berms, ideal for toddler balance bikes and early riders.",
  },
  {
    name: 'Denver Skatepark',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Denver+Skatepark+Denver+Colorado',
    coordinates: [39.759771950253565, -105.0028542545725],
    description: 'Iconic 2.5-acre downtown skatepark just north of Elitch Gardens, with massive bowls, street plazas, and flow lines. Best for confident riders and advanced park skills.',
  },
  {
    name: 'La Alma Lincoln Park Skate Area',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=La+Alma+Lincoln+Park+Skate+Park+Denver+Colorado',
    coordinates: [39.734695558116854, -105.00432800920038],
    description: 'Neighborhood skate area in La Alma Lincoln Park with smaller features and open flat space. Good warm-up spot close to downtown.',
  },
  {
    name: 'Elyria Skatepark',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Elyria+Skatepark+Denver+Colorado',
    coordinates: [39.816313280859376, -104.95460165012099],
    description: 'Compact 3,500 sq ft metal-ramp park in Elyria with mellow transitions and slower features. Friendly spot to get comfortable riding park.',
  },
  {
    name: 'Wheel Park',
    location: 'Aurora, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/w9jT8gKDCDkmySc4A',
    coordinates: [39.67210999050533, -104.80825333931942],
    description: 'Nearly 20,000 sq ft well-lit concrete park at Wheel Park in Aurora with street course and 10-foot bowl. Good coverage for east-metro riders.',
  },
  {
    name: 'Green Valley Ranch Skatepark',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Green+Valley+Ranch+Skatepark+Denver+Colorado',
    coordinates: [39.788739028365654, -104.76645225171562],
    description: '2,000 sq ft neighborhood concrete park in Green Valley Ranch with mini-ramp, small bowl, and simple street features.',
  },
  {
    name: 'Central Park Skatepark',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Central+Park+Skatepark+Denver+Colorado',
    coordinates: [39.75450423758318, -104.88666908659067],
    description: 'Small beginner-friendly bowl and a few street-style obstacles in Central Park (Stapleton) serving north-east Denver.',
  },
  {
    name: 'Montbello Skatepark',
    location: 'Denver, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/b6wbrqvtvwbFewhy8',
    coordinates: [39.79650095332542, -104.8058623565479],
    description: 'Skate area in Parkfield Lake Park providing additional east Denver coverage with basic ramps and rails.',
  },
  {
    name: 'Cornerstone Skate Park',
    location: 'Littleton, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cornerstone+Skate+Park+Littleton+Colorado',
    coordinates: [39.621804271186505, -105.00091983094093],
    description: 'Full concrete skatepark and inline hockey rink at Cornerstone Park in Littleton, with bowls and street features serving south-metro riders.',
  },
  {
    name: 'Redstone Skate Park',
    location: 'Highlands Ranch, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Redstone+Skate+Park+Highlands+Ranch+Colorado',
    coordinates: [39.54763797704579, -105.02818950000326],
    description: 'Outdoor concrete park in Redstone Park with bowl and street elements, primary skatepark serving Highlands Ranch and surrounding suburbs.',
  },
  {
    name: 'SNÖBAHN Action Sports Center',
    location: 'Thornton, CO',
    type: 'Indoor Park',
    googleMapsUrl: 'https://maps.app.goo.gl/z5W86KkBxNpwBkG37',
    coordinates: [39.95378885637944, -104.98423755886438],
    description: 'Indoor action sports center with year-round skiing, snowboarding, bike and skate features, and trampolines. Great bad-weather option for progression sessions.',
  },
  {
    name: 'High Plains Pump Track',
    location: 'Aurora, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://share.google/zhMfqXYHBCfP8BvHS',
    coordinates: [39.8008005182916, -104.87252688250375],
    description: 'Neighborhood pump track at High Plains Park with mellow rollers and low berms, giving southeast Aurora riders a local place to lap.',
  },
  {
    name: 'Montbello Central Pump Track',
    location: 'Denver, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://share.google/DWLXg2UuK0XdUmfpe',
    coordinates: [39.7859465565771, -104.82921009795255],
    description: 'Compact pump track at Montbello Central Park, adding a freestyle option on Denver\'s far northeast side.',
  },
  {
    name: 'Via Varra Pump Track',
    location: 'Broomfield, CO',
    type: 'Pump Track',
    googleMapsUrl: 'https://share.google/qXU7sWUAcxGOjMclI',
    coordinates: [39.94701598990804, -105.12420417114396],
    description: 'Paved neighborhood pump track off Via Varra in Broomfield, serving riders along US‑36 between Denver and Boulder.',
  },
  {
    name: 'Superior Bike Park',
    location: 'Superior, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://share.google/D60nqEg5vXollwumI',
    coordinates: [39.935917410569544, -105.14403175572266],
    description: 'Dirt jump and skills park in Superior with progressive lines and small pump features, filling a freestyle gap between Denver and Boulder.',
  },
  {
    name: 'Mountain Shadows Bike Park & Pump Track',
    location: 'Colorado Springs, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://share.google/obWMcirUzc41Wq2N4',
    coordinates: [40.16459178036965, -104.94948138658627],
    description: 'Neighborhood bike park and pump track in the Mountain Shadows area of Colorado Springs, with views of the Front Range and a mix of rollers and jumps.',
  },
  {
    name: 'Sugar Beet Bike Park',
    location: 'Brighton, CO',
    type: 'Bike Park',
    googleMapsUrl: 'https://share.google/2an5TskOtJcw92Yc2',
    coordinates: [39.97078718100292, -104.76466581551468],
    description: 'Modern neighborhood bike park in Sugar Beet Park, with jump lines and a small pump track that complement the larger Fort Collins bike parks.',
  },
  {
    name: 'Don Anema Memorial Skatepark',
    location: 'Brighton, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://share.google/tVU3xVTSN3FuV5Sum',
    coordinates: [39.90822973230898, -104.9837432442758],
    description: 'Outdoor concrete skatepark honoring Don Anema, with bowls and street features serving riders in the Brighton area.',
  },
  {
    name: 'Thomas J. Slocum Memorial Skatepark',
    location: 'Thornton, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://share.google/4Jv40KYu1yjx1xj43',
    coordinates: [39.867728798765356, -104.95813305769727],
    description: '22,000 sq ft Team Pain–built park in Thornton with peanut bowl, street course, and modern features, completely rebuilt in a recent renovation.',
  },
  {
    name: 'Blue Skies Neighborhood Park',
    location: 'Longmont, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Blue+Skies+Neighborhood+Park+Longmont+Colorado',
    coordinates: [40.14237202342511, -105.1724236980156],
    description: '11-acre park featuring a skate area themed around the history of flight. Suitable for intermediate to advanced riders with various features.',
  },
  {
    name: 'Quail Campus Community Park',
    location: 'Longmont, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Quail+Campus+Community+Park+Longmont+Colorado',
    coordinates: [40.14586372689992, -105.10001027730533],
    description: 'Skate park at Quail Campus Community Park designed for beginner to intermediate riders. Note: Currently closed for scheduled maintenance.',
  },
  {
    name: 'Rough and Ready Neighborhood Park',
    location: 'Longmont, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Rough+and+Ready+Neighborhood+Park+Longmont+Colorado',
    coordinates: [40.19506931223507, -105.088547855697],
    description: 'Small skate park with basic rail features designed for beginners. Perfect for learning the fundamentals of park riding.',
  },
  {
    name: 'Sandstone Ranch Community Park',
    location: 'Longmont, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/vYNYVSRsBYnWXidi7',
    coordinates: [40.15982031197992, -105.04154824233038],
    description: '17,700 sq ft lighted skate park with both street course and vert skating. One of the premier skate parks in the Longmont area with modern features.',
  },
  {
    name: 'Longmont BMX Park',
    location: 'Longmont, CO',
    type: 'BMX Track',
    googleMapsUrl: 'https://maps.app.goo.gl/vYNYVSRsBYnWXidi7',
    coordinates: [40.18322469573814, -105.06322557444402],
    description: 'Neighborhood skate park suitable for beginners. Good for learning the basics of park riding in a friendly environment.',
  },
  {
    name: 'Loveland Sports Park',
    location: 'Loveland, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://maps.app.goo.gl/RVnjurqoHs5PZTZ47',
    coordinates: [40.402559488526485, -105.01758136227281],
    description: 'Concrete skate park with various ramps and bowls suitable for different skill levels. Part of the larger Loveland Sports Park complex.',
  },
  {
    name: 'Fairgrounds Park',
    location: 'Loveland, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Fairgrounds+Park+skate+park+Loveland+Colorado',
    coordinates: [40.38732278877799, -105.07714178158825],
    description: 'Skate park at Fairgrounds Park with features suitable for beginners and intermediate riders. Part of a larger park with dog park, playgrounds, and spray park.',
  },
  {
    name: 'Mehaffey Park',
    location: 'Loveland, CO',
    type: 'Skate Park',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mehaffey+Park+skate+park+Loveland+Colorado',
    coordinates: [40.419199236428504, -105.12378824466703],
    description: 'Skate park in the 64-acre Mehaffey Park complex. Features suitable for beginners and intermediate riders, along with dog park and adventure playground.',
  },
];

/**
 * Generate slug from park name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract city from location string
 */
function extractCity(location: string): string {
  // Location format is usually "City, CO" or "City, State"
  const parts = location.split(',');
  return parts[0]?.trim() || location;
}

/**
 * Add parks to tracks table
 */
async function addParks() {
  console.log('🚀 Adding freestyle parks to tracks table...\n');

  try {
    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const park of freestyleParks) {
      const slug = generateSlug(park.name);
      const city = extractCity(park.location);

      // Check if track already exists
      const { data: existingTrack, error: fetchError } = await supabase
        .from('tracks')
        .select('id, name')
        .eq('slug', slug)
        .maybeSingle();

      if (fetchError) {
        console.error(`Error checking for track ${park.name}:`, fetchError.message);
        errors++;
        continue;
      }

      if (existingTrack) {
        console.log(`⏭️  Skipped (already exists): ${park.name}`);
        skipped++;
        continue;
      }

      // Insert new track
      const { data: newTrack, error } = await supabase
        .from('tracks')
        .insert({
          name: park.name,
          slug,
          city,
          tz: 'America/Denver',
          fb_page_url: null,
          usabmx_url: park.googleMapsUrl,
          lat: park.coordinates[0],
          lon: park.coordinates[1],
          logo: null,
          wallpaper: null,
        })
        .select('id')
        .single();

      if (error) {
        if (error.code === '23505') {
          // Duplicate - this is okay
          console.log(`⏭️  Skipped duplicate: ${park.name}`);
          skipped++;
        } else {
          console.error(`❌ Error inserting ${park.name}:`, error.message);
          errors++;
        }
      } else {
        console.log(`✅ Added: ${park.name} (${park.type}) - ${city}`);
        inserted++;
      }
    }

    console.log(`\n✨ Done!`);
    console.log(`   ✅ Inserted: ${inserted} parks`);
    console.log(`   ⏭️  Skipped: ${skipped} parks`);
    if (errors > 0) {
      console.log(`   ❌ Errors: ${errors} parks`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  addParks();
}

export { addParks };

