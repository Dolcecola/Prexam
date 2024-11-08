import {MongoClient, ObjectId} from "mongodb";
import { personaModel, reviewModel, videoModel } from "./tps.ts";
import { BookModel, UserModel } from "./tps.ts";
import { fromModelToUser } from "./uts.ts";

//const MONGO_URL = "mongodb+srv://alex11703:cocinero11@cluster0.h7shi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL) {
    console.error("MONGO_URL is not set");
    Deno.exit(1);
  }

const client = new MongoClient(MONGO_URL);
await client.connect();
console.info("DB connected");

const db = client.db("PruebaDB");


//const collection = db.collection<personaModel>("personas");
//const videos = db.collection<videoModel>("videos");
const usersCollection = db.collection<UserModel>("users");
const booksCollection = db.collection<BookModel>("books");
const reviewsCollection = db.collection<reviewModel>("review");

const handler = async (req: Request): Promise<Response> => {
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;

    if(method === "GET"){
        if(path === "/users"){
            //const pers = await collection.find().toArray();
            //return new Response(JSON.stringify(pers));
            const usersDB = await usersCollection.find().toArray();
            console.log("Usuarios en la base de datos:", usersDB);
            const users = await Promise.all(
              usersDB.map((u) => fromModelToUser(u, booksCollection, reviewsCollection))
            );
            return new Response(JSON.stringify(users));
        }
    } else if(method === "POST"){
        if(path === "/user"){
            const bd = await req.json();

            if(!bd.name || !bd.age || !bd.email || !bd.books){
                return new Response("Bad request", { status: 400});
            }

            const {insertedId} = await usersCollection.insertOne({
                name: bd.name,
                email: bd.email,
                age: bd.age,
                books: []
            });

            return new Response("Good Request");
        }
    } else if(method === "PUT"){
        if(path === "/book"){
            const t = url.searchParams.get("title");
            if(t){
                const pages = 666;

            const {modifiedCount} = await booksCollection.updateOne(
                {title: t},
                {$set: {pages}}
            );

            return new Response("Update")
            }   
        }
    } else if(method === "DELETE"){
        if(path === "/review"){
            const id = url.searchParams.get("id")

            if(id){
                const {deletedCount} = await reviewsCollection.deleteOne({
                    _id: new ObjectId(id)
                });

                if(deletedCount === 0){
                    return new Response("Bad request");
                }
                return new Response("Eliminado");
            }
        }
    }

    return new Response("Endpoint not found", {status: 400})
}

Deno.serve({port: 3000}, handler);