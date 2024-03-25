
import {
  hamToHls,
  hamToDash,
  hlsToHam,
  dashToHam,
} from "@svta/common-media-library";

import fs from 'fs';
//import samples from manifest-samples/dash-samples
const DIR_MANIFEST_SAMPLES = 'manifest-samples';
const DIR_DASH_SAMPLES = `${DIR_MANIFEST_SAMPLES}/dash-samples`;
const DIR_HLS_SAMPLES = `${DIR_MANIFEST_SAMPLES}/hls-samples`;

function test (dirMainManifest:string, ancillaryManifestss?:string[]){
  const manifest = fs.readFileSync(dirMainManifest, 'utf8');
  const ham = dashToHam(manifest);
  fs.writeFileSync('ham.json', JSON.stringify(ham));
  const dash = hamToDash(ham);
  
  const m3u8 = hamToHls(ham);
  fs.writeFileSync('main.m3u8', m3u8.manifest);
  fs.writeFileSync('main.mpd', dash.manifest);
  
  m3u8.ancillaryManifests?.forEach((ancillaryManifest: { manifest: string | NodeJS.ArrayBufferView; }, index: any) => {
    fs.writeFileSync(`ancillary-${index}.m3u8`, ancillaryManifest.manifest);
  });
}

test('dash1');

