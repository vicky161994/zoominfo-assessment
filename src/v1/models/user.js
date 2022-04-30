const mongoose = require("mongoose");
const { user } = require("../constants/collections");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      default: null,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    created_on: {
      type: Date,
      default: new Date(),
    },
    modified_on: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: { createdAt: "created_on", updatedAt: "modified_on" },
  }
);
module.exports = mongoose.model(user.model, userSchema, user.collection);
