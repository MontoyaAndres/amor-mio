const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

const IMAGES = [
  "./IMAGES/e30962d7-ea5a-4e8d-a652-f4b3625a1fa8.jpg",
  "./IMAGES/IMG-20240512-WA0018.jpg",
  "./IMAGES/IMG_1900.jpg",
  "./IMAGES/IMG-20240411-WA0012.jpg",
  "./IMAGES/IMG_1917.jpg",
  "./IMAGES/IMG_4099.jpg",
  "./IMAGES/IMG_3042.jpg",
  "./IMAGES/IMG_3268.jpg",
  "./IMAGES/IMG_3240.jpg",
  "./IMAGES/IMG-20240120-WA0010.jpg",
  "./IMAGES/IMG_9237.jpg",
  "./IMAGES/IMG_8920.jpg",
  "./IMAGES/IMG_4115.jpg",
  "./IMAGES/IMG-20240228-WA0037.jpg",
  "./IMAGES/IMG_1396.jpg",
  "./IMAGES/IMG_9245.jpg",
  "./IMAGES/IMG_2270.jpg",
  "./IMAGES/IMG_2265.jpg",
  "./IMAGES/IMG_4833.jpg",
  "./IMAGES/IMG_4004.jpg",
  "./IMAGES/4E8A5220-B6A6-46E6-9E10-5515C0F4DAFF.jpg",
  "./IMAGES/IMG_20240423_205642.jpg",
  "./IMAGES/IMG_2110.jpg",
  "./IMAGES/IMG_4808.jpg",
  "./IMAGES/IMG-20240611-WA0053.jpg",
  "./IMAGES/IMG-20240421-WA0006.jpg",
  "./IMAGES/IMG_3974.JPG",
  "./IMAGES/IMG_2115.jpg",
  "./IMAGES/IMG_2129.jpg",
  "./IMAGES/IMG_1393.jpg",
  "./IMAGES/IMG_9888.jpg",
  "./IMAGES/IMG-20240229-WA0038.jpg",
  "./IMAGES/IMG_0852.jpg",
  "./IMAGES/IMG_4822.jpg",
  "./IMAGES/IMG_3988.jpg",
  "./IMAGES/IMG_4581.jpg",
  "./IMAGES/IMG_2127.jpg",
  "./IMAGES/IMG_3985.jpg",
  "./IMAGES/5e821057-4736-4eaa-9767-edf704a210e4.jpg",
  "./IMAGES/IMG_2279.jpg",
  "./IMAGES/IMG-20240611-WA0048.jpg",
  "./IMAGES/IMG-20240301-WA0015.jpg",
  "./IMAGES/IMG-20240301-WA0028.jpg",
  "./IMAGES/IMG_4582.jpg",
  "./IMAGES/be61a0ac-5752-4305-979b-c443304eb956.jpg",
  "./IMAGES/IMG-20240304-WA0007.jpg",
  "./IMAGES/IMG-20240229-WA0037.jpg",
  "./IMAGES/IMG_2092.jpg",
  "./IMAGES/14d6e7ad-8179-4cd0-aa41-0692a4c8cb20.jpg",
  "./IMAGES/IMG-20240616-WA0015.jpg",
  "./IMAGES/IMG_0125.jpg",
  "./IMAGES/FullSizeRender.jpg",
  "./IMAGES/fde7f8f6-fc4f-4cd8-bd4f-4815dd791e9d.jpg",
  "./IMAGES/IMG-20240114-WA0006.jpg",
  "./IMAGES/IMG-20240211-WA0023.jpg",
  "./IMAGES/8ccf0abc-c3d2-48f2-ac2e-edeceb2d77a6.jpg",
  "./IMAGES/IMG-20240301-WA0076.jpg",
  "./IMAGES/IMG_0140.jpg",
  "./IMAGES/IMG_1921.jpg",
  "./IMAGES/IMG_1894.jpg",
  "./IMAGES/IMG-20240417-WA0004.jpg",
  "./IMAGES/IMG-20240512-WA0013.jpg",
  "./IMAGES/IMG-20240228-WA0038.jpg",
  "./IMAGES/d556236b-68ab-4e05-a2b6-42fd62bb1e16.jpg",
  "./IMAGES/IMG-20240211-WA0019.jpg",
  "./IMAGES/149d2a67-c0cc-46cb-9001-34b6c58b1791.jpg",
  "./IMAGES/IMG_0147.jpg",
  "./IMAGES/IMG_4120.jpg",
  "./IMAGES/IMG_8524.jpg",
  "./IMAGES/b5613268-8c79-46bc-821c-ce69f850b68a.jpg",
];

const VIDEOS_NO_AUDIO = [
  "./IMAGES/IMG_1894.MP4",
  "./IMAGES/IMG_0140.MP4",
  "./IMAGES/IMG_1921.MP4",
  "./IMAGES/IMG_8524.MP4",
  "./IMAGES/IMG_0147.MP4",
  "./IMAGES/IMG_3985.MP4",
  "./IMAGES/FullSizeRender.MP4",
  "./IMAGES/IMG_0125.MP4",
  "./IMAGES/IMG_4004.MP4",
  "./IMAGES/IMG_1396.MP4",
  "./IMAGES/IMG_9245.MP4",
  "./IMAGES/IMG_4833.MP4",
  "./IMAGES/IMG_9888.MP4",
  "./IMAGES/IMG_1393.MP4",
  "./IMAGES/IMG_3988.MP4",
  "./IMAGES/IMG_4822.MP4",
  "./IMAGES/IMG_4808.MP4",
  "./IMAGES/IMG_4099.MP4",
  "./IMAGES/IMG_1917.MP4",
  "./IMAGES/IMG_1900.MP4",
  "./IMAGES/IMG_4115.MP4",
  "./IMAGES/IMG_8920.MP4",
  "./IMAGES/IMG_9237.MP4",
];

