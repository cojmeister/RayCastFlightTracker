import fetch from "node-fetch";
import { TrackingNumberError } from "./errors";
import { Result } from "./flightTypes";

const DATA = {
  data: [
    {
      carrierCode: {
        iata: "LH",
        icao: "DLH",
      },
      serviceSuffix: "",
      flightNumber: 687,
      sequenceNumber: 1,
      departure: {
        airport: {
          iata: "TLV",
        },
        terminal: "3",
        date: "2022-12-01",
        passengerLocalTime: "16:25",
      },
      arrival: {
        airport: {
          iata: "FRA",
        },
        terminal: "1",
        date: "2022-12-01",
        passengerLocalTime: "20:00",
      },
      aircraftType: {
        iata: "32Q",
      },
      serviceTypeCode: {
        iata: "J",
      },
      segmentInfo: {
        numberOfStops: 0,
        intermediateAirports: {
          iata: [],
        },
      },
      oagFingerprint: "2933764a881913eaa162d642f5777c3bc3ca19b7aa262f7360f94e251f0cd409",
      codeshare: {
        jointOperationAirlineDesignators: [],
        comments010: [
          {
            code: "SN",
            serviceNumber: "7174",
            suffix: "",
          },
          {
            code: "UA",
            serviceNumber: "9123",
            suffix: "",
          },
        ],
      },
      statusDetails: [
        {
          state: "Scheduled",
          updatedAt: "2022-12-01T11:51:23.373",
          equipment: {
            aircraftRegistrationNumber: "DAIEF",
            actualAircraftType: {
              iata: "32Q",
              icao: "A21N",
            },
          },
          departure: {
            estimatedTime: {
              outGateTimeliness: "Delayed",
              outGateVariation: "00:25:00",
              outGate: {
                local: "2022-12-01T16:50:00+02:00",
                utc: "2022-12-01T14:50:00+00:00",
              },
            },
            airport: {
              iata: "TLV",
              icao: "LLBG",
            },
          },
          arrival: {
            estimatedTime: {
              inGateTimeliness: "OnTime",
              inGateVariation: "00:00:00",
              inGate: {
                local: "2022-12-01T20:00:00+01:00",
                utc: "2022-12-01T19:00:00+00:00",
              },
            },
            airport: {
              iata: "FRA",
              icao: "EDDF",
            },
            actualTerminal: "1",
          },
        },
      ],
    },
  ],
  paging: {
    limit: 100,
    totalCount: 1,
    totalPages: 1,
    next: "",
  },
};

export class Flight {
  baseURL: string = "https://flight-info-api.p.rapidapi.com/status?version=v1";
  airline: string = "";
  number: number = 0;
  date: Date = new Date(Date.now());
  options = {
    method: "GET",
    headers: {
      //   "X-RapidAPI-Key": APIKEY(),
      "X-RapidAPI-Key": "4223c868d9mshc3c59c4eee84407p19b10ajsnb303a2868f77",
      "X-RapidAPI-Host": "flight-info-api.p.rapidapi.com",
    },
  };

  constructor() {}

  setTrackingNumber(trackingNumber: string): void {
    const splitTrackingNumber = trackingNumber.split(/(\d+)/);
    if (splitTrackingNumber.length == 0 || splitTrackingNumber.length == 1 || splitTrackingNumber.length > 3) {
      throw new TrackingNumberError(`${trackingNumber} is incorrect - should be of type 'LH678'`);
    }
    this.airline = splitTrackingNumber[0];
    this.number = parseInt(splitTrackingNumber[1]);
  }

  setDate(newDate: Date) {
    this.date = newDate;
  }

  setDateByNDays(nDays: number = 1) {
    this.date.setDate(this.date.getDate() + nDays);
  }

  private makeDate = (newDate: Date): string => {
    return "DepartureDate=" + newDate.toISOString().split("T")[0];
  };

  private makeAirlineCode = (): string => {
    return "IataCarrierCode=" + this.airline;
  };

  private makeFlightNumber = (): string => {
    return "FlightNumber=" + this.number.toString();
  };

  private makeURL = (newDate: Date): string => {
    return [this.baseURL, this.makeDate(newDate), this.makeAirlineCode(), this.makeFlightNumber()].join("&");
  };

  /**
   * track
   */
  public async track(newDate: Date): Promise<Result> {
    const finalURL = this.makeURL(newDate);
    console.log("Sending Request");
    // try {
    // const res = await fetch(finalURL, this.options);
    // console.log((await res.json()) as Result);
    // return (await res.json()) as Result;
    // } catch (err: unknown) {
    //   throw new Error("APIError");
    // }
    return (await { DATA }) as Result;
    // return (await {
    //   data: [],
    //   paging: {
    //     next: "",
    //     totalCount: 100,
    //     totalPages: 100,
    //   },
    // }) as Result;
  }
}
