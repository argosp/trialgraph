const { property, merge } = require("lodash");
const filesUploadTypeDefs = require("./filesUpload.typedefs");
const uploadModel = require("./filesUpload.model");

const typeResolver = {
  File: {
    filename: property("filename"),
    mimetype: property("mimetype"),
    encoding: property("encoding"),
    path: property("path"),
  },
};

const resolvers = {
  Mutation: {
    async uploadFile(_, args, context) {
      return args.file.then(async (file) => {
        const fileRes = await uploadModel.uploadFile({ file });
        return fileRes;
      });
    },
    async moveFile(_, args, context) {
      try {
        return await uploadModel.moveFileFromTmpToOriginFolder(args, context);
      } catch (err) {
        console.log("not moved");
        return "err";
      }
    },
  },
};

const filesUploadResolvers = merge(resolvers, typeResolver);

module.exports = {
  filesUploadTypeDefs,
  filesUploadResolvers,
};
