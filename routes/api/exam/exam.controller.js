const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const config = require('../../../config');
const conn = mysql.createConnection(config);

exports.getResult = (req, res) => {
	// console.log('asdf');
	conn.query(
		`SELECT Problem.problem_num as problem_num, activity, content, level, result, accuracy FROM Result join Problem on Problem.exam_id = Result.test_id WHERE Problem.exam_id = ${req.query.exam_id} and Result.problem_num = Problem.problem_num and Result.student_name = '${req.query.student_name}';`,
		(err, result) => {
			if (err) throw err;
	    return res.status(200).json({
	    	result
	    })
		}
	)

}

// SELECT A.level, A.level_cnt, A.avg, B.level, B.level_cnt, B.avg FROM (SELECT level, count(*) as level_cnt, avg(accuracy) as avg FROM (SELECT exam_id, R.problem_num, activity, small, level, result, accuracy, student_name, school FROM (SELECT exam_id, problem_num, activity, small, `level`, accuracy FROM Exam join Problem on Exam.id = Problem.exam_id WHERE Exam.id = 64 ORDER BY problem_num) as P join Result as R on P.exam_id = R.test_id WHERE student_name = '이정현' and P.problem_num = R.problem_num) as T GROUP BY level) as A , (SELECT level, count(*) as level_cnt, avg(accuracy) as avg FROM (SELECT exam_id, R.problem_num, activity, small, level, result, accuracy, student_name, school FROM (SELECT exam_id, problem_num, activity, small, `level`, accuracy FROM Exam join Problem on Exam.id = Problem.exam_id WHERE Exam.id = 64 ORDER BY problem_num) as P join Result as R on P.exam_id = R.test_id WHERE student_name = '이정현' and P.problem_num = R.problem_num) as T WHERE result='O' GROUP BY level) as B WHERE A.level = B.level;
exports.levelResult = (req, res) => {
	final = []
	conn.query(
		`SELECT A.level as AL, A.level_cnt as ALC, A.avg as AAVG, B.level as BL, B.level_cnt as BLC, B.avg as BAVG FROM (SELECT level, count(*) as level_cnt, avg(accuracy) as avg FROM (SELECT exam_id, R.problem_num, activity, small, level, result, accuracy, student_name, school FROM (SELECT exam_id, problem_num, activity, small, level, accuracy FROM Exam join Problem on Exam.id = Problem.exam_id WHERE Exam.id = ${req.query.exam_id} ORDER BY problem_num) as P join Result as R on P.exam_id = R.test_id WHERE student_name = '${req.query.student_name}' and P.problem_num = R.problem_num) as T GROUP BY level) as A left join (SELECT level, count(*) as level_cnt, avg(accuracy) as avg FROM (SELECT exam_id, R.problem_num, activity, small, level, result, accuracy, student_name, school FROM (SELECT exam_id, problem_num, activity, small, level, accuracy FROM Exam join Problem on Exam.id = Problem.exam_id WHERE Exam.id = ${req.query.exam_id} ORDER BY problem_num) as P join Result as R on P.exam_id = R.test_id WHERE student_name = '${req.query.student_name}' and P.problem_num = R.problem_num) as T WHERE result='O' GROUP BY level) as B on A.level = B.level;`,
		(err, result) => {
			if (err) throw err;
			result.forEach((e) =>{
				if (e.BL == null) {
					final.push({ 'subject' : e.AL, '문항수' : e.ALC, '정답률' : 0, '평균' : (e.AAVG).toPrecision(3) })
				} else {
					final.push({ 'subject' : e.AL, '문항수' : e.ALC, '정답률' : ((e.BLC/e.ALC)*100).toPrecision(3), '평균' : (e.AAVG).toPrecision(3) })
				}	
			})
	    return res.status(200).json({
	    	final
	    })
		}
	)
}
exports.createExam = (req, res) => {
  const { title, school, grade, semester, question_num, school_index, grade_index, semester_index, writer} = req.body;
  const d = new Date();
  d.setUTCHours(d.getUTCHours() + 9);
  conn.query(
	`INSERT INTO Exam(title, school, grade, semester, question_num, created_at, school_index, grade_index, semester_index, writer) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
	[title, school, grade, semester, question_num, d, school_index, grade_index, semester_index, writer],
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
	'SELECT count(P.id) as current_count, E.id, E.title, E.created_at, E.question_num, E.school, E.grade, E.writer FROM Exam as E left join Problem as P on P.exam_id = E.id Group by E.id;',
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

exports.saveResult = (req, res) => {
	const { name, grade, school, selectedId, selected } = req.body;
	let answer = selected.split('');
	// console.log(answer);
	for (let i=0; i<answer.length; i++) {
		conn.query(
			'INSERT INTO Result(student_name, grade, test_id, school, result, problem_num) VALUES(?, ?, ?, ?, ?, ?)',
			[name, grade, selectedId, school, answer[i], i+1],
			(err) => {
				if (err) throw err;
			}
		)
	}
	return res.status(200).json({
		message: 'success'
	})

};

exports.activityResult = (req, res) => {
	final = []
	conn.query(
		`SELECT A.activity as AL, A.activity_cnt as ALC, A.avg as AAVG, B.activity as BL, B.activity_cnt as BLC, B.avg as BAVG FROM (SELECT activity, count(*) as activity_cnt, avg(accuracy) as avg FROM (SELECT exam_id, R.problem_num, activity, small, level, result, accuracy, student_name, school FROM (SELECT exam_id, problem_num, activity, small, level, accuracy FROM Exam join Problem on Exam.id = Problem.exam_id WHERE Exam.id = ${req.query.exam_id} ORDER BY problem_num) as P join Result as R on P.exam_id = R.test_id WHERE student_name = '${req.query.student_name}' and P.problem_num = R.problem_num) as T GROUP BY activity) as A left join (SELECT activity, count(*) as activity_cnt, avg(accuracy) as avg FROM (SELECT exam_id, R.problem_num, activity, small, level, result, accuracy, student_name, school FROM (SELECT exam_id, problem_num, activity, small, level, accuracy FROM Exam join Problem on Exam.id = Problem.exam_id WHERE Exam.id = ${req.query.exam_id} ORDER BY problem_num) as P join Result as R on P.exam_id = R.test_id WHERE student_name = '${req.query.student_name}' and P.problem_num = R.problem_num) as T WHERE result='O' GROUP BY activity) as B on A.activity = B.activity`,
		(err, result) => {
			if (err) throw err;
			result.forEach((e) =>{
				if (e.BL == null) {
					final.push({ 'subject' : e.AL,'문항수' : e.ALC, '정답률' : 0, '평균' : (e.AAVG).toPrecision(3) })
				} else {
					final.push({ 'subject' : e.AL,'문항수' : e.ALC, '정답률' : ((e.BLC/e.ALC)*100).toPrecision(3), '평균' : (e.AAVG).toPrecision(3) })
				}
			})
	    return res.status(200).json({
	    	final
	    })
		}
	)
}

exports.smallResult = (req, res) => {
	final = []
	conn.query(
		`SELECT A.small as AL, A.activity_cnt as ALC, A.avg as AAVG, B.small as BL, B.activity_cnt as BLC, B.avg as BAVG FROM (SELECT small, count(*) as activity_cnt, avg(accuracy) as avg FROM (SELECT exam_id, R.problem_num, activity, small, level, result, accuracy, student_name, school FROM (SELECT exam_id, problem_num, activity, small, level, accuracy FROM Exam join Problem on Exam.id = Problem.exam_id WHERE Exam.id = ${req.query.exam_id} ORDER BY problem_num) as P join Result as R on P.exam_id = R.test_id WHERE student_name = '${req.query.student_name}' and P.problem_num = R.problem_num) as T GROUP BY small) as A left join (SELECT small, count(*) as activity_cnt, avg(accuracy) as avg FROM (SELECT exam_id, R.problem_num, activity, small, level, result, accuracy, student_name, school FROM (SELECT exam_id, problem_num, activity, small, level, accuracy FROM Exam join Problem on Exam.id = Problem.exam_id WHERE Exam.id = ${req.query.exam_id} ORDER BY problem_num) as P join Result as R on P.exam_id = R.test_id WHERE student_name = '${req.query.student_name}' and P.problem_num = R.problem_num) as T WHERE result='O' GROUP BY small) as B on A.small = B.small`,
		(err, result) => {
			if (err) throw err;
			result.forEach((e) =>{
				if (e.BL == null) {
					final.push({ 'subject' : e.AL,'문항수' : e.ALC, '정답률' : 0, '평균' : (e.AAVG).toPrecision(3) })
				} else {
					final.push({ 'subject' : e.AL,'문항수' : e.ALC, '정답률' : ((e.BLC/e.ALC)*100).toPrecision(3), '평균' : (e.AAVG).toPrecision(3) })
				}
			})
	    return res.status(200).json({
	    	final
	    })
		}
	)
}



