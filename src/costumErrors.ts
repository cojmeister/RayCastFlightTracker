import pl from "nodejs-polars";
export class InexistentFlightError extends Error {}

export function HeyThere() {
  const expected = [[1, 2], [3], [null], []];
  const serie = pl.Series(expected);
  console.log(serie);
}
