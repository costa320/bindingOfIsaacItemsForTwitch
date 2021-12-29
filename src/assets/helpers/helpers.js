// file system module to perform file operations
const fs = require("fs");

exports.WriteToFile = (filename, jsonContent) => {
  fs.writeFile(filename, JSON.stringify(jsonContent), "utf8", function (err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }

    console.log("JSON file has been saved.");
  });
};
