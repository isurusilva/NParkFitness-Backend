const express = require('express');
const ScheduleItemRouter = express.Router();
const ScheduleItemController = require('../controller/scheduleItem.controller');


ScheduleItemRouter.get('/', ScheduleItemController.getAllScheduleItem);
ScheduleItemRouter.post('/', ScheduleItemController.createScheduleItem);
ScheduleItemRouter.get('/:id', ScheduleItemController.getScheduleItemById);
ScheduleItemRouter.get('/getScheduleItemById/:id', ScheduleItemController.getScheduleItemById);
ScheduleItemRouter.get('/getScheduleItemByMemberId/:id', ScheduleItemController.getScheduleItemByMemberId);
ScheduleItemRouter.put('/:id', ScheduleItemController.updateScheduleItem);
ScheduleItemRouter.delete('/:id', ScheduleItemController.deleteScheduleItem);
module.exports = ScheduleItemRouter;
