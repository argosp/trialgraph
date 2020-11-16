const path = require("path");

module.exports = {
  generateFileName() {
    return `${Date.now()}${Math.floor(Math.random(100) * 100)}`;
  },

  uploadFile(data, context) {
    return new Promise((resolve, reject) => {
      let fs = require("fs");
      const dir = '/usr/src/app/uploads';
      let filename = `${this.generateFileName()}${data.file.filename}`;
        if (!fs.existsSync(dir)){
          console.log('Uploads folder was created')
          fs.mkdirSync(dir);
      }
     
      const pathFile = path.join("/usr/tmp/uploads", filename);
        console.log('docker volume pathFile ',pathFile);
    // TODO -> move to submitExperiment save function
    // const pathFile = path.join("/usr/src/app/uploads", data.file.filename);
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
              console.log('file was saved' ,'uploads/'+filename);
              return resolve({
                path: 'uploads/'+filename,
                filename: filename
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
