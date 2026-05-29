export interface Location {
    icao: string;
    name: string;
    timezone: string;
    lat: number;
    lng: number;
}

export interface Route{
    flightNumber: string;
    departureLocation: Location;
    destinationLocation: Location;
    operatingDays: string[]; // Monday/Tuesday/Wednesday/etc
    departureTime: string;
    approxDuration: number;
    routeAircraft: Aircraft;
    price: number;
}

export interface AircraftModel {
    aircraftModel: string;
    passengerCapacity: number;
    cruiseSpeed: number; // SyberJet SJ30 has a cruise Speed of 882 km/h //Cirrus SF50 cruise Speed -  576 //HondaJet - cruise speed 782 km/h
    flightRange: number;
}

export interface Aircraft {
    aircraftRegistration: string;
    model: AircraftModel;
    //seats: number[];

}

export interface Flight{
    flightRoute: Route;
    flightDate: Date;
    arrivalTime: Date;
}

export interface Passenger{
    passengerName: string;
}

export interface Booking{
    bookingNumber: string;
    bookingName: string;
    bookingEmail: string;
    bookedFlight: Flight;
    bookingPassengers: Passenger[];

}