const { property, merge } = require('lodash');
const filesUploadTypeDefs = require('./filesUpload.typedefs');
const { GraphQLUpload } = require('graphql-upload');


const typeResolver = {
  File: {
    filename: property('filename'),
    mimetype: property('mimetype'),
    encoding: property('encoding'),
  },
};

const resolvers = {
  // Query: {
  //   uploads: (parent, args) => {},
  //   async files(_, args, context) {
  //     return context.experiment.getfiles();
  // },
  Mutation: {
    uploadFile: (parent, args) => {
      return args.file.then(file => {
        //Contents of Upload scalar: https://github.com/jaydenseric/graphql-upload#class-graphqlupload
        //file.createReadStream() is a readable node stream that contains the contents of the uploaded file
        //node stream api: https://nodejs.org/api/stream.html
        const {createReadStream, filename, mimetype} = file;
        const fileStream = createReadStream();
        fileStream.pipe(fs.createWriteStream(`../../uploads/${filename}`));

        return file;
      });
    },
  },
};

const filesUploadResolvers = merge(resolvers, typeResolver);

module.exports = {
  filesUploadTypeDefs,
  filesUploadResolvers,
};
