const express = require('express');
const DashboardRouter = express.Router();
const DashboardController = require('../controller/dashboard.controller');


DashboardRouter.get('/getBranchMemberCount/:id', DashboardController.getBranchMemberCount);
DashboardRouter.get('/getBranchServiceCount/:id', DashboardController.getBranchServiceCount);
DashboardRouter.get('/getBranchStaffCount/:id', DashboardController.getBranchStaffCount);
DashboardRouter.get('/getBranchExpiredMemberCount/:id', DashboardController.getBranchExpiredMemberCount);
DashboardRouter.get('/getBranchAttendanceCount/:id', DashboardController.getBranchAttendanceCount);
DashboardRouter.get('/getBranchTotalIncome/:id', DashboardController.getBranchTotalIncome);
DashboardRouter.get('/getGymTotalIncome/:id', DashboardController.getGymTotalIncome);
DashboardRouter.get('/getGymRawMonthlyTotalIncome/:id', DashboardController.getGymRawMonthlyTotalIncome);
DashboardRouter.get('/getBranchRawMonthlyTotalIncome/:id', DashboardController.getBranchRawMonthlyTotalIncome);
DashboardRouter.get('/getManagerDashboardData/:id', DashboardController.getManagerDashboardData);

DashboardRouter.get('/getGymMemberCount/:id', DashboardController.getGymMemberCount);
DashboardRouter.get('/getOwnerDashboardData/:id', DashboardController.getOwnerDashboardData);
DashboardRouter.get('/getBranchMonthIncome/:id', DashboardController.getBranchMonthIncome);
DashboardRouter.get('/getOneBranchMonthIncome/:id', DashboardController.getOneBranchMonthIncome);
DashboardRouter.get('/getAdminDashboardData', DashboardController.getAdminDashboardData);


DashboardRouter.post('/getAssignedBranchMemberCount/:id', DashboardController.getAssignedBranchMemberCount);
DashboardRouter.get('/getLatestMemberDetails/:id', DashboardController.getLatestMemberDetails);
DashboardRouter.get('/getHasADietPlan/:id', DashboardController.getHasADietPlan);

DashboardRouter.post('/getMemberDetails/:id', DashboardController.getMemberDetails);



// DashboardRouter.post('/', DashboardController.createDashboard);
// DashboardRouter.post('/getDashboardByMemberIdAndDate', DashboardController.getDashboardByMemberIdAndDate);
// DashboardRouter.get('/:id', DashboardController.getDashboardById);
// DashboardRouter.get('/getAllDashboardByUserId/:id', DashboardController.getAllDashboardByUserId);
// DashboardRouter.put('/:id', DashboardController.updateDashboard);
// DashboardRouter.delete('/:id', DashboardController.deleteDashboard);
module.exports = DashboardRouter;
