export interface Result {
  data?: ResponseData[];
  paging?: Paging;
}

export interface ResponseData {
  carrierCode: IATAIACO;
  serviceSuffix: string;
  flightNumber: number;
  sequenceNumber: number;
  departure: DepartureOrArrival;
  arrival: DepartureOrArrival;
  aircraftType: IATAIACO;
  serviceTypeCode: {
    iata: string;
  };
  segmentInfo: SegmentInfo;
  oagFingerprint: string;
  codeshare: CodeShare;
  statusDetails: FlightStatusDetails[];
}

interface IATAIACO {
  iata?: string;
  icao?: string;
}

interface DepartureOrArrival {
  airport: IATAIACO;
  terminal: string;
  date: string;
  passengerLocalTime: string;
}

interface SegmentInfo {
  numberOfStops: number;
  intermediateAirports: {
    iata: {
      sequenceNumber: number;
      station: string;
    }[];
  };
}

interface CodeNameNumber {
  code: string;
  name: string;
  number?: string;
}

interface Comments {
  code: string;
  serviceNumber: string;
  suffix: string;
}

interface CodeShare {
  operatingAirlineDisclosure?: CodeNameNumber;
  aircraftOwner?: CodeNameNumber;
  cockpitCrewEmployer?: CodeNameNumber;
  jointOperationAirlineDesignators?: CodeNameNumber[];
  comments010?: Comments[];
  comment050?: Comments;
}

interface FlightStatusDetails {
  state: string;
  updatedAt: string;
  equipment: {
    aircraftRegistrationNumber: string;
    actualAircraftType: IATAIACO;
  };
  departure: Departure;
  arrival: Arrival;
  diversionAirport?: IATAIACO;
}

interface DepartFlightTime {
  outGateTimeliness: string;
  outGateVariation?: string;
  outGate?: {
    local: string;
    utc: string;
  };
  offGround?: {
    local: string;
    utc: string;
  };
}

interface ArriveFlightTime {
  inGateTimeliness: string;
  inGateVariation?: string;
  onGround?: {
    local: string;
    utc: string;
  };
  inGate?: {
    local: string;
    utc: string;
  };
}

interface FlightDepartureOrArrival {
  airport: IATAIACO;
  actualTerminal?: string;
  gate?: string;
  checkInCounter?: string;
  baggage?: string;
}

interface Departure extends FlightDepartureOrArrival {
  estimatedTime: DepartFlightTime;
  actualTime?: DepartFlightTime;
}

interface Arrival extends FlightDepartureOrArrival {
  estimatedTime: ArriveFlightTime;
  actualTime?: ArriveFlightTime;
}

interface Paging {
  limit?: number;
  totalCount: number;
  totalPages: number;
  next: string;
}

// export interface TimeStatusEnum {
//     onTime: "OnTime"
//     delayed: "Delayed"
// } as const;

// export type TimeStatusEnum = typeof TimeStatusEnum
