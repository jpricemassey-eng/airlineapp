import { NextRequest, NextResponse} from "next/server";
import { connectToDatabase} from "@/src/lib/mongodb";

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json
        (
            {error: "email or password is required"},
            {status: 400}
        );
    }

    try {
        const {db} = await connectToDatabase();
        const normalizedEmail = email.trim().toLowerCase();

        const flights = await db.collection("flights").find({"bookings.passengerEmail": normalizedEmail}).sort({departureTime: 1}).toArray();

        const results = flights.map((f) => {
            const booking = f.bookings.find(
                (b: any) => b.passengerEmail === normalizedEmail
            );
            return {
                scheduleId: f._id.toString(),
                bookingId: booking?._id?.toString(),
                flightNumber: f.flightNumber,
                aircraftType: f.aircraft.model.aircraftModel,
                origin: f.origin,
                destination: f.destination,
                departureTime: f.departureTime,
                arrivalTime: f.arrivalTime,
                durationMinutes: f.durationMinutes,
                price: f.price,
                passengerName: booking?.passengerName,
                bookedAt: booking?.bookedAt,
            };
        });

        return NextResponse.json(results);


    } catch (error) {
        console.error("Passenger lookup error:", error);
        return NextResponse.json(
            {error: "Failed to fetch passenger bookings"},
            {status: 500}
        );
    }
}