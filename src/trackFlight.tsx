import { Action, ActionPanel, Icon, List, popToRoot, showToast, Toast } from "@raycast/api";
import { useEffect, useRef, useState } from "react";
import FlightTrack, { relativeDate } from "./api2";
import makeArrivalData from "./components/arrival";
import makeDepartureData from "./components/departure";
import makeGeneralData from "./components/general";
import { Flight } from "./responseTypes";

export default function Arguments(props: { arguments: { flightNumber: string } }) {
  const today = new Date(Date.now());
  const [flightDate, setFlightDate] = useState<relativeDate>("today");

  const flightData = useRef<Flight>();
  const isLoading = useRef<boolean>(true);
  const { flightNumber } = props.arguments;
  // try {
  const flightTrack = new FlightTrack(flightNumber.toUpperCase(), today);
  // } catch (err) {
  //   showToast(Toast.Style.Failure, "Invalid Flight Number", "Should be of type 'AB123'");
  //   popToRoot({ clearSearchBar: true });
  //   throw new Error("Error creating class");
  // }

  function actionCommands() {
    return (
      <ActionPanel title="#1 in raycast/extensions">
        <Action
          title="Tomorrow"
          onAction={() => {
            setFlightDate("tomorrow");
          }}
        />
        <Action
          title="Yesterday"
          onAction={() => {
            setFlightDate("yesterday");
          }}
        />
        <Action
          title="The Day After Tomorrow"
          onAction={() => {
            setFlightDate("dayAfterTomorrow");
          }}
        />
        <Action
          title="Today"
          onAction={() => {
            setFlightDate("today");
          }}
        />
      </ActionPanel>
    );
  }

  // try {
  //   flight.setTrackingNumber(flightNumber);
  // } catch (error) {
  //   console.error(error);
  //   showToast(Toast.Style.Failure, "Invalid Flight Number", "Should be of type 'AB123'");
  //   popToRoot({ clearSearchBar: true });
  //   return;
  // }

  useEffect(() => {
    async function getFlightData() {
      try {
        flightTrack.setFlightDate(flightDate);
        flightData.current = (await flightTrack.getFlight())[0];
        isLoading.current = false;
      } catch (error: unknown) {
        console.error(error);
        showToast(Toast.Style.Failure, "Tracking Error", "Some error while tracking");
        popToRoot({ clearSearchBar: true });
      }
    }
    getFlightData();
  }, [flightDate]);

  return (
    <List isShowingDetail={true} navigationTitle={flightNumber.toUpperCase()} isLoading={isLoading.current}>
      <List.Item
        title="General"
        icon={Icon.Airplane}
        actions={actionCommands()}
        detail={makeGeneralData(flightData.current)}
      />
      <List.Item
        title="Departure"
        icon={Icon.AirplaneTakeoff}
        actions={actionCommands()}
        detail={makeDepartureData(flightData.current?.departure)}
      />
      <List.Item
        title="Arrival"
        icon={Icon.AirplaneLanding}
        actions={actionCommands()}
        detail={makeArrivalData(flightData.current?.arrival)}
      />
    </List>
  );
}
