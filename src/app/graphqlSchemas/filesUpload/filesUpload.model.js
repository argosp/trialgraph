const path = require("path");
module.exports = {
  generateFileName() {
    return `${Date.now()}${Math.floor(Math.random(100) * 100)}`;
  },

  uploadFile(data, context) {
    return new Promise((resolve, reject) => {
      let fs = require("fs");
      let filename = data.file.filename;
      //TODO: generete new file name for saving a multiple file in same name
      // filename = `argos/${this.generateFileName()}`;
      const pathFile = path.join("/usr/src/app/uploads", data.file.filename);
      const stream1 = data.file.createReadStream();
      stream1
        .on("error", (error) => {
          reject(error);
        })
        .pipe(
          fs
            .createWriteStream(pathFile)
            .on("error", (error) => reject(error))
            .on("finish", (res) => {
              console.log(
                "finish uploadFile im model of uploadFile Mutation. file dir path: ",
                pathFile
              );
              return resolve({
                path: pathFile,
                filename: data.file.filename
              });
            })
        );
    });
  },

  deleteFileFromTmp(args, context) {
    return "deleteFile";
  },
  moveFileFromTmpToOriginFolder(args, context) {
    return "movefile";
  },
};
