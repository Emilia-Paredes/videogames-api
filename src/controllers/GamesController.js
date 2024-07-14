import mongoose from "mongoose"
import * as fs from 'fs'

const schema = new mongoose.Schema({
  name: String,
  img: String,
  levels: Number,
  date: Date
}, {
  versionKey: false
})

const GameModel = new mongoose.model('games', schema)

export const getGames = async (req, res) => {
  try {
    const { id } = req.params
    const rows = (id === undefined) ? await GameModel.find() : await GameModel.findById(id)
    return res.status(200).json({ status: true, data: rows })
  } catch (error) {
    return res.status(500).json({ status: false, errors: [error] })
  }
}

export const saveGame = async (req, res) => {
  try {
    const { name, levels, date } = req.body
    const validation = validate(name, levels, date, req.file, 'Y')
    if (validation == '') {
      const newGame = new GameModel({
        name: name,
        levels: levels,
        date: date,
        img: '/uploads/' + req.file.filename
      })
      return await newGame.save().then(() => {
        res.status(200).json({ status: true, message: 'Juego guardado' })
      })
    } else {
      return res.status(400).json({ status: false, errors: validation })
    }
  } catch (error) {
    return res.status(500).json({ status: false, errors: [error.message] })
  }
}

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params
    const { name, levels, date } = req.body
    let img = ''
    let values = { name: name, levels: levels, date: date }
    if (req.file != null) {
      img = '/uploads/' + req.file.filename
      values = { name: name, levels: levels, date: date, img: img }
      await deleteImage(id)
    }
    const validation = validate(name, levels, date)
    if (validation == '') {
      await GameModel.updateOne({ _id: id }, { $set: values })
      return res.status(200).json({ status: true, message: 'Juego actualizado' })
    } else {
      return res.status(400).json({ status: false, errors: validation })
    }
  } catch (error) {
    return res.status(500).json({ status: false, errors: [error.message] })
  }
}

export const deleteGame = async (req, res) => {
  try {
    const { id } = req.params
    await deleteImage(id)
    await GameModel.deleteOne({ _id: id })
    return res.status(200).json({ status: true, message: 'Juego eliminado' })
  } catch (error) {
    return res.status(500).json({ status: false, errors: [error.message] })
  }
}

const deleteImage = async (id) => {
  const game = await GameModel.findById(id)
  const img = game.img
  fs.unlinkSync('./public/' + img)
}

const validate = (name, levels, date, img, validated) => {
  let errors = []
  if (name === undefined || name.trim() === '') {
    errors.push('El nombre NO debe estar vacío')
  }
  if (levels === undefined || levels.trim() === '' || isNaN(levels)) {
    errors.push('El número de niveles NO debe estar vacío y debe ser numérico')
  }
  if (date === undefined || date.trim() === '' || isNaN(Date.parse(date))) {
    errors.push('La fecha No debe estar vacía y debe ser una fecha válida')
  }
  if (validated === 'Y' && img === '') {
    errors.push('Selecciona una imagen en formato jpg o png')
  }
  else {
    if (errors != '') {
      fs.unlinkSync('./public/uploads/' + img.filename)
    }
  }
  return errors
}