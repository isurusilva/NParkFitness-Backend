const express = require('express');
const ScheduleRouter = express.Router();
const ScheduleController = require('../controller/schedule.controller');


    ScheduleRouter.get('/', ScheduleController.getAllSchedule);
    ScheduleRouter.post('/', ScheduleController.createSchedule);
    ScheduleRouter.get('/:id', ScheduleController.getScheduleById);
    ScheduleRouter.get('/getScheduleByMemberId/:id', ScheduleController.getScheduleByMemberId);
    ScheduleRouter.get('/getAllScheduleByMemberId/:id', ScheduleController.getAllScheduleByMemberId);
    ScheduleRouter.post('/getScheduleCountByTrainerIdAndMonth/:id', ScheduleController.getScheduleCountByTrainerIdAndMonth);
    ScheduleRouter.put('/:id', ScheduleController.updateSchedule);
    ScheduleRouter.delete('/:id',ScheduleController.deleteSchedule);
    module.exports = ScheduleRouter;
