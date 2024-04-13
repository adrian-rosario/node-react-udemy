import mongoose from "mongoose";
import { Password } from "../util/password";

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

const userSchemea = new mongoose.Schema(
  {
    email: {
      type: String, // specific to Mongoose, referring to an actual constructor (hence cap)
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; // create id field, then delte _id
        delete ret._id;
        delete ret.password; // remote the property from the object
        delete ret.__v; // remove __v (version key)
      },
    },
  }
);

// hash password before writing to db
userSchemea.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

userSchemea.statics.build = (theAttributes: UserAttributes) => {
  return new User(theAttributes);
};

const User = mongoose.model<UserDocument, UserModel>("User", userSchemea);

export { User };
