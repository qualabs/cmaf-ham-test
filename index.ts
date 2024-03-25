import {
  hamToHls,
  hamToDash,
  hlsToHam,
  dashToHam,
} from "@svta/common-media-library";
import fs from 'fs';
import { FILE_ENCODING, HLS_EXTENSION, OUTPUT_DIR ,MANIFEST_TEST } from "./constants.js";

function testInteroperability(dirMainManifest:string, dirAncillaryManifests?:string[]){
  //Read manifests
  const manifest = fs.readFileSync(dirMainManifest, FILE_ENCODING);
  console.log(manifest);
  const ancillaryManifests = dirAncillaryManifests?.map((ancillaryManifest) => fs.readFileSync(ancillaryManifest, FILE_ENCODING));

  //Convert the manifest to HAM
  const ham = dirMainManifest.endsWith(HLS_EXTENSION) ? hlsToHam(manifest,ancillaryManifests) : dashToHam(manifest);

  //Create output directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }

  fs.writeFileSync(`${OUTPUT_DIR}/ham.json`, JSON.stringify(ham));

  //Convert the HAM to DASH
  const dash = hamToDash(ham);
  
  //Write the manifest to a file
  fs.writeFileSync(`${OUTPUT_DIR}/main.mpd`, dash.manifest);

  // Convert the HAM to HLS
  const hls = hamToHls(ham);

  // Write the manifest to a file
  fs.writeFileSync(`${OUTPUT_DIR}/main.m3u8`, hls.manifest);

  // Write the ancillary manifests to files
  
  hls.ancillaryManifests?.forEach((ancillaryManifest: { manifest: string  }, index: any) => {
    fs.writeFileSync(`${OUTPUT_DIR}/ancillary-${index}.m3u8`, ancillaryManifest.manifest);
  });
}

testInteroperability(MANIFEST_TEST);

