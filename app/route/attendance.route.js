const express = require('express');
const AttendanceRouter = express.Router();
const AttendanceController = require('../controller/attendance.controller');


AttendanceRouter.get('/', AttendanceController.getAllAttendance);
AttendanceRouter.post('/', AttendanceController.createAttendance);
AttendanceRouter.post('/getAttendanceByMemberIdAndDate', AttendanceController.getAttendanceByMemberIdAndDate);
AttendanceRouter.post('/getAttendanceByMemberIdAndMonth', AttendanceController.getAttendanceByMemberIdAndMonth);
AttendanceRouter.post('/getAllAttendanceByBranchAndDateRange', AttendanceController.getAllAttendanceByBranchAndDateRange);
AttendanceRouter.get('/:id', AttendanceController.getAttendanceById);
AttendanceRouter.get('/getAllAttendanceByBranch/:id', AttendanceController.getAllAttendanceByBranch);
AttendanceRouter.get('/getAllAttendanceByUserId/:id', AttendanceController.getAllAttendanceByUserId);
AttendanceRouter.put('/:id', AttendanceController.updateAttendance);
AttendanceRouter.delete('/:id', AttendanceController.deleteAttendance);
module.exports = AttendanceRouter;
