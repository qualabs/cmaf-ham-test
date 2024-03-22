import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  appendFileSync,
} from "node:fs";
import {
  hamToHls,
  hamToDash,
  hlsToHam,
  dashToHam,
  getTracksFromPresentation,
  validateTracks,
  Presentation,
} from "@svta/common-media-library";

const OUTPUT_DIR = "./output";
const INPUT_DIR = "./input";
const MAIN_HLS = "ToS_AVC_HEVC_MutliRate_MultiRes_IFrame_AAC.m3u8";
const PLAYLIST_HLS = [
  "tears-of-steel-aac-64k.m3u8",
  "tears-of-steel-aac-128k.m3u8",
  "tears-of-steel-avc1-400k.m3u8",
  "tears-of-steel-avc1-750k.m3u8",
  "tears-of-steel-avc1-1000k.m3u8",
  "tears-of-steel-avc1-1500k.m3u8",
  "tears-of-steel-avc1-2200k.m3u8",
  "tears-of-steel-hev1-1100k.m3u8",
  "tears-of-steel-hev1-1500k.m3u8",
  "tears-of-steel-hev1-2200k.m3u8",
  "tears-of-steel-avc1-400k.m3u8",
  "tears-of-steel-avc1-750k.m3u8",
  "tears-of-steel-avc1-1000k.m3u8",
  "tears-of-steel-avc1-1500k.m3u8",
  "tears-of-steel-avc1-2200k.m3u8",
  "tears-of-steel-hev1-1100k.m3u8",
  "tears-of-steel-hev1-1500k.m3u8",
  "tears-of-steel-hev1-2200k.m3u8",
];

function initialize() {
  try {
    mkdirSync(`${OUTPUT_DIR}/ham`, { recursive: true });
    mkdirSync(`${OUTPUT_DIR}/mpd`);
    mkdirSync(`${OUTPUT_DIR}/m3u8`);
  } catch {}
}

function writeManifestOutput(input: string, manifest: Manifest, isMain?) {
  const path: string = `${OUTPUT_DIR}/${manifest.type}/${input}-output.${manifest.type}`;
  if (isMain) {
    writeFileSync(path, manifest.manifest);
  } else {
    appendFileSync(path, manifest.manifest);
  }
  manifest.ancillaryManifests?.forEach((m) => writeManifestOutput(input, m));
}

function checkValidity(presentation: Presentation) {
  const validation = validateTracks(getTracksFromPresentation(presentation));
  console.log("######### INPUT TRACKS VALIDATION ########");
  console.log(
    "At least one segment: ",
    validation.description.atLeastOneSegment
  );
  console.log(
    "All the tracks have the same duration: ",
    validation.description.sameDuration
  );
  validation.tracksWithErrors.length > 0 &&
    console.log("Track IDs without segments: ", validation.tracksWithErrors);
  console.log("######### INPUT TRACKS VALIDATION ENDED ########");
  return validation;
}

function fromMpdToHam(input: string) {
  let data: string;

  try {
    data = readFileSync(`${INPUT_DIR}/dash/${input}.mpd`, {
      encoding: "utf8",
      flag: "r",
    });
  } catch (error) {
    console.error(`File ${input} not found.`);
    return;
  }

  // Convert the input to HAM Object.
  const hamObject = dashToHam(data);
  // Validate tracks
  const validation = checkValidity(hamObject.at(0));

  if (validation.status) {
    // Convert the HAM Object to MPD content.
    const mpdManifest = hamToDash(hamObject);
    // Convert the HAM Object to HLS content.
    const hlsManifest = hamToHls(hamObject);
    // Write the outputs
    writeManifestOutput(input, mpdManifest, true);
    writeManifestOutput(input, hlsManifest, true);
  }
  writeFileSync(
    `${OUTPUT_DIR}/ham/${input}-ham.json`,
    JSON.stringify(hamObject)
  );
}

function fromM3u8ToHam(main: string, playlists: string[]) {
  const mainManifest = readFileSync(`${INPUT_DIR}/hls/${main}`, "utf8");
  const ancillaryManifests = playlists.map((playlist) => {
    return readFileSync(`${INPUT_DIR}/hls/${playlist}`, "utf8");
  });

  // Convert m3u8 to ham object
  const hamObject = hlsToHam(mainManifest, ancillaryManifests);
  console.log("M3U8 has been converted to ham object.");

  //Convert ham object to m3u8
  const hlsManifest = hamToHls(hamObject);
  console.log("m3u8 object has been created.");

  //Write output
  writeManifestOutput("hlsSample", hlsManifest, true);

  console.log("Manifest m3u8 and ancillary m3u8 files have been written.");
}

initialize();
// fromM3u8ToHam(MAIN_HLS, PLAYLIST_HLS);
fromMpdToHam("dashSample");
// fromMpdToHam('dashInvalidSample');
