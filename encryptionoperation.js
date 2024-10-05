const { Transform } = require("stream");
const fs = require("fs");
const path = require("path");
const { removeFile } = require("./operations");

let size = 1;
let totallengthprocessed = 0;

class Encryption extends Transform {
  _transform(data, encoding, callback) {
    for (let index = 0; index < data.length; index++) {
      if (data[index] !== 255) data[index] += 0x12; // Simple encryption logic
    }
    totallengthprocessed += data.length;
    console.log(
      `${((totallengthprocessed / size) * 100).toFixed(2)}% encryption done.`
    );
    this.push(data); // Push the transformed data to the next stream
    callback(); // Signal that the transformation is complete
  }
}

const copyfile = async (
  isEncrypted,
  sourcedirectory,
  sourcefilename,
  destinationdirectory
) => {
  const fullsourcepath = path.join(sourcedirectory, sourcefilename);
  const fulldestinationpath = path.join(destinationdirectory, sourcefilename);

  try {
    // Wait for file size before proceeding
    const stat = await fs.promises.stat(fullsourcepath);
    size = stat.size; // Set the size for progress calculation

    const writestream = fs.createWriteStream(fulldestinationpath);
    const readstream = fs.createReadStream(fullsourcepath);
    const enc = new Encryption();

    // Set up piping based on whether encryption is needed
    if (isEncrypted) {
      readstream.pipe(enc).pipe(writestream);
    } else {
      readstream.pipe(writestream);
    }

    return new Promise((resolve, reject) => {
      writestream.on("finish", async () => {
        if (isEncrypted) {
          console.log("File encrypted and copied successfully.\n");
        } else {
          console.log("File copied successfully without encryption.\n");
        }
        await removeFile(fullsourcepath); // Remove the original file after copying
        resolve(); // Resolve the promise when done
      });

      writestream.on("error", (err) => {
        console.error("Error writing to the destination file:\n", err);
        reject(err); // Reject the promise on error
      });

      readstream.on("error", (err) => {
        console.error("Error reading the source file:\n", err);
        reject(err); // Reject if reading fails
      });
    });
  } catch (error) {
    console.error(`Error in processing the file: ${error.message}\n`);
    throw error; // Throw the error for handling in the calling function
  }
};

module.exports = { copyfile };
