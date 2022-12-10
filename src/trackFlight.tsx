import { Action, ActionPanel, Color, Detail, Icon, List, popToRoot, showToast, Toast } from "@raycast/api";
import { useEffect, useState } from "react";
import { Flight } from "./api";
import { ResponseData, Result } from "./flightTypes";

export default function Arguments(props: { arguments: { flightNumber: string } }) {
  const [flightData, setFlightData] = useState<Result>({ data: [] });
  const today = new Date(Date.now());
  const [flightDate, setFlightDate] = useState<Date>(today);
  const { flightNumber } = props.arguments;
  const flight = new Flight();

  function actionCommands() {
    return (
      <ActionPanel title="#1 in raycast/extensions">
        <Action
          title="Tomorrow"
          onAction={() => {
            const tomorrow = new Date(Date.now());
            tomorrow.setDate(tomorrow.getDate() + 1);
            setFlightDate(tomorrow);
          }}
        />
        <Action
          title="Yesterday"
          onAction={() => {
            const tomorrow = new Date(Date.now());
            tomorrow.setDate(tomorrow.getDate() - 1);
            setFlightDate(tomorrow);
          }}
        />
        <Action
          title="The Day After Tomorrow"
          onAction={() => {
            const tomorrow = new Date(Date.now());
            tomorrow.setDate(tomorrow.getDate() + 2);
            setFlightDate(tomorrow);
          }}
        />
        <Action
          title="Today"
          onAction={() => {
            const today = new Date(Date.now());
            setFlightDate(today);
          }}
        />
      </ActionPanel>
    );
  }

  try {
    flight.setTrackingNumber(flightNumber);
  } catch (error) {
    console.error(error);
    showToast(Toast.Style.Failure, "Invalid Flight Number", "Should be of type 'AB123'");
    popToRoot({ clearSearchBar: true });
    return;
  }

  useEffect(() => {
    async function getFlightData() {
      try {
        const [flightDataEffect] = await Promise.all([flight.track(flightDate)]);
        setFlightData(flightDataEffect);
      } catch (error: unknown) {
        console.error(error);
        showToast(Toast.Style.Failure, "Tracking Error", "Some error while tracking");
        popToRoot({ clearSearchBar: true });
      }
    }
    getFlightData();
  }, [flight, flightDate]);

  if (flightData.data == undefined) return;
  console.log(flightData.data[0]);

  return (
    <List isShowingDetail={true} navigationTitle={flightNumber.toUpperCase()}>
      <List.Item
        title="General"
        icon={Icon.Airplane}
        actions={actionCommands()}
        detail={makeGeneralData(flightData.data[0])}
      />
      <List.Item
        title="Departure"
        icon={Icon.AirplaneTakeoff}
        actions={actionCommands()}
        detail={makeDepartureData(flightData.data[0])}
      />
      <List.Item
        title="Arrival"
        icon={Icon.AirplaneLanding}
        actions={actionCommands()}
        detail={makeArrivalData(flightData.data[0])}
      />
    </List>
  );
}

function makeGeneralData(data?: ResponseData) {
  if (data == undefined) return;
  const statusDetails = data.statusDetails[0];
  const onTime: boolean = statusDetails.state == "Scheduled";
  const color = onTime ? Color.Green : Color.Red;
  const icon = { source: Icon.AirplaneFilled, tintColor: color };
  return (
    <List.Item.Detail
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title={`${statusDetails.state}`} icon={icon} />
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label title="From" text={data.departure.airport.iata} />
          <List.Item.Detail.Metadata.Label title="Terminal" text={data.departure.terminal} />
          <List.Item.Detail.Metadata.Label
            title="At"
            text={data.departure.date + " - " + data.departure.passengerLocalTime}
          />

          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label title="To" text={data.arrival.airport.iata} />
          <List.Item.Detail.Metadata.Label title="Terminal" text={data.arrival.terminal} />
          <List.Item.Detail.Metadata.Label
            title="At"
            text={data.arrival.date + " - " + data.arrival.passengerLocalTime}
          />

          <List.Item.Detail.Metadata.Separator />
        </List.Item.Detail.Metadata>
      }
    />
  );
}

