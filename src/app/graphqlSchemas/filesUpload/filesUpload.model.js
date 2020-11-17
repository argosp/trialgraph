const path = require("path");
const tmpDir = "/usr/tmp/uploads";
const PermanentDIr ="/usr/src/app/uploads"
module.exports = {
  generateFileName() {
    return `${Date.now()}${Math.floor(Math.random(100) * 100)}`;
  },

  uploadFile(data) {
    return new Promise((resolve, reject) => {
      let fs = require("fs");
      let filename;
       filename = `${this.generateFileName()}${data.file.filename}`;
       //TODO: change to tmpDIr 
      const pathFile = path.join(PermanentDIr, filename);
      console.log('docker volume pathFile ',pathFile);
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

  moveFileFromTmpToPermanent(file,dir) {
    let fs = require("fs");
    const pathToFile = path.join(tmpDir, file);
    const pathToNewDestination = path.join(dir,file);
    try {
        fs.copyFileSync(pathToFile, pathToNewDestination)
        console.log("Successfully copied and moved the file!");
        return {res:"ok"};

      } catch(err) {
        throw err
      }
  },
};
