import express from 'express';
import allergy from '../../models/schema/Allergy';
import Log from '../../middlewares/Log';
import IAllergy from '../../models/IAllergy';

class AllergyController {

    public static async requestGetAll(req: express.Request, res: express.Response){
        return res.send(await AllergyController.getAll());
    }

    public static async requestGetById(req: express.Request, res: express.Response){
        return res.send(await AllergyController.getById(String(req.query.id)));
    }

    public static async requestDeleteById(req: express.Request, res: express.Response){
        return res.send(await AllergyController.deleteById(String(req.query.id)));
    }

    public static async requestCreateOne(req: express.Request, res: express.Response){
        return res.send(await AllergyController.createOne(req.body));
    }

    public static async requestUpdateById(req: express.Request, res: express.Response){
        return res.send(await AllergyController.updateById(String(req.query.id), req.body));
    }

    private static async getAll(){
        try {
            const allAllergy = await allergy.find({}).exec();
            if(!allAllergy) {
              throw new Error('No document found');
            }
            return JSON.stringify(allAllergy);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('No allergy found');
        }
    }

    private static async getById(id: string){
        try {
            const allergyFound = await allergy.findById(id).exec();
            if(!allergyFound) {
              throw new Error('No document found');
            }
            return JSON.stringify(allergyFound);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('No allergy found');
        }
    }

    public static async getByName(title:string): Promise<boolean>{
        try{
            const allergyFound = await allergy.find({"title": title}).exec();
            if(allergyFound.length === 0) {
                return false;
            } else {
                return true;
            }
        } catch(error){
            Log.error(error);

        }
    }

    private static async deleteById(id: string){
        try {
            const allergyFound = await allergy.deleteOne({ _id: id });
            if(!allergyFound) {
              throw new Error('No document found');
            }
            return JSON.stringify(JSON.stringify(allergyFound));
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot delete allergy');
        }
    }

    public static async createOne(allergyWanted: IAllergy){
        try {
            const createdAllergy = await new allergy(allergyWanted).save();
            if(!createdAllergy) {
              throw new Error('No document found');
            }
            return JSON.stringify(createdAllergy);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot create a new allergy ');
        }
    }

    private static async updateById(id: string, allergyWanted: IAllergy){
        try {
            const updatableAllergy = await allergy.findOneAndUpdate({_id: id}, allergyWanted);
            if(!updatableAllergy) {
              throw new Error('No document found');
            }
            return JSON.stringify(updatableAllergy);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot update a allergy');
        }
    }
} export default AllergyController;