function makeDepartureData(data?: ResponseData) {
  if (data == undefined) return;
  const departureDetails = data.statusDetails[0].departure;
  const estimatedTime = departureDetails.estimatedTime;
  const onTime: boolean = estimatedTime.outGateTimeliness == "OnTime";
  const color = onTime ? Color.Green : Color.Red;
  const icon = { source: Icon.AirplaneTakeoff, tintColor: color };

  const terminal = <List.Item.Detail.Metadata.Label title="Terminal" text={departureDetails.actualTerminal} />;
  const gate = <List.Item.Detail.Metadata.Label title="Gate" text={departureDetails.gate} />;
  const leavingTime = new Date(data.arrival.date + "T" + data.arrival.passengerLocalTime + "Z");
  if (!onTime) {
    if (estimatedTime.outGateVariation == undefined) return;
    const minutesDelayed: number = parseInt(estimatedTime.outGateVariation.split(":")[1]);
    const hoursDelayed: number = parseInt(estimatedTime.outGateVariation.split(":")[0]);
    leavingTime.setHours(leavingTime.getHours() + hoursDelayed);
    leavingTime.setMinutes(leavingTime.getMinutes() + minutesDelayed);
  }

  const returnValue = (
    <List.Item.Detail
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title={`${estimatedTime.outGateTimeliness}`} icon={icon} />
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label title="From" text={data.departure.airport.iata} />
          {terminal}
          {gate}
          <List.Item.Detail.Metadata.Label
            title="At"
            text={
              leavingTime.toISOString().split("T")[0] +
              " - " +
              leavingTime.getUTCHours() +
              ":" +
              leavingTime.getUTCMinutes()
            }
          />
          <List.Item.Detail.Metadata.Separator />
        </List.Item.Detail.Metadata>
      }
    />
  );
  return returnValue;
}

function makeArrivalData(data?: ResponseData) {
  if (data == undefined) return;
  const arrivalDetails = data.statusDetails[0].arrival;
  const estimatedTime = arrivalDetails.estimatedTime;
  const onTime: boolean = estimatedTime.inGateTimeliness == "OnTime";
  const color = onTime ? Color.Green : Color.Red;
  const icon = { source: Icon.AirplaneTakeoff, tintColor: color };

  const terminal = <List.Item.Detail.Metadata.Label title="Terminal" text={arrivalDetails.actualTerminal} />;
  const gate = <List.Item.Detail.Metadata.Label title="Gate" text={arrivalDetails.gate} />;
  const arrivingTime = new Date(data.arrival.date + "T" + data.arrival.passengerLocalTime + "Z");
  if (!onTime) {
    if (estimatedTime.inGateVariation == undefined) return;
    const minutesDelayed: number = parseInt(estimatedTime.inGateVariation.split(":")[1]);
    const hoursDelayed: number = parseInt(estimatedTime.inGateVariation.split(":")[0]);
    arrivingTime.setHours(arrivingTime.getHours() + hoursDelayed);
    arrivingTime.setMinutes(arrivingTime.getMinutes() + minutesDelayed);
  }

  const returnValue = (
    <List.Item.Detail
      metadata={
        <List.Item.Detail.Metadata>
          <List.Item.Detail.Metadata.Label title={`${estimatedTime.inGateTimeliness}`} icon={icon} />
          <List.Item.Detail.Metadata.Separator />
          <List.Item.Detail.Metadata.Label title="To" text={data.arrival.airport.iata} />
          {terminal}
          {gate}
          <List.Item.Detail.Metadata.Label
            title="At"
            text={
              arrivingTime.toISOString().split("T")[0] +
              " - " +
              arrivingTime.getUTCHours() +
              ":" +
              arrivingTime.getUTCMinutes()
            }
          />
          <List.Item.Detail.Metadata.Separator />
        </List.Item.Detail.Metadata>
      }
    />
  );
  return returnValue;
}
