import { CodeShareStatus, Flight, FlightAirportMovementQuality, FlightStatus } from "./responseTypes";

export const sampleData: Flight[] = [
  {
    greatCircleDistance: {
      meter: 11513365.88,
      km: 11513.366,
      mile: 7154.074,
      nm: 6216.72,
      feet: 37773510.1,
    },
    departure: {
      airport: {
        icao: "SAEZ",
        iata: "EZE",
        name: "Buenos Aires, Ministro Pistarini",
        shortName: "Ministro Pistarini",
        municipalityName: "Buenos Aires",
        location: {
          lat: -34.8222,
          lon: -58.5358,
        },
        countryCode: "AR",
      },
      scheduledTimeLocal: "2022-12-15 18:00-03:00",
      scheduledTimeUtc: "2022-12-15 21:00Z",
      terminal: "A",
      quality: [FlightAirportMovementQuality.Basic],
    },
    arrival: {
      airport: {
        icao: "EDDF",
        iata: "FRA",
        name: "Frankfurt-am-Main",
        shortName: "Frankfurt-am-Main",
        municipalityName: "Frankfurt-am-Main",
        location: {
          lat: 50.0264,
          lon: 8.543129,
        },
        countryCode: "DE",
      },
      scheduledTimeLocal: "2022-12-16 11:10+01:00",
      actualTimeLocal: "2022-12-16 11:10+01:00",
      scheduledTimeUtc: "2022-12-16 10:10Z",
      actualTimeUtc: "2022-12-16 10:10Z",
      terminal: "1",
      quality: ["Basic", "Live"],
    },
    lastUpdatedUtc: "2022-12-15 12:27Z",
    number: "LH 511",
    status: FlightStatus.Expected,
    codeshareStatus: CodeShareStatus.IsOperator,
    isCargo: false,
    aircraft: {
      reg: "D-ABYQ",
      model: "Boeing 747-8",
    },
    airline: {
      name: "Lufthansa",
    },
  },
  {
    greatCircleDistance: {
      meter: 11513365.88,
      km: 11513.366,
      mile: 7154.074,
      nm: 6216.72,
      feet: 37773510.1,
    },
    departure: {
      airport: {
        icao: "SAEZ",
        iata: "EZE",
        name: "Buenos Aires, Ministro Pistarini",
        shortName: "Ministro Pistarini",
        municipalityName: "Buenos Aires",
        location: {
          lat: -34.8222,
          lon: -58.5358,
        },
        countryCode: "AR",
      },
      scheduledTimeLocal: "2022-12-16 18:00-03:00",
      scheduledTimeUtc: "2022-12-16 21:00Z",
      terminal: "A",
      quality: ["Basic"],
    },
    arrival: {
      airport: {
        icao: "EDDF",
        iata: "FRA",
        name: "Frankfurt-am-Main",
        shortName: "Frankfurt-am-Main",
        municipalityName: "Frankfurt-am-Main",
        location: {
          lat: 50.0264,
          lon: 8.543129,
        },
        countryCode: "DE",
      },
      scheduledTimeLocal: "2022-12-17 11:10+01:00",
      scheduledTimeUtc: "2022-12-17 10:10Z",
      terminal: "1",
      quality: [FlightAirportMovementQuality.Basic],
    },
    lastUpdatedUtc: "2022-11-30 23:36Z",
    number: "LH 511",
    status: FlightStatus.Unknown,
    codeshareStatus: CodeShareStatus.Unknown,
    isCargo: false,
    aircraft: {
      model: "Boeing 747-8",
    },
    airline: {
      name: "Lufthansa",
    },
  },
];