const VIDEOS_WITH_AUDIO = [
  "./FAMILIA.mp4",
  "./THOMAS.mp4",
  "./ANDREA.mp4",
  "./PAPAS.MOV",
];

function getRandomItems(array, count) {
  let shuffled = [...array].sort(() => 0.5 - Math.random()); // Shuffle array
  return shuffled.slice(0, count); // Pick `count` elements
}

// Generate media sequence
const mediaSequence = [];

VIDEOS_WITH_AUDIO.forEach((videoWithAudio) => {
  // Pick 2 random images
  let selectedImages = getRandomItems(IMAGES, 2).map((img) => ({
    image: img,
    time: 3,
  }));

  // Pick 2 random videos without audio
  let selectedNoAudioVideos = getRandomItems(VIDEOS_NO_AUDIO, 2).map(
    (video) => ({ video, noAudio: true })
  );

  // Add to sequence in correct order
  mediaSequence.push(...selectedImages, ...selectedNoAudioVideos, {
    video: videoWithAudio,
  });
});

// Background music tracks
const backgroundMusic1 = "./background1.mp3";
const backgroundMusic2 = "./background2.mp3";
const outputVideo = "final_output.mp4";

const tempFiles = [];

// Helper to run ffmpeg commands asynchronously
const runFFmpeg = (command) => {
  return new Promise((resolve, reject) => {
    command.on("end", resolve).on("error", reject).run();
  });
};

// Convert images into temporary video clips
async function createImageVideos() {
  for (let i = 0; i < mediaSequence.length; i++) {
    let item = mediaSequence[i];
    if (item.image) {
      let tempVideo = `temp_image_${i}.mp4`;
      tempFiles.push(tempVideo);

      let command = ffmpeg()
        .input(item.image)
        .loop(item.time) // Set duration for the image
        .inputOptions("-framerate 1")
        .outputOptions(["-c:v libx264", "-t 3", "-vf format=yuv420p"])
        .save(tempVideo);

      await runFFmpeg(command);
    }
  }
}

// Remove audio from videos marked as `noAudio: true`
async function processVideos() {
  for (let i = 0; i < mediaSequence.length; i++) {
    let item = mediaSequence[i];
    if (item.video && item.noAudio) {
      let tempVideo = `temp_video_${i}.mp4`;
      tempFiles.push(tempVideo);

      let command = ffmpeg()
        .input(item.video)
        .outputOptions("-c:v copy", "-an") // Remove audio
        .save(tempVideo);

      await runFFmpeg(command);
      item.video = tempVideo; // Replace with the processed version
    }
  }
}

// Generate text file for FFmpeg concatenation
function generateConcatFile() {
  let concatFile = "concat_list.txt";
  let content = mediaSequence
    .map((item, i) => {
      if (item.image) return `file '${tempFiles.shift()}'`;
      if (item.video) return `file '${item.video}'`;
    })
    .join("\n");

  fs.writeFileSync(concatFile, content);
  return concatFile;
}

// Merge all image and video clips
async function mergeVideos(concatFile) {
  let command = ffmpeg()
    .input(concatFile)
    .inputOptions("-f concat", "-safe 0")
    .outputOptions("-c copy")
    .save("merged.mp4");

  await runFFmpeg(command);
}

// Add multiple background music tracks
async function addBackgroundMusic() {
  let command = ffmpeg()
    .input("merged.mp4")
    .input(backgroundMusic1) // First background track
    .input(backgroundMusic2) // Second background track
    .complexFilter([
      "[1:a]volume=0.5[a1]", // Lower volume for first background track
      "[2:a]volume=0.5[a2]", // Lower volume for second background track
      "[a1][a2]concat=n=2:v=0:a=1[bg]", // Concatenate the two background tracks
      "[0:a][bg]amix=inputs=2:duration=shortest[outa]", // Mix video and background audio
      "-map 0:v", // Keep video
      "-map [outa]", // Keep final audio
    ])
    .outputOptions("-c:v copy", "-c:a aac")
    .save(outputVideo);

  await runFFmpeg(command);
}

// Main function
(async () => {
  try {
    console.log("Generating video clips from images...");
    await createImageVideos();

    console.log("Processing videos (removing audio if necessary)...");
    await processVideos();

    console.log("Generating FFmpeg concat file...");
    let concatFile = generateConcatFile();

    console.log("Merging videos...");
    await mergeVideos(concatFile);

    console.log("Adding multiple background music tracks...");
    await addBackgroundMusic();

    console.log("Video processing completed:", outputVideo);

    // Clean up temporary files
    tempFiles.forEach((file) => fs.unlinkSync(file));
    fs.unlinkSync("merged.mp4");
    fs.unlinkSync("concat_list.txt");
  } catch (error) {
    console.error("Error:", error);
  }
})();
