import fetch from "node-fetch";
import { Flight } from "./responseTypes";
import { sampleData } from "./sampleResponse";
import { APIKEY } from "./secrets";

export type relativeDate = "yesterday" | "today" | "tomorrow" | "dayAfterTomorrow";

/**
 * Class that allows to track flights given their number in format "AB123" and the flight date
 */
export default class FlightTrack {
  private flightNumber: string;
  private flightDate: Date;

  /**
   *
   * @param {string}flightNumber The flight number we want to track "AB123"
   * @param {Date}flightDate The date of the flight are tracking
   */
  constructor(flightNumber: string, flightDate: Date) {
    if (!this.isValidFlightNumber(flightNumber)) {
      throw new Error("Invalid flight number format");
    }
    this.flightNumber = flightNumber;
    this.flightDate = flightDate;
  }

  /**
   * Checks if the flightr number string is given in the correct format
   * @param {string}flightNumber In the form of "AB123"
   * @returns {boolean} Whether the flight number inserted is correct or not
   */
  public isValidFlightNumber(flightNumber: string): boolean {
    // Regular expression to verify that the flight number has the correct format (e.g. UAL525)
    const flightNumberRegex = /^[A-Z]{2,3}\d{1,4}$/;
    return flightNumberRegex.test(flightNumber);
  }

  /**
   * Changes the flight date relative to the current day
   * @param {string}date The date relative to today, to which we want to change the flight.
   */
  public setFlightDate(date: relativeDate): void {
    const currentDate = new Date();
    let newDate: Date;
    switch (date) {
      case "yesterday":
        newDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "today":
        newDate = currentDate;
        break;
      case "tomorrow":
        newDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
        break;
      case "dayAfterTomorrow":
        newDate = new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000);
        break;
      default:
        throw new Error("Invalid date specified");
    }
    this.flightDate = newDate;
  }

  /**
   * Function that makes a http request to the AeroDataBox Api and returns the response
   * @returns {Promise<Flight[]>} The response of the http request.
   */
  public async getFlight(): Promise<Flight[]> {
    const url = `https://aerodatabox.p.rapidapi.com/flights/number/${this.flightNumber}/${
      this.flightDate.toISOString().split("T")[0]
    }?withAircraftImage=false&withLocation=false`;
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": APIKEY,
        "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com",
      },
    };

    try {
      // const response = await fetch(url, options);
      // if (response.status === 200) {
      //   const flightData = await response.json();
      //   return flightData as Flight[];
      // } else if (response.status === 204) {
      //   throw new Error("Empty Response - 204");
      // } else if (response.status === 400) {
      //   throw new Error("Bad request");
      // } else if (response.status === 401) {
      //   throw new Error("Unauthorized");
      // } else if (response.status === 500) {
      //   throw new Error("Server error");
      // } else {
      //   throw new Error("Unknown");
      // }
      console.log("Sending Request!");
      return await sampleData;
    } catch (err) {
      throw new Error(`Error getting flight information: ${err}`);
    }
  }
}
