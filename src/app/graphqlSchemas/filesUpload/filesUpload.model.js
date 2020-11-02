const path = require("path");
module.exports = {
  generateFileName() {
    return `${Date.now()}${Math.floor(Math.random(100) * 100)}`;
  },

  uploadFile(data, context) {
    return new Promise((resolve, reject) => {
      let fs = require("fs");
      let filename = data.filename;
      // filename = `argos/${this.generateFileName()}`;
      const stream1 = data.file.createReadStream();
      stream1
        .on("error", (error) => {
          reject(error);
        })
        .pipe(
          fs
            .createWriteStream(
              path.join('/usr/src/app/uploads/', data.file.filename)
            )
            .on("error", (error) => reject(error))
            .on("finish", (res) => {
              console.log(
                "finish uploadFile im model of uploadFile Mutation. file dir path: ",
                path.join('/usr/src/app/uploads/', data.file.filename),'file: ',data.file
              );
              // __dirname, `../../uploads`, data.file.filename
              return resolve({
                path: path.join('/usr/src/app/uploads/', data.file.filename),
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
