const mongoose = require("mongoose");
const { folder, user } = require("../constants/collections");
const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: user.model,
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
module.exports = mongoose.model(folder.model, folderSchema, folder.collection);
