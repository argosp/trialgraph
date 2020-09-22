module.exports = {
    generateFileName() {
        return `${Date.now()}${Math.floor(Math.random(100) * 100)}`
    },

    uploadFile(args, context) {

        return args.file.then(file => {
            const {
                createReadStream,
                filename,
                mimetype
            } = file;
            // const filename = `experts/${this.generateFileName()}`;

            const fileStream = createReadStream();
            // fileStream.pipe(fs.createWriteStream(`../../uploads/${filename}`));

            return file;
        });
    },
    deleteFileFromTmp(args, context) {
        return 'deleteFile';
    },
    moveFileFromTmpToOriginFolder(args, context) {
        return 'movefile'
    }
}