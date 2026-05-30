import { NextRequest, NextResponse} from "next/server";
import { connectToDatabase} from "@/src/lib/mongodb";

export async function GET(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const email = searchParams.get("email");
    const ref = searchParams.get("ref");

    if (!email && !ref) {
        return NextResponse.json
        (
            { error: "email or ref is required" },
            {status: 400}
        );
    }

    try {
        const {db} = await connectToDatabase();

        let query: any;
        if (ref) {
            query = { "bookings.bookingRef": ref.toUpperCase()};
        } else {
            query = { "bookings.passengerEmail": email!.trim().toLowerCase() };
        }

        const flights = await db
            .collection("flights")
            .find(query)
            .sort({ departureTime: 1 })
            .toArray() as any[];

        const results = flights.map((f) => {
            const booking = f.bookings.find((b: any) =>
                ref
                    ? b.bookingRef === ref.toUpperCase()
                    : b.passengerEmail === email!.trim().toLowerCase()
            );

            if (!booking) return null;

            return {
                scheduleId: f._id.toString(),
                bookingId: booking?._id?.toString(),
                bookingRef: booking?.bookingRef,
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
        }).filter((r) => r !== null);

        return NextResponse.json(results);


    } catch (error) {
        console.error("Passenger lookup error:", error);
        return NextResponse.json(
            {error: "Failed to fetch passenger bookings"},
            {status: 500}
        );
    }
}