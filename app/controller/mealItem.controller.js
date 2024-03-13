const MealItem = require("../model/mealItem.model");
const DietPlan = require("../model/dietPlan.model");

//Register a MealItem | guest
exports.createMealItem = async (req, res) => {
    if (req.body) {
        console.log("Create mealItem");
        MealItem.create(req.body)
            .then((mealItem) => {
                res.send({
                    'success': 'true',
                    'data': mealItem
                });
            })
            .catch((err) => {
                res.status(400).send({
                    'success': 'false',
                    'message': 'Error in Create MealItem',
                    'description': err.message
                });
            });
    }
}


//update MealItem Details
exports.updateMealItem = async (req, res) => {
    if (req.body) {
        if (!req.params.id) return res.status(500).send("Id is missing");
        let id = req.params.id;
        MealItem.update(req.body, {
            where: {
                id: id,
            },
        })
            .then((mealItem) => {
                res.status(200).send({
                    'success': mealItem[0] == 1 ? 'true' : 'false',
                    'data': mealItem[0] == 1 ? "Updated Successfully" : "Update Not Successful"
                });
            })
            .catch((err) => {
                res.status(400).send({
                    'success': 'false',
                    'message': 'Error in Update MealItem',
                    'description': err.message
                });
            });
    }
}


//get All MealItem
exports.getAllMealItem = (req, res) => {
    console.log("get All");
    MealItem.findAll().then((mealItem) => {
        res.send({
            'success': 'true',
            'data': mealItem
        });
    })
        .catch((err) => {
            res.status(400).send({
                'success': 'false',
                'message': 'Error in Getting All MealItem',
                'description': err.message
            });
        });
}

//get MealItem By Id
exports.getMealItemById = (req, res) => {
    console.log("get All");
    MealItem.findOne({
        where: {
            id: req.params.id
        },
        include: {
            model: DietPlan
        }
    }).then((mealItem) => {
        res.send({
            'success': 'true',
            'data': mealItem
        });
    })
        .catch((err) => {
            res.status(400).send({
                'success': 'false',
                'message': 'Error in Getting MealItem By ID',
                'description': err.message
            });
        });
}

//delete MealItem
exports.deleteMealItem = async (req, res) => {
    console.log("Delete mealItem");
    MealItem.destroy({
        where: {
            id: req.params.id
        }
    })
        .then((mealItem) => {
            console.log(mealItem)
            res.status(200).send({
                'success': mealItem == 1 ? 'true' : 'false',
                'data': mealItem == 1 ? "Deleted Successfully" : "Delete Not Successful"
            });
        })
        .catch((err) => {
            res.status(400).send({
                'success': 'false',
                'message': 'Error in Delete MealItem',
                'description': err.message
            });
        });
}
