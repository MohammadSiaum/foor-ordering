// import authOptions from '../auth/[...nextauth]/route';

import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { User } from '../../../models/User';
import { authOptions } from "../authOptions/route";



export async function PUT(req) {
    mongoose.connect(process.env.MONGO_URL);
    const user = await req.json();
    const {_id, data} = user;
    
    let filter = {};
    if(_id) {
        // user
        filter = {_id};
    }
    else {
        // profile
        const session = await getServerSession(authOptions);
        // console.log({session});
        const email = session?.user?.email;
        filter = {email};
        
    }
    // console.log(filter);
    await User.updateOne(filter, data);
    
    return Response.json(true); 
}

export async function GET(req) {
    mongoose.connect(process.env.MONGO_URL);


    const url = new URL(req.url);
    const _id = url.searchParams.get('_id');

    let filterUser = {};
    if (_id) {
        filterUser = {_id};        
    }
    else {
        const session = await getServerSession(authOptions);
        const email = session?.user?.email;
        filterUser = {email};    
    }

    const user = await User.findOne(filterUser);
    return Response.json(user);



    
    
}