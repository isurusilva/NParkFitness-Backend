const express = require('express');
const { upload, getFileStream } = require('../config/aws-s3');
const UserController = require('../controller/user.controller');
const User = require('../model/user.model');
const UserRouter = express.Router();

// module.exports = function (){
//     router.get('/', UserController.getAllUser);
//     router.post('/', UserController.createUser);
//     router.put('/:id', UserController.updateUser);
//     router.post('/validate', UserController.validateUser);
//     router.delete('/',UserController.deleteUser);
//     return router;
// }


UserRouter.get('/', UserController.getAllUser);
UserRouter.get('/:id', UserController.getUserById);
UserRouter.get('/findUserByBranchId/:id', UserController.findUserByBranchId);
UserRouter.get('/findUserByEmail/:email', UserController.findUserByEmail);
UserRouter.post('/findNullBranchStaff/', UserController.findNullBranchStaff);
UserRouter.post('/getPlatformCounts/', UserController.getPlatformCounts);
UserRouter.get('/removeAllStaffByBranchId/:id', UserController.removeAllStaffByBranchId);
UserRouter.post('/', UserController.createUser);
UserRouter.put('/:id', UserController.updateUser);
UserRouter.post('/validate', UserController.validateUser);
UserRouter.post('/validateUserByJWT', UserController.validateUserByJWT);
UserRouter.delete('/:id', UserController.deleteUser);
UserRouter.post('/upload', upload.single('image'), function (req, res, next) {
    // console.log(req)
    console.log(req.file)
    if (req.file == null) {
        res.status(400).send({
            'success': 'false',
            'message': 'Error in Upload User Image',
            'description': 'Error during upload image'
        });
    } else {
        var data = {
            image: req.file.location
        }
        User.update(data, {
            where: {
                id: req.body.userId,
            },
        })
            .then((user) => {
                res.send({
                    'success': 'true',
                    'data': user
                });
            })
            .catch((err) => {
                res.status(400).send({
                    'success': 'false',
                    'message': 'Error in Update User Image',
                    'description': err.message
                });
            });
    }


})
UserRouter.get('/images/:key', (req, res) => {
    console.log(req.params)
    const key = req.params.key
    const readStream = getFileStream(key)

    readStream.pipe(res)
})

module.exports = UserRouter;