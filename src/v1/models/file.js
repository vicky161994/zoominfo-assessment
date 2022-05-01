const mongoose = require("mongoose");
const { folder, user, file } = require("../constants/collections");
const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: null,
    },
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: folder.model,
      required: false,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user.model,
      default: null,
    },
    type: {
      type: String,
      default: "file",
    },
    content: {
      type: String,
      required: false,
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
module.exports = mongoose.model(file.model, fileSchema, file.collection);
