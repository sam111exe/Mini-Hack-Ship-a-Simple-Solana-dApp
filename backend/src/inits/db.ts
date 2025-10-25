import mongoose, { Connection } from "mongoose";

export default async function init_db(): Promise<Connection> {
  return new Promise((resolve, reject) => {
    // ####### DB ##########
    let db = mongoose.connection;
    db.on("connected", async function () {
      // Set up indices after connection
      resolve(db);
    });

    db.on("error", function (error) {
      reject(error);
    });

    const connect_string = process.env.DB_CONNECT_STRING;
    if (!connect_string) throw new Error("DB_CONNECT_STRING not found in .env");
    //console.log("Initializing DB...", connect_string);

    mongoose.connect(connect_string, {}); // монго соединение с авторизацией
  });
}
