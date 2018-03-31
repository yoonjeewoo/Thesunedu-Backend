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
        message: 'success'
      })
    }
  )
}

exports.createProblem = (req, res) => {
  const { problem_num, small, activity, level, exam_id } = req.body;
  conn.query(
    `INSERT INTO Problem(problem_num, small, activity, level, exam_id) VALUES(?, ?, ?, ?, ?)`,
    [problem_num, small, activity, level, exam_id],
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        message: 'success'
      })
    }
  )
}