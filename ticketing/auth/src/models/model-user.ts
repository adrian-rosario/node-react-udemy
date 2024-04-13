import mongoose from "mongoose";

// for type checking of attributes when we create a new user
// ie. we can't accidentally mangle the propertie w/o type checks complaining
interface UserAttributes {
  email: string;
  password: string;
}

// describes the properties a User model has
interface UserModel extends mongoose.Model<UserDocument> {
  build(theAttribues: UserAttributes): UserDocument;
}

// describes User document (in mongodb) properties
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

const userSchemea = new mongoose.Schema({
  email: {
    type: String, // specific to Mongoose, referring to an actual constructor (hence cap)
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

userSchemea.statics.build = (theAttributes: UserAttributes) => {
  return new User(theAttributes);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchemea);

export { User };
