const readline = require("readline");
const {
  checkexistence,
  removeFile,
  countwords,
  findword,
} = require("./operations.js"); // Use require for CommonJS
const { copyfile } = require("./encryptionoperation.js");
const { queries } = require("./queries.js");
const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
console.log(queries.intro);
const fullPrompt = `${queries.findfile}${queries.deletefile}${queries.copyfile.intro}${queries.copyfile.intro2}${queries.countword.intro}${queries.findword.intro}${queries.end}`;

// Prompt for file operation
const mainfunction = () => {
  r1.question(fullPrompt, (answer) => {
    if (Number(answer) === 1) {
      // If user selects option 1, ask for the file path to checkexistence
      r1.question("Enter the file path.\n", (filePath) => {
        checkexistence(filePath);
        mainfunction();
      });
    } else if (Number(answer) === 2) {
      // If user selects option 2, ask for the file path to delete
      r1.question("Enter the file path to delete.\n", async (filePath) => {
        await removeFile(filePath);
        mainfunction();
      });
    } else if (Number(answer) === 3 || Number(answer) === 4) {
      r1.question(
        queries.copyfile.sourcefiledirectory,
        (sourcefiledirectory) => {
          r1.question(queries.copyfile.sourcefilename, (sourcefilename) => {
            r1.question(
              queries.copyfile.destinationpath,
              async (destinationpath) => {
                if (Number(answer) === 3)
                  await copyfile(
                    true,
                    sourcefiledirectory,
                    sourcefilename,
                    destinationpath
                  );
                else
                  await copyfile(
                    false,
                    sourcefiledirectory,
                    sourcefilename,
                    destinationpath
                  );
                mainfunction();
              }
            );
          });
        }
      );
    } else if (Number(answer) === 5) {
      r1.question(queries.findword.path, async (filepath) => {
        await countwords(filepath);
        mainfunction();
      });
    } else if (Number(answer) === 6) {
      r1.question(queries.findword.path, (filepath) => {
        r1.question(queries.findword.word, async (word) => {
          await findword(filepath, word);
          mainfunction();
        });
      });
    } else if (Number(answer) === 7) {
      console.log(`Exiting the software...Goodbyeee!!`);
      r1.close();
    } else {
      console.log("Invalid option selected.Please try again.\n");
      mainfunction();
      r1.close();
    }
  });
};
mainfunction();
module.exports = { mainfunction };
