import {
  hamToM3U8,
  hamToMpd,
  m3u8ToHam,
  mpdToHam,
  Presentation,
  Manifest,
  getTracksFromPresentation,
  validateTracks,
} from "@svta/common-media-library";
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  appendFileSync,
} from "node:fs";

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

function checkTracksValidity(presentation: Presentation) {
  const validation = validateTracks(getTracksFromPresentation(presentation));
  console.log("\n######### INPUT TRACKS VALIDATION ########");
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
  console.log("######### INPUT TRACKS VALIDATION ENDED ########\n");
  return validation;
}

function readFile(path: string) {
  let data: string;

  try {
    data = readFileSync(path, {
      encoding: "utf8",
      flag: "r",
    });
  } catch (error) {
    console.error(`File ${path} not found.`);
    return;
  }

  return data;
}

function fromMpdToHam(input: string) {
  let data: string = readFile(`${INPUT_DIR}/mpd/${input}.mpd`);
  // Convert the input to HAM Object.
  const presentations = mpdToHam(data);
  // Validate tracks
  const validation = checkTracksValidity(presentations.at(0));

  if (validation.status) {
    // Convert the HAM Object to MPD content.
    const mpdManifest = hamToMpd(presentations);
    // Convert the HAM Object to HLS content.
    const hlsManifest = hamToM3U8(presentations);
    // Write the outputs
    writeManifestOutput(input, mpdManifest, true);
    writeManifestOutput(input, hlsManifest, true);
  }

  writeFileSync(
    `${OUTPUT_DIR}/ham/${input}-json`,
    JSON.stringify(presentations)
  );
}

function fromM3u8ToHam(main: string, playlists: string[]) {
  const mainManifest = readFileSync(`${INPUT_DIR}/hls/${main}`, "utf8");
  const ancillaryManifests = playlists.map((playlist) => {
    return readFileSync(`${INPUT_DIR}/hls/${playlist}`, "utf8");
  });

  // Convert m3u8 to ham object
  const hamObject = m3u8ToHam(mainManifest, ancillaryManifests);
  console.log("M3U8 has been converted to ham object.");

  //Convert ham object to m3u8
  const hlsManifest = hamToM3U8(hamObject);
  console.log("m3u8 object has been created.");

  //Write output
  writeManifestOutput("hlsSample", hlsManifest, true);

  console.log("Manifest m3u8 and ancillary m3u8 files have been written.");
}

initialize();
// fromM3u8ToHam(MAIN_HLS, PLAYLIST_HLS);
fromMpdToHam("dashSample");
// fromMpdToHam('dashInvalidSample');
