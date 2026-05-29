import{ Location, Aircraft, Route} from "@/src/lib/types";

export const LOCATIONS: Record<string, Location> = {
    NZNE: {
        icao: "NZNE",
        name: "Dairy Flats",
        timezone: "Pacific/Auckland",
        lat: -36.6583, lng: 174.6553
    },
    YSSY: {
        icao: "YSSY",
        name: "Sydney",
        timezone: "Australia/Sydney",
        lat: -33.9461, lng: 151.1772
    },
    NZRO: {
        icao: "NZRO",
        name: "Rotorua",
        timezone: "Pacific/Auckland",
        lat: -38.1092, lng: 176.3172
    },
    NZCI: {
        icao: "NZCI",
        name: "Tuuta",
        timezone: "Pacific/Chatham",
        lat: -36.2414, lng: 175.4719
    },
    NZGB: {
        icao: "NZGB",
        name: "Claris",
        timezone: "Pacific/Auckland",
        lat: -43.8100, lng: -176.4572
    },
    NZTL: {
        icao: "NZTL",
        name: "Lake Tekapo",
        timezone: "Pacific/Auckland",
        lat: -44.0003, lng: 170.4447
    }
}


export const MODELS = {
    SJ30i:{
        aircraftModel: "SyberJet SJ30i",
        passengerCapacity: 6,
        cruiseSpeed: 882,
        flightRange: 4300,
    },
    SF50: {
        aircraftModel: "Cirrus Vision SF50",
        passengerCapacity: 4,
        cruiseSpeed: 556,
        flightRange: 2350,
    },
    Elite: {
        aircraftModel: "HondaJet Elite",
        passengerCapacity: 5,
        cruiseSpeed: 782,
        flightRange: 2658,
    }}

export const AIRCRAFT = {
    SSJ_1: { aircraftRegistration: "SSJ-1", model: MODELS.SJ30i },
    CSF_1: { aircraftRegistration: "CSF-1", model: MODELS.SF50 },
    CSF_2: { aircraftRegistration: "CSF-2", model: MODELS.SF50 },
    HJE_1: { aircraftRegistration: "HJE-1", model: MODELS.Elite },
    HJE_2: { aircraftRegistration: "HJE-2", model: MODELS.Elite },

}




export const ROUTES: Route[] = [
    // Sydney Route
    {
        flightNumber: "DF100",
        departureLocation: LOCATIONS.NZNE,
        destinationLocation: LOCATIONS.YSSY,
        routeAircraft: AIRCRAFT.SSJ_1,
        operatingDays: ["Friday"],
        departureTime: "10:00",
        approxDuration: 210,
        price: 2499,
    },
    {
        flightNumber: "DF101",
        departureLocation: LOCATIONS.YSSY,
        destinationLocation: LOCATIONS.NZNE,
        routeAircraft: AIRCRAFT.SSJ_1,
        operatingDays: ["Sunday"],
        departureTime: "15:00",
        approxDuration: 180,
        price: 2499,
    },

    // Rotorua shuttle
    {
        flightNumber: "DF200",
        departureLocation: LOCATIONS.NZNE,
        destinationLocation: LOCATIONS.NZRO,
        routeAircraft: AIRCRAFT.CSF_1,
        operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        departureTime: "07:00",
        approxDuration: 40,
        price: 199,
    },
    {
        flightNumber: "DF201",
        departureLocation: LOCATIONS.NZRO,
        destinationLocation: LOCATIONS.NZNE,
        routeAircraft: AIRCRAFT.CSF_1,
        operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        departureTime: "08:30",
        approxDuration: 40,
        price: 199,
    },
    {
        flightNumber: "DF202",
        departureLocation: LOCATIONS.NZNE,
        destinationLocation: LOCATIONS.NZRO,
        routeAircraft: AIRCRAFT.CSF_1,
        operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        departureTime: "16:30",
        approxDuration: 40,
        price: 199,
    },
    {
        flightNumber: "DF203",
        departureLocation: LOCATIONS.NZRO,
        destinationLocation: LOCATIONS.NZNE,
        routeAircraft: AIRCRAFT.CSF_1,
        operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        departureTime: "18:00",
        approxDuration: 40,
        price: 199,
    },

    // Great Barrier Island
    {
        flightNumber: "DF300",
        departureLocation: LOCATIONS.NZNE,
        destinationLocation: LOCATIONS.NZGB,
        routeAircraft: AIRCRAFT.CSF_2,
        operatingDays: ["Monday", "Wednesday", "Friday"],
        departureTime: "09:00",
        approxDuration: 25,
        price: 149,
    },
    {
        flightNumber: "DF301",
        departureLocation: LOCATIONS.NZGB,
        destinationLocation: LOCATIONS.NZNE,
        routeAircraft: AIRCRAFT.CSF_2,
        operatingDays: ["Tuesday", "Thursday", "Saturday"],
        departureTime: "09:00",
        approxDuration: 25,
        price: 149,
    },

    // Chatham Islands Route
    {
        flightNumber: "DF400",
        departureLocation: LOCATIONS.NZNE,
        destinationLocation: LOCATIONS.NZCI,
        routeAircraft: AIRCRAFT.HJE_1,
        operatingDays: ["Tuesday", "Friday"],
        departureTime: "08:00",
        approxDuration: 120,
        price: 599,
    },
    {
        flightNumber: "DF401",
        departureLocation: LOCATIONS.NZCI,
        destinationLocation: LOCATIONS.NZNE,
        routeAircraft: AIRCRAFT.HJE_1,
        operatingDays: ["Wednesday", "Saturday"],
        departureTime: "08:00",
        approxDuration: 140,
        price: 599,
    },

    // Lake Tekapo Route
    {
        flightNumber: "DF500",
        departureLocation: LOCATIONS.NZNE,
        destinationLocation: LOCATIONS.NZTL,
        routeAircraft: AIRCRAFT.HJE_2,
        operatingDays: ["Monday"],
        departureTime: "10:00",
        approxDuration: 100,
        price: 449,
    },
    {
        flightNumber: "DF501",
        departureLocation: LOCATIONS.NZTL,
        destinationLocation: LOCATIONS.NZNE,
        routeAircraft: AIRCRAFT.HJE_2,
        operatingDays: ["Tuesday"],
        departureTime: "10:00",
        approxDuration: 90,
        price: 449,
    },

]