/**
 * Define Sprint model
 * @author Léo Delpon <leo.delpon@viacesi.fr>
 */

import { Schema } from 'mongoose';
import mongoose from '../../providers/Database';
import IPartner from '../IPartner';

// Define the Project schema for mongo
export const PartnerSchema = new mongoose.Schema({
    name: {
        trim: true,
        type: String,
        required: true,
        lowercase: true
    }, // Name of the project
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    address: {
        trim: true,
        type: String,
        required: true,
        maxLength: 255
    },
    phone: {
        trim: true,
        type: String,
        required: true,
        maxLength: 255
    },
    siren: {
        trim: true,
        type: String,
        required: true,
        maxLength: 90
    },
    activity: {
        trim: true,
        type: String,
        required: true,
        maxLength: 90
    },
    firstname: {
        type: String,
        required: true,
        maxLength: 255
    },
    lastname: {
        type: String,
        required: true,
        maxLength: 255
    },
    email: {
        type: String,
        required: true,
        maxLength: 255
    },
    userId: {
        type: String,
        required: false,
        maxLength: 255
    },
    restaurants: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Restaurant', required: true }],
        required: false,
        maxLength: 255
    },
    status: {
        type: String,
        required: false,
        maxLength: 255
    }
});

const Partner = mongoose.model<IPartner>('Sprint', PartnerSchema);

export default Partner;
