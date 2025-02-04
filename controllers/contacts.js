const { Contact } = require('../models/contact');
const { HttpError, ctrlWrapper } = require('../helpers');

// const fs = require('fs/promises');
// const path = require('path');
// const contactsDir = path.join(__dirname, '../', 'public', 'contacts');

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, 'name email phone favorite', { skip, limit }).populate('owner', 'email subscription');
  res.json(result);
};
const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findOne({ _id: id, owner: req.user.id });
  // const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404, 'Contact not found');
  }
  res.json(result);
};
const add = async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  // const { path: tempUpload, originalname } = req.file;
  // const resultUpload = path.join(contactsDir, originalname);
  // await fs.rename(tempUpload, resultUpload);
  // const avatarURL = path.join('public', 'contacts');

  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};
const updateById = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  if (!body) {
    return res.status(400).json({ message: 'missing fields' });
  }
  // const result = await Contact.findByIdAndUpdate(id, { owner: req.user.id }, req.body, { new: true });
  const result = await Contact.findOneAndUpdate({ _id: id, owner: req.user.id }, { $set: req.body }, { new: true });
  // if (!result || result.owner !== req.user.id) {
  if (!result) {
    throw HttpError(404, 'Contact not found');
  }
  res.status(200).json(result);
};
const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  if (!body) {
    return res.status(400).json({ message: 'missing field favorite' });
  }
  const result = await Contact.findOneAndUpdate({ _id: id, owner: req.user.id }, { $set: req.body }, { new: true });
  // if (!result || result.owner !== req.user.id) {
  if (!result) {
    throw HttpError(404, 'Contact not found');
  }
  res.status(200).json(result);
};
const deleteById = async (req, res) => {
  const { id } = req.params;
  // const result = await Contact.findByIdAndRemove(id, { owner: req.user.id });
  const result = await Contact.findOneAndRemove({ _id: id, owner: req.user.id });
  if (!result) {
    throw HttpError(404, 'Contact not found');
  }
  res.status(200).json({ message: 'Contact deleted' });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  updateFavorite: ctrlWrapper(updateFavorite),
  deleteById: ctrlWrapper(deleteById),
};
