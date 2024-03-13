const express = require('express');
const AttendItemRouter = express.Router();
const AttendItemController = require('../controller/attendItem.controller');


AttendItemRouter.get('/', AttendItemController.getAllAttendItem);
AttendItemRouter.post('/', AttendItemController.createAttendItem);
AttendItemRouter.post('/getAllAttendItemByMemberIdAndDate/', AttendItemController.getAllAttendItemByMemberIdAndDate);
AttendItemRouter.get('/:id', AttendItemController.getAttendItemById);
AttendItemRouter.get('/getAllAttendItemByAttendanceId/:id', AttendItemController.getAllAttendItemByAttendanceId);
AttendItemRouter.put('/:id', AttendItemController.updateAttendItem);
AttendItemRouter.post('/updateAttendItemByScheduleItemIdAndAttendanceId/', AttendItemController.updateAttendItemByScheduleItemIdAndAttendanceId);
AttendItemRouter.delete('/:id', AttendItemController.deleteAttendItem);
module.exports = AttendItemRouter;
