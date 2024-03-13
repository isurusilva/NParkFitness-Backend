const Goal = require("../model/goal.model");
const Membership = require("../model/membership.model");

//Register a Goal | guest
exports.createGoal = async (req, res) => {
    if (req.body) {
        console.log("Create goal");
        Goal.create(req.body)
            .then((goal) => {
                res.send({
                    'success': 'true',
                    'data': goal
                });
            })
            .catch((err) => {
                res.status(400).send({
                    'success': 'false',
                    'message': 'Error in Create Goal',
                    'description': err.message
                });
            });
    }
}


//update Goal Details
exports.updateGoal = async (req, res) => {
    if (req.body) {
        if (!req.params.id) return res.status(500).send("Id is missing");
        let id = req.params.id;
        Goal.update(req.body, {
            where: {
                id: id,
            },
        })
            .then((goal) => {
                res.status(200).send({
                    'success': goal[0] == 1 ? 'true' : 'false',
                    'data': goal[0] == 1 ? "Updated Successfully" : "Update Not Successful"
                });
            })
            .catch((err) => {
                res.status(400).send({
                    'success': 'false',
                    'message': 'Error in Update Goal',
                    'description': err.message
                });
            });
    }
}


//get All Goal
exports.getAllGoal = (req, res) => {
    console.log("get All");
    Goal.findAll().then((goal) => {
        res.send({
            'success': 'true',
            'data': goal
        });
    })
        .catch((err) => {
            res.status(400).send({
                'success': 'false',
                'message': 'Error in Getting All Goal',
                'description': err.message
            });
        });
}

//get Goal By Id
exports.getGoalById = (req, res) => {
    console.log("get All");
    Goal.findOne({
        where: {
            id: req.params.id
        },
        include: {
            model: Membership
        }
    }).then((goal) => {
        res.send({
            'success': 'true',
            'data': goal
        });
    })
        .catch((err) => {
            res.status(400).send({
                'success': 'false',
                'message': 'Error in Getting Goal By ID',
                'description': err.message
            });
        });
}

//get Goal By MemberId
exports.getGoalByMemberId = (req, res) => {
    console.log("get Goal By MemberId");
    Goal.findOne({
        where: {
            membershipId: req.params.id
        }
    }).then((goal) => {
        res.send({
            'success': 'true',
            'data': goal
        });
    })
        .catch((err) => {
            res.status(400).send({
                'success': 'false',
                'message': 'Error in Getting Goal By ID',
                'description': err.message
            });
        });
}

//delete Goal
exports.deleteGoal = async (req, res) => {
    console.log("Delete goal");
    Goal.destroy({
        where: {
            id: req.params.id
        }
    })
        .then((goal) => {
            console.log(goal)
            res.status(200).send({
                'success': goal == 1 ? 'true' : 'false',
                'data': goal == 1 ? "Deleted Successfully" : "Delete Not Successful"
            });
        })
        .catch((err) => {
            res.status(400).send({
                'success': 'false',
                'message': 'Error in Delete Goal',
                'description': err.message
            });
        });
}
