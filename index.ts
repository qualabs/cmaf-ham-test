
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
const HLS_EXTENSION = '.m3u8';

function test (dirMainManifest:string, ancillaryManifestss?:string[]){
  const manifest = fs.readFileSync(dirMainManifest, 'utf8');

  //Convert the manifest to HAM
  const ham = dirMainManifest.endsWith(HLS_EXTENSION) ? hlsToHam(manifest,ancillaryManifestss) : dashToHam(manifest);
  fs.writeFileSync('ham.json', JSON.stringify(ham));

  //Convert the HAM to DASH
  const dash = hamToDash(ham);
  
  //Write the manifest to a file
  fs.writeFileSync('main.mpd', dash.manifest);

  // Convert the HAM to HLS
  const hls = hamToHls(ham);

  // Write the manifest to a file
  fs.writeFileSync('main.m3u8', hls.manifest);

  // Write the ancillary manifests to files
  
  hls.ancillaryManifests?.forEach((ancillaryManifest: { manifest: string | NodeJS.ArrayBufferView; }, index: any) => {
    fs.writeFileSync(`ancillary-${index}.m3u8`, ancillaryManifest.manifest);
  });
}

test('dash1');

