const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);

exports.createExam = (req, res) => {
  const { title, school, grade, semester, question_num } = req.body;
  const d = new Date();
  d.setUTCHours(d.getUTCHours() + 9);
  conn.query(
    `INSERT INTO Exam(title, school, grade, semester, question_num, created_at) VALUES(?, ?, ?, ?, ?, ?)`,
    [title, school, grade, semester, question_num, d],
    (err, result) => {
      if(err) throw err;
      return res.status(200).json({
        insert_id: result.insertId
      })
    }
  )
}

exports.createProblem = (req, res) => {
  const { problem_num, small, activity, level, exam_id, accuracy, content } = req.body;
  conn.query(
    `INSERT INTO Problem(problem_num, small, activity, level, exam_id, accuracy, content) VALUES(?, ?, ?, ?, ?, ?, ?)`,
    [problem_num, small, activity, level, exam_id, accuracy, content],
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        message: 'success'
      })
    }
  )
}

exports.getExamList = (req, res) => {
  conn.query(
    'SELECT * FROM Exam',
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        result
      })
    }
  )
}

exports.getProblemList = (req, res) => {
  const { exam_id } = req.body;
  conn.query(
    'SELECT * FROM Problem WHERE Problem.exam_id = ? Order by problem_num ASC',
    [exam_id],
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        result
      })
    }
  )
}

exports.updateProblem = (req, res) => {
  const { problem_num, small, activity, level, exam_id, accuracy, content } = req.body;
  conn.query(
    'UPDATE Problem SET problem_num = ?, small = ?, activity = ?, level = ?, exam_id = ?, accuracy = ?, content = ? WHERE exam_id = ? and problem_num = ?',
    [problem_num, small, activity, level, exam_id, accuracy, content, exam_id, problem_num],
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        message: 'success'
      })
    }
  )
}