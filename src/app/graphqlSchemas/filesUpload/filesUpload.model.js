const path = require("path");
var fs = require('fs');

module.exports = {
  generateFileName() {
    return `${Date.now()}${Math.floor(Math.random(100) * 100)}`;
  },

  uploadFile(data, context) {
    return new Promise((resolve, reject) => {
      let fs = require("fs");
      let filename = data.file.filename;
      const dir = '/usr/src/app/uploads';
      //TODO: generete new file name for saving a multiple file in same name
      // filename = `argos/${this.generateFileName()}`;
        if (!fs.existsSync(dir)){
          console.log('Uploads folder was created')
          fs.mkdirSync(dir);
      }
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
              console.log('file was saved');
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
