import { Action, ActionPanel, Icon, List, popToRoot, showToast, Toast } from "@raycast/api";
import { useEffect, useRef, useState } from "react";
import makeArrivalData from "./components/arrival";
import makeDepartureData from "./components/departure";
import makeGeneralData from "./components/general";
import FlightTrack, { relativeDate } from "./flightTrackApi";
import { HeyThere } from "./costumErrors";

export default function TrackFlightExtension(props: { arguments: { flightNumber: string } }) {
  const today = new Date(Date.now());
  const [flightDate, setFlightDate] = useState<relativeDate>("today");

  const [isLoading, setIsLoading] = useState(true);
  const { flightNumber } = props.arguments;
  const flightTrackRef = useRef<FlightTrack>();

  useEffect(() => {
    flightTrackRef.current = new FlightTrack(flightNumber.toUpperCase(), today);
    setFlightDate("today");
  }, []); // only run this effect once when the component mounts

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
        const flightTrack = flightTrackRef.current;
        if (flightTrack == undefined) {
          return;
        }
        flightTrack.setFlightDate(flightDate);
        flightTrack.response = (await flightTrack.getFlight())[0];
        flightTrackRef.current = flightTrack;
        setIsLoading(false);
      } catch (error: unknown) {
        console.error(error);
        if (error.message) {
        }
        showToast(Toast.Style.Failure, "Tracking Error", "Some error while tracking");
        popToRoot({ clearSearchBar: true });
      }
    }
    getFlightData();
  }, [flightDate]);
  return (
    <List isShowingDetail={true} navigationTitle={flightNumber.toUpperCase()} isLoading={isLoading}>
      <List.Item
        title="General"
        icon={Icon.Airplane}
        actions={actionCommands()}
        detail={makeGeneralData(flightTrackRef.current?.response)}
      />
      <List.Item
        title="Departure"
        icon={Icon.AirplaneTakeoff}
        actions={actionCommands()}
        detail={makeDepartureData(flightTrackRef.current?.response?.departure)}
      />
      <List.Item
        title="Arrival"
        icon={Icon.AirplaneLanding}
        actions={actionCommands()}
        detail={makeArrivalData(flightTrackRef.current?.response?.arrival)}
      />
    </List>
  );
}
