import { NextRequest, NextResponse} from "next/server";
import { connectToDatabase } from "../../../src/lib/mongodb";



export async function GET(request: NextRequest)
{
    const { searchParams } = new URL(request.url);

    const orig = searchParams.get("orig");
    const dest = searchParams.get("dest");
    const date1 = searchParams.get("date1");
    const date2 = searchParams.get("date2");

    const query: Record<string, any> = {};

    if (orig) query["origin.icao"] = orig.toUpperCase();
    if (dest) query["destination.icao"] = dest.toUpperCase();

    if (date1 || date2)
    {
        query.departureTime = {};
        if (date1) query.departureTime.$gte = new Date(date1);
        if (date2)
        {
            const endDate = new Date(date2);
            endDate.setDate(endDate.getDate() + 1);
            query.departureTime.$lt = endDate;
        }
    }
    // try {
    //     //      const  {db} = await connectToDatabase();
    //     //      const flights = await db.collection("flights").find(query).sort({departureTime: 1}).limit(100).toArray();
    //     //      return NextResponse.json(flights);
    //     // }
    //
    try {
        const {db} = await connectToDatabase();
        console.log("Connected to database:", db.databaseName);
        console.log("Query:", JSON.stringify(query));
        const flights = await db.collection("flights").find(query).sort({departureTime: 1}).limit(100).toArray();
        console.log("Flights found:", flights.length);
        return NextResponse.json(flights);
    }
    catch(error) {
    console.error("Search Error: ", error);
    return NextResponse.json({error: "Search Failed"}, {status: 500});
}
}