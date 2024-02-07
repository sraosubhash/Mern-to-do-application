import taskModel from "../models/taskModel.js";
import userModel from "../models/userModel.js";
import { createTransport } from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const addTask = async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;
    const user = await userModel.find({_id: userId});
    const newTask = new taskModel({ title, description, completed: false, userId })
    newTask.save()
        .then(() => {
            sendMail(user[0].email, "Task Added", title, description)
            return (res.status(200).json({ message: "Task added successfully" }))
        })
        .catch((error) => {
            return (
                res.status(500).json({ message: error.message })
            )
        }
        )
}

const removeTask = (req, res) => {
    const { id } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid task ID" });
    }

    taskModel.deleteOne({ _id: id, userId: userId })
        .then((result) => {
            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Task not found" });
            }
            res.status(200).json({ message: "Task deleted successfully" });
        })
        .catch((error) => res.status(500).json({ message: error.message }));
}

const getTask = (req, res) => {
    taskModel.find({ userId: req.user.id })
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(501).json({ message: error.message }))
}
export { addTask, getTask,removeTask }