import express from 'express';
import categoryProduct from '../../models/schema/CategoryProduct';
import Log from '../../middlewares/Log';
import ICategoryProduct from '../../models/ICategoryProduct';

class CategoryProductController {
    public static async requestGetAll(req: express.Request, res: express.Response) {
        return res.send(await CategoryProductController.getAll());
    }

    public static async requestGetById(req: express.Request, res: express.Response) {
        return res.send(await CategoryProductController.getById(String(req.query.id)));
    }

    public static async requestDeleteById(req: express.Request, res: express.Response) {
        return res.send(await CategoryProductController.deleteById(String(req.query.id)));
    }

    public static async requestUpdateById(req: express.Request, res: express.Response) {
        return res.send(
            await CategoryProductController.updateById(String(req.query.id), req.body)
        );
    }

    private static async getAll() {
        try {
            const allCategoryProduct = await categoryProduct.find({}).exec();
            if (!allCategoryProduct) {
                throw new Error('No document found');
            }
            return JSON.stringify(allCategoryProduct);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('No product found');
        }
    }

    private static async getById(id: string) {
        try {
            const categoryProductFound = await categoryProduct.findById(id).exec();
            if (!categoryProductFound) {
                throw new Error('No document found');
            }
            return JSON.stringify(categoryProductFound);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('No product found');
        }
    }

    private static async deleteById(id: string) {
        try {
            const categoryProductFound = await categoryProduct.deleteOne({ _id: id });
            if (!categoryProductFound) {
                throw new Error('No document found');
            }
            return JSON.stringify(categoryProductFound);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot delete category product');
        }
    }

    private static async updateById(id: string, categoryProductWanted: ICategoryProduct) {
        try {
            const updatableCategoryProduct = await categoryProduct.findOneAndUpdate(
                { _id: id },
                categoryProductWanted
            );
            if (!updatableCategoryProduct) {
                throw new Error('No document found');
            }
            return JSON.stringify(updatableCategoryProduct);
        } catch (error) {
            Log.error(error);
            return JSON.stringify('Cannot update a category product');
        }
    }
}
export default CategoryProductController;
