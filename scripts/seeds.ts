import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import * as path from "path";
import { ROUTES } from "../src/lib/data";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB = process.env.MONGODB_DB || "airline_app_db";

async function seed()
{
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db(MONGODB_DB);

    const collections = await db.listCollections().toArray();
    for (const col of collections) {
        await db.dropCollection(col.name);
    }

    const WEEKS = 4;
    const today = new Date();
    const flights: any[] = [];

    const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    for (let dayCounter = 0; dayCounter < WEEKS * 7; dayCounter++) {
        const date = new Date(today);
        date.setDate(today.getDate() + dayCounter);

        const weekDay = WEEK_DAYS[date.getDay()];

        for (const route of ROUTES) {
            if (!route.operatingDays.includes(weekDay)) continue;

            const [hours, minutes] = route.departureTime.split(":").map(Number);

            const departureTime = new Date(date);
            departureTime.setHours(hours, minutes, 0,0);

            const arrivalTime = new Date(departureTime);
            arrivalTime.setMinutes(arrivalTime.getMinutes() + route.approxDuration);

            flights.push({
                flightNumber: route.flightNumber,
                aircraft: route.routeAircraft,
                origin: route.departureLocation,
                destination: route.destinationLocation,
                departureTime: departureTime,
                arrivalTime: arrivalTime,
                durationMinutes: route.approxDuration,
                price: route.price,
                bookings: [],
            })
        }
    }

    await db.collection("flights").insertMany(flights);
    await db.collection("flights").createIndex({ origin: 1, destination: 1, departureTime: 1 })

    console.log(`${flights.length} seeded across ${WEEKS} weeks`)
    await client.close();
}
seed().catch(console.error);

