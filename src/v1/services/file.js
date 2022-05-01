const { Folder, File } = require("../models");
const { FileORM } = require("../orm");
const logger = require("../utils/logger");
const CODE = require("../Helper/httpResponseCode");
const MESSAGE = require("../Helper/httpResponseMessage");
const _ = require("loadsh");
const { default: mongoose } = require("mongoose");

exports.createNewFile = async (req, res) => {
  logger.info("services::createNewFile");
  try {
    if (_.isEmpty(req.body)) {
      return res.status(CODE.NOT_FOUND).send({ message: MESSAGE.INVALID_ARGS });
    }
    let filter = {};
    let { name, folderId } = req.body;
    filter.is_active = true;
    filter.name = name;
    filter.createdBy = req.user._id;
    if (folderId) {
      filter.folder = folderId;
    } else {
      filter.folder = { $eq: null };
    }
    const isFileExist = await File.findOne(filter);
    if (isFileExist) {
      return res
        .status(CODE.ALREADY_EXIST)
        .send({ message: `File name ${MESSAGE.ALREADY_EXIST}` });
    }
    const trimmedData = await trimInputData({
      name,
      folderId,
    });
    return await FileORM.createFile(req, res, trimmedData);
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE.serverError });
  }
};

exports.getAllFilesOfFolder = async (req, res) => {
  try {
    logger.info("Service::getAllFilesOfFolder");
    let { page, limit, folderId } = req.query;
    page = page ? page : 1;
    limit = limit ? limit : 20;
    folderId = mongoose.Types.ObjectId(folderId);
    const skip = (parseInt(page) - 1) * limit;
    await FileORM.getFilesOfFolder(req, res, skip, limit, folderId);
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE.INTERNAL_SERVER_ERROR });
  }
};

exports.getFileById = async (req, res) => {
  try {
    logger.info("Service::getFileById");
    let { fileId } = req.params;
    fileId = mongoose.Types.ObjectId(fileId);
    await FileORM.getFileById(req, res, fileId);
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE.INTERNAL_SERVER_ERROR });
  }
};

exports.updateFile = async (req, res) => {
  try {
    logger.info("Service::updateFile");
    if (_.isEmpty(req.body)) {
      return res.status(CODE.NOT_FOUND).send({ message: MESSAGE.INVALID_ARGS });
    }
    let { fileId } = req.params;
    fileId = mongoose.Types.ObjectId(fileId);
    const isFileExists = await File.find({
      _id: fileId,
      createdBy: req.user._id,
      is_active: true,
    });
    if (!isFileExists.length) {
      return res
        .status(CODE.NOT_FOUND)
        .send({ message: MESSAGE.NO_RECORD_FOUND });
    }
    let updateData = {};
    let { name, content, folderId } = req.body;
    if (name) {
      updateData.name = name;
    }
    if (content) {
      updateData.content = content;
    }
    if (folderId) {
      updateData.folder = mongoose.Types.ObjectId(folderId);
    }
    if (folderId === null) {
      updateData.folder = null;
    }
    await FileORM.updateFile(req, res, fileId, updateData);
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE.INTERNAL_SERVER_ERROR });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    logger.info("Service::deleteFile");
    let { fileId } = req.params;
    fileId = mongoose.Types.ObjectId(fileId);
    if (!fileId) {
      return res.status(CODE.NOT_FOUND).send({ message: MESSAGE.INVALID_ARGS });
    }
    const isFileExists = await File.find({
      _id: fileId,
      createdBy: req.user._id,
      is_active: true,
    });
    if (!isFileExists.length) {
      return res
        .status(CODE.NOT_FOUND)
        .send({ message: MESSAGE.NO_RECORD_FOUND });
    }
    await FileORM.deleteFile(req, res, fileId);
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE.INTERNAL_SERVER_ERROR });
  }
};
