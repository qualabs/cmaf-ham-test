
const DIR_MANIFEST_SAMPLES = '../manifest-samples';
const DIR_DASH_SAMPLES = `${DIR_MANIFEST_SAMPLES}/dash-samples`;
const DIR_HLS_SAMPLES = `${DIR_MANIFEST_SAMPLES}/hls-samples`;
const OUTPUT_DIR = '../output';
const HLS_EXTENSION = '.m3u8';
const FILE_ENCODING = 'utf8';

//This is the manifest that will be used for testing. Change this to test different manifests.
const MANIFEST_TEST = `${DIR_DASH_SAMPLES}/sample-1/manifest-sample-1.mpd`;

export { DIR_MANIFEST_SAMPLES, DIR_DASH_SAMPLES, DIR_HLS_SAMPLES, OUTPUT_DIR, HLS_EXTENSION, FILE_ENCODING, MANIFEST_TEST };