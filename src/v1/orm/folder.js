const { userPopulate } = require("../constants/populate");
const { Folder, File } = require("../models");
const logger = require("../utils/logger");
const CODE = require("../Helper/httpResponseCode");
const MESSAGE = require("../Helper/httpResponseMessage");
const { serverError } = require("../constants/commonConstants");

exports.createFolder = async (req, res, payload) => {
  logger.info("ORM::createFolder");
  try {
    const newFolderData = new Folder({
      name: payload.name,
      createdBy: req.user._id,
    });
    const createdFolder = await newFolderData.save();
    return res.status(CODE.NEW_RESOURCE_CREATED).send({
      message: `Folder ${MESSAGE.CREATE_SUCCESS}`,
      data: {
        _id: createdFolder._id,
        name: createdFolder.name,
        is_active: createdFolder.is_active,
        created_on: createdFolder.created_on,
        modified_on: createdFolder.modified_on,
      },
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

exports.getAllFolder = async (req, res, skip, limit, filter) => {
  logger.info("ORM::getAllFolder");
  try {
    const folderList = await Folder.find(filter)
      .sort({ created_on: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .populate(userPopulate);
    const totalFolders = await Folder.find(filter).countDocuments();
    return res.status(CODE.EVERYTHING_IS_OK).send({
      message: MESSAGE.SUCCESSFULLY_DONE,
      data: folderList,
      totalFolders: totalFolders,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

exports.getFolderById = async (req, res, folderId) => {
  logger.info("ORM::getFolderById");
  try {
    const folderData = await Folder.find({
      _id: folderId,
      is_active: true,
      createdBy: req.user._id,
    }).populate(userPopulate);
    return res.status(CODE.EVERYTHING_IS_OK).send({
      message: MESSAGE.SUCCESSFULLY_DONE,
      data: folderData,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

exports.updateFolder = async (req, res, folderId, payload) => {
  logger.info("ORM::updateFolder");
  try {
    await Folder.findOneAndUpdate(
      { _id: folderId, createdBy: req.user._id },
      payload
    );
    return res.status(CODE.EVERYTHING_IS_OK).send({
      message: MESSAGE.UPDATE_SUCCESS,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};

exports.deleteFolder = async (req, res, folderId) => {
  logger.info("ORM::deleteFolder");
  try {
    await Folder.findOneAndUpdate(
      { _id: folderId, createdBy: req.user._id },
      {
        is_active: false,
      }
    );
    await File.updateMany(
      { folder: folderId, createdBy: req.user._id },
      {
        is_active: false,
      }
    );
    return res.status(CODE.EVERYTHING_IS_OK).send({
      message: MESSAGE.DELETE_SUCCESS,
    });
  } catch (error) {
    logger.error(error);
    return res
      .status(CODE.INTERNAL_SERVER_ERROR)
      .send({ message: serverError });
  }
};
