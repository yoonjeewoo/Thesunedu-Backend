const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);

exports.createActivity = (req, res) => {
  const { activity } = req.body;
  conn.query(
    'INSERT INTO Activity(name) VALUES(?)',
    [activity],
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        message: 'success'
      })
    }
  )
}

exports.getActivityList = (req, res) => {
  conn.query(
    'SELECT DISTINCT name FROM Activity',
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        result
      })
    }
  )
}

exports.createLevel = (req, res) => {
  const { level } = req.body;
  conn.query(
    'INSERT INTO Level(name) VALUES(?)',
    [level],
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        message: 'success'
      })
    }
  )
}

exports.getLevelList = (req, res) => {
  conn.query(
    'SELECT DISTINCT name FROM Level',
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        result
      })
    }
  )
}