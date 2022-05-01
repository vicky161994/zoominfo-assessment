const { Folder } = require("../models");
const { FolderORM } = require("../orm");
const logger = require("../utils/logger");
const CODE = require("../Helper/httpResponseCode");
const MESSAGE = require("../Helper/httpResponseMessage");
const _ = require("loadsh");
const { default: mongoose } = require("mongoose");

exports.createNewFolder = async (req, res) => {
  logger.info("services::createNewFolder");
  try {
    if (_.isEmpty(req.body)) {
      return res.status(CODE.NOT_FOUND).send({ message: MESSAGE.INVALID_ARGS });
    }
    let { name } = req.body;
    const isFolderExist = await Folder.findOne({
      name: name,
      createdBy: req.user._id,
    });
    if (isFolderExist) {
      return res
        .status(CODE.ALREADY_EXIST)
        .send({ message: `Folder name ${MESSAGE.ALREADY_EXIST}` });
    }
    const trimmedData = await trimInputData({
      name,
    });
    return await FolderORM.createFolder(req, res, trimmedData);
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE.serverError });
  }
};

exports.getAllFolder = async (req, res) => {
  try {
    logger.info("Service::getAllFolder");
    let { page, limit } = req.query;
    page = page ? page : 1;
    limit = limit ? limit : 20;
    let filter = {};
    filter = {
      is_active: true,
      createdBy: req.user._id,
    };
    const skip = (parseInt(page) - 1) * limit;
    await FolderORM.getAllFolder(req, res, skip, limit, filter);
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE.INTERNAL_SERVER_ERROR });
  }
};

exports.getFolderById = async (req, res) => {
  try {
    let { folderId } = req.params;
    folderId = mongoose.Types.ObjectId(folderId);
    await FolderORM.getFolderById(req, res, folderId);
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE.INTERNAL_SERVER_ERROR });
  }
};

exports.updateFolder = async (req, res) => {
  try {
    logger.info("Service::updateFolder");
    if (_.isEmpty(req.body)) {
      return res.status(CODE.NOT_FOUND).send({ message: MESSAGE.INVALID_ARGS });
    }
    let { folderId } = req.params;
    folderId = mongoose.Types.ObjectId(folderId);
    const isFolderExists = await Folder.find({
      _id: folderId,
      createdBy: req.user._id,
    });
    if (!isFolderExists.length) {
      return res
        .status(CODE.NOT_FOUND)
        .send({ message: MESSAGE.NO_RECORD_FOUND });
    }
    let updateData = {};
    let { name } = req.body;
    updateData.name = name;
    await FolderORM.updateFolder(req, res, folderId, updateData);
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE.INTERNAL_SERVER_ERROR });
  }
};

exports.deleteFolder = async (req, res) => {
  try {
    logger.info("Service::deleteFolder");
    let { folderId } = req.params;
    folderId = mongoose.Types.ObjectId(folderId);
    if (!folderId) {
      return res.status(CODE.NOT_FOUND).send({ message: MESSAGE.INVALID_ARGS });
    }
    const isFolderExists = await Folder.find({
      _id: folderId,
      createdBy: req.user._id,
    });
    if (!isFolderExists.length) {
      return res
        .status(CODE.NOT_FOUND)
        .send({ message: MESSAGE.NO_RECORD_FOUND });
    }
    await FolderORM.deleteFolder(req, res, folderId);
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: MESSAGE.INTERNAL_SERVER_ERROR });
  }
};
