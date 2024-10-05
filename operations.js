const { existsSync } = require("fs");
const fs = require("fs");
const { resolve } = require("path");
// Function to check if a file exists
const checkexistence = (filepath) => {
  if (existsSync(filepath)) {
    console.log(`File exists at this path: ${filepath}\n`);
  } else {
    console.log(`File doesn't exist.\n`);
  }
};
const removeFile = async (filepath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filepath, (err) => {
      if (err) {
        console.log(`The file doesn't exist at this path.\n`);
        reject(err);
      } else {
        console.log(`The file has been successfully deleted.\n`);
        resolve();
      }
    });
  });
};
const countwords = (filepath) => {
  return new Promise((resolve, reject) => {
    const readstream = fs.createReadStream(filepath);
    let words = 0;
    readstream.on("data", (chunk) => {
      for (let i = 0; i < chunk.length; i++) {
        if (chunk[i] === 0x20) words++; // Count spaces as word separators
      }
    });
    readstream.on("end", () => {
      // Increment the count for the last word if the file doesn't end with a space
      if (words > 0) words++;
      console.log(`The number of words in this file is: ${words}\n`);
      resolve();
    });
    readstream.on("error", (err) => {
      console.error(`Error reading file: ${err.message}\n`);
      reject(err);
    });
  });
};
const findword = (filepath, word) => {
  return new Promise((resolve, reject) => {
    const readstream = fs.createReadStream(filepath);
    let buffer = "";
    let positions = [];
    let posOffset = 0;

    readstream.on("data", (chunk) => {
      let data = buffer + chunk.toString();

      let index = data.indexOf(word);
      while (index !== -1) {
        positions.push(posOffset + index);
        index = data.indexOf(word, index + 1);
      }
      posOffset += data.length;
      buffer = data.slice(-word.length);
    });

    readstream.on("end", () => {
      if (positions.length !== 0)
        console.log(`The word "${word}" is present at positions: ${positions}`);
      else console.log(`The word "${word}" was not found.`);
      resolve();
    });

    readstream.on("error", (err) => {
      console.error(`Error reading file: ${err.message}\n`);
      reject(err);
    });
  });
};
module.exports = { checkexistence, removeFile, countwords, findword };
