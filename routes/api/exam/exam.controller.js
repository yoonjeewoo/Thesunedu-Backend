const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);

exports.createExam = (req, res) => {
  const { title, school, grade, semester, question_num, school_index, grade_index, semester_index } = req.body;
  const d = new Date();
  d.setUTCHours(d.getUTCHours() + 9);
  conn.query(
    `INSERT INTO Exam(title, school, grade, semester, question_num, created_at, school_index, grade_index, semester_index) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, school, grade, semester, question_num, d, school_index, grade_index, semester_index],
    (err, result) => {
      if(err) throw err;
      return res.status(200).json({
        insert_id: result.insertId
      })
    }
  )
}

exports.createProblem = (req, res) => {
  const { problem_num, small, activity, level, exam_id, accuracy, content, big, big_index, small_index } = req.body;
  conn.query(
    `INSERT INTO Problem(problem_num, small, activity, level, exam_id, accuracy, content, big, big_index, small_index) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [problem_num, small, activity, level, exam_id, accuracy, content, big, big_index, small_index],
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
    'SELECT count(*) as current_count, E.id, E.title, E.created_at, E.question_num, E.school, E.grade FROM Problem as P join Exam as E on P.exam_id = E.id Group by E.id;',
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        result
      })
    }
  )
}

exports.getProblemList = (req, res) => {
  const { exam_id } = req.params;
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
  const { problem_num, small, activity, level, exam_id, accuracy, content, big, big_index, small_index } = req.body;
  conn.query(
    'UPDATE Problem SET problem_num = ?, small = ?, activity = ?, level = ?, exam_id = ?, accuracy = ?, content = ?, big = ?, big_index = ?, small_index = ? WHERE exam_id = ? and problem_num = ?',
    [problem_num, small, activity, level, exam_id, accuracy, content, big, big_index, small_index, exam_id, problem_num],
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        message: 'success'
      })
    }
  )
}

exports.getOneExam = (req, res) => {
  const { exam_id } = req.params;
  conn.query(
    'SELECT * FROM Exam WHERE id = ?',
    [exam_id],
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        result
      })
    }
  )
}

exports.deleteExam = (req, res) => {
  const { exam_id } = req.params;
  conn.query(
    'DELETE FROM Exam WHERE id = ?',
    [exam_id],
    (err, result) => {
      if (err) throw err;
      return res.status(200).json({
        message: 'success'
      })
    }
  )
}