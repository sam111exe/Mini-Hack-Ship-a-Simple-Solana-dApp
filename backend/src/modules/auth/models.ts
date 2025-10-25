/*
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// User schema for MongoDB
const user_schema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const auth_profile_schema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  user_id: { type: String, required: true },
  provider: { type: String, required: true },
  login: { type: String, required: true },
  meta: {
    token: String,
    token_info: {
      iss: String,
      sub: String,
      azp: String,
      aud: String,
      iat: String,
      exp: String,
      email: String,
      email_verified: String,
      name: String,
      picture: String,
      given_name: String,
      family_name: String,
      nbf: String,
      jti: String,
      alg: String,
      kid: String,
      typ: String
    }
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

export const User = mongoose.model("User", user_schema);
export const AuthProfile = mongoose.model("AuthProfile", auth_profile_schema);
* **/
