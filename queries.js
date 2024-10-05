const queries = {
  intro: "This is File processing software.\n",
  findfile: "press 1:To find if a file exists at a given path/location.\n",
  deletefile: "press 2:To delete an existing file.\n",
  copyfile: {
    intro: "press 3:To shift the file with encrpytion.\n",
    intro2: "press 4:To shift the file without enryption.\n",
    sourcefiledirectory: "Enter the source file directory path.\n",
    sourcefilename: "Enter the source file name.\n",
    destinationpath: "Enter the destination path .\n",
  },
  countword: {
    intro: "press 5:To count number of words in a file.\n",
    path: "Enter the file path.\n",
  },
  findword: {
    intro: "press 6:To find specific word in a file.\n",
    path: "Enter the file path.\n",
    word: "Enter the word to find.\n",
  },
  end: "press 7:To Exit the software.\n",
};
module.exports = { queries };
