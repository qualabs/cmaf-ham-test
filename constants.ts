
const DIR_MANIFEST_SAMPLES = '../manifest-samples';
const DIR_DASH_SAMPLES = `${DIR_MANIFEST_SAMPLES}/dash-samples`;
const DIR_HLS_SAMPLES = `${DIR_MANIFEST_SAMPLES}/hls-samples`;
const OUTPUT_DIR = '../output';
const HLS_EXTENSION = '.m3u8';
const FILE_ENCODING = 'utf8';

//This is the manifest that will be used for testing. Change this to test different manifests.
const MANIFEST_TEST = `${DIR_HLS_SAMPLES}/sample-1/main.m3u8`;
const PLAYLISTS_TESTS_1 = [
    `${DIR_HLS_SAMPLES}/sample-1/playlist_a-eng-0128k-aac-2c.mp4.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-1/playlist_v-0144p-0100k-libx264.mp4.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-1/playlist_v-0240p-0400k-libx264.mp4.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-1/playlist_v-0360p-0750k-libx264.mp4.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-1/playlist_v-0480p-1000k-libx264.mp4.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-1/playlist_v-0576p-1400k-libx264.mp4.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-1/playlist_v-0720p-2500k-libx264.mp4.m3u8`,
]

const PLAYLISTS_TESTS = [
    `${DIR_HLS_SAMPLES}/sample-3/audio-eng-038k-aac-6c.mp4.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-3/audio-eng-0128k-aac-2c.mp4.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-3/playlist_s-el.webvtt.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-3/playlist_s-en.webvtt.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-3/video-0360p-0750k-libx264.mp4.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-3/video-0480p-1000k-libx264.mp4.m3u8`,
    `${DIR_HLS_SAMPLES}/sample-3/video-0576p-1400k-libx264.mp4.m3u8`,
]

export { DIR_MANIFEST_SAMPLES, DIR_DASH_SAMPLES, DIR_HLS_SAMPLES, OUTPUT_DIR, HLS_EXTENSION, FILE_ENCODING, MANIFEST_TEST , PLAYLISTS_TESTS};