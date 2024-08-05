import { Link, useLoaderData } from "react-router-dom";
import { getChartData, getSummary } from "../api";
import { FuelChart } from "../components/fuel-chart";
import { OemChart } from "../components/oem-chart";
import { RegistrationYearChart } from "../components/registration-year-chart";
import { Statistic } from "../components/statistic";
import { formatCurrency, formatNumber } from "../utils/intl";
import { privateLoader } from "../utils/private-loader";

type LoaderData = {
  summary: Awaited<ReturnType<typeof getSummary>>;
  fuelChart: Awaited<ReturnType<typeof getChartData>>;
  oemChart: Awaited<ReturnType<typeof getChartData>>;
  yearChart: Awaited<ReturnType<typeof getChartData>>;
};

Index.loader = privateLoader(async () => {
  const [summary, fuelChart, oemChart, yearChart] = await Promise.all([
    getSummary(),
    getChartData("FUEL_TYPE"),
    getChartData("OEM"),
    getChartData("REGISTRATION_YEAR"),
  ]);
  return { summary, fuelChart, oemChart, yearChart };
});

export function Index() {
  const { summary, fuelChart, oemChart, yearChart } =
    useLoaderData() as LoaderData;

  return (
    <div className="space-y-6">
      <Link to="/test">Test</Link>
      <Link to="/test/123">Test</Link>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Statistic
          label="Vehicles in stock"
          value={formatNumber(summary.count)}
        />
        <Statistic label="Unique OEMs" value={formatNumber(summary.oems)} />
        <Statistic
          label="Stock value"
          value={formatCurrency(summary.value, { notation: "compact" })}
        />
      </section>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Top 5 OEMs */}
        <OemChart data={oemChart} />

        {/* Fuel Type Breakdown */}
        <FuelChart data={fuelChart} />

        {/* Registration Year Breakdown */}
        <RegistrationYearChart data={yearChart} />
      </section>
    </div>
  );
}
