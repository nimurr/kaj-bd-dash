import IncomeGraphChart from "../../component/Main/Dashboard/IncomeGraphChart";
import Piechart from "../../component/Main/Dashboard/Piechart";
import RecentTransactions from "../../component/Main/Dashboard/RecentTransactions";
import Status from "../../component/Main/Dashboard/Status";
import { useGetDashboardStatusQuery } from "../../redux/features/dashboard/dashboardApi";
const DashboardHome = () => {

  const { data, isLoading } = useGetDashboardStatusQuery();
  const fullData = data?.data?.attributes || [];


  return (
    <section>
      <h1 className="text-4xl font-semibold py-5 px-3">Welcome back 👋</h1>
      <div className="px-3">
        <Status fullData={fullData} isLoading={isLoading} />
        <div className="grid grid-cols-1 lg:grid-cols-6 items-start gap-5 pt-10">
          <IncomeGraphChart fullData={fullData} />
          <Piechart fullData={fullData} />
        </div>
        <RecentTransactions fullData={fullData} />
      </div>
    </section>
  );
};

export default DashboardHome;
