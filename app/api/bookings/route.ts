import { NextRequest, NextResponse} from "next/server";
import {ObjectId} from "mongodb";
import { connectToDatabase} from "@/src/lib/mongodb";

export async function POST(request: NextRequest)
{
    const body = await request.json();
    const { scheduleId, passengerName, passengerEmail } = body;



    if (!scheduleId || !passengerName || !passengerEmail)
    {
        return NextResponse.json(
            {error: "ID, Name and Email is required" },
            { status: 400 }
        );
    }

    try {
        const { db } = await connectToDatabase();
        const allFlights = await db.collection("flights").find({}).toArray();
        const totalBookings = allFlights.reduce((sum, f) => sum + (f.bookings?.length || 0), 0);
        const bookingRef = "DF" + String(totalBookings + 1).padStart(6, "0");

        const flight = await db
            .collection("flights")
            .findOne({ _id: new ObjectId(scheduleId) });

        if (!flight){
            return NextResponse.json({ error: "Flight not found" }, { status: 404});
        }

        const currentBookings = flight.bookings?.length || 0;
        if (currentBookings >= flight.aircraft.model.passengerCapacity)
        {
            return NextResponse.json({error: "Booking capacity is reached"}, { status: 409})
        }

        const alreadyBooked = flight.bookings?.some(
            (b: any) => b.passengerEmail.toLowerCase() === passengerEmail.toLowerCase()
        );
        if (alreadyBooked) {
            return NextResponse.json(
                { error: "This passenger already has a booking for this flight" },
                { status: 409 }
            );
        }

        const bookingId = new ObjectId();
        const booking = {
            _id: bookingId,
            bookingRef: bookingRef,
            passengerName: passengerName.trim(),
            passengerEmail: passengerEmail.trim().toLowerCase(),
            bookedAt: new Date(),
        };

        await db.collection("flights").updateOne(
            { _id: new ObjectId(scheduleId) },
            { $push: { bookings: booking } } as any
        );

        return NextResponse.json({
            bookingId: bookingId.toString(),
            bookingRef: bookingRef,
            flightNumber: flight.flightNumber,
            passengerName: passengerName.trim(),
            passengerEmail: passengerEmail.trim().toLowerCase(),
            departureTime: flight.departureTime,
            origin: flight.origin,
            destination: flight.destination,
        });
    }


    catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json({error: "Failed to create booking"}, {status: 500});
    }

}

//Cancellation Function
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const scheduleId = searchParams.get("scheduleId");
    const bookingId = searchParams.get("bookingId");

    if (!scheduleId || !bookingId) {
        return NextResponse.json(
            { error: "scheduleId and bookingId are required" },
            { status: 400 }
        );
    }

    try {
        const { db } = await connectToDatabase();

        const result = await db.collection("flights").updateOne(
            { _id: new ObjectId(scheduleId) },
            { $pull: { bookings: { _id: new ObjectId(bookingId) } } } as any
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Booking cancelled successfully" });

    } catch (error) {
        console.error("Cancellation error:", error);
        return NextResponse.json({ error: "Failed to cancel booking" }, { status: 500 });
    }
}