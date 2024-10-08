import { validationResult } from "express-validator";
import { School } from "../models/createSchool.mjs";

const createSchool = async (req, res) => {
  try {
    const result = validationResult(req);
    console.log(result)
    if(!result.isEmpty()){
        return res.status(400).send({message:result.array()})
    }
    const newSchool = await School.create(req.body);
    return res.status(201).send({ success: true, message: newSchool });
  } catch (e) {
    console.error(e);
    return res.status(400).send({ success: false });
  }
};

const getAllSchool = async (req, res) => {
  try {
    console.log('db started sc')
    const allSchool = await School.find();
    console.log('db completed sc')
    return res.status(201).send({ success: true, message: allSchool });
  } catch (e) {
    console.error(e);
    return res.status(400).send({ success: false });
  }
};

const listSchool = async (req, res) => {
  
  try {
    //   // Find schools near the user location and sort by distance
    const userLatitude = parseFloat(req.query.latitude);
    const userLongitude = parseFloat(req.query.longitude);

   console.log('db started')
        const schools = await School.aggregate([
            {
                $addFields: {
                    distance: {
                        $sqrt: {
                            $add: [
                                { $pow: [{ $subtract: ["$latitude", userLatitude] }, 2] },
                                { $pow: [{ $subtract: ["$longitude", userLongitude] }, 2] }
                            ]
                        }
                    }
                }
            },
            { $sort: { distance: 1 } }
        ]);
        console.log('db completed')
        res.status(200).json(schools);
    // }
  }catch (err) {
    console.error('Failed to list',err);
  }
};

export {createSchool,listSchool,getAllSchool};