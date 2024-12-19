// File: src/components/admin/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import {
  useGetUsersQuery,
  useGetMonthlyUserRegistrationsQuery,
} from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import AdminMenu from "./AdminMenu";
import Loader from "../../components/Loader";
import moment from "moment"; // Để định dạng ngày tháng dễ dàng hơn

const AdminDashboard = () => {
  // Các hook API khác
  const { data: sales, isLoading: salesLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: customersLoading } = useGetUsersQuery({
    page: 1,
    limit: 1000,
    search: "",
  });
  const { data: orders, isLoading: ordersLoading } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  // Hook cho monthly registrations với error
  const {
    data: monthlyRegistrations,
    isLoading: registrationsLoading,
    error: registrationsError,
  } = useGetMonthlyUserRegistrationsQuery();

  // State cho biểu đồ sales
  const [salesChart, setSalesChart] = useState({
    options: {
      chart: {
        type: "line",
        toolbar: {
          show: true,
        },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 3,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
      },
      yaxis: {
        title: {
          text: "Sales ($)",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  // State cho biểu đồ registrations
  const [registrationsChart, setRegistrationsChart] = useState({
    options: {
      chart: {
        type: "line", // Đổi từ "bar" sang "line"
        toolbar: {
          show: true,
        },
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#FF4560"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Monthly User Registrations",
        align: "left",
      },
      grid: {
        borderColor: "#ccc",
      },
      markers: {
        size: 3,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Month",
        },
      },
      yaxis: {
        title: {
          text: "Number of Users",
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
      },
    },
    series: [{ name: "Registrations", data: [] }],
  });

  // Effect để cập nhật biểu đồ sales
  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: moment(item._id).format("MMM YYYY"), // Định dạng tháng năm
        y: item.totalSales,
      }));

      setSalesChart((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          {
            name: "Sales",
            data: formattedSalesDate.map((item) => item.y),
          },
        ],
      }));
    }
  }, [salesDetail]);

  // Effect để cập nhật biểu đồ registrations
  useEffect(() => {
    if (monthlyRegistrations) {
      console.log("Monthly Registrations Data:", monthlyRegistrations); // Debug

      const formattedRegistrations = monthlyRegistrations.map((item) => ({
        month: moment(`${item._id.year}-${item._id.month}`, "YYYY-M").format("MMM YYYY"), // Định dạng tháng năm
        total: item.total,
      }));

      setRegistrationsChart((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedRegistrations.map((item) => item.month),
          },
        },
        series: [
          {
            name: "Registrations",
            data: formattedRegistrations.map((item) => item.total),
          },
        ],
      }));
    }
  }, [monthlyRegistrations]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-[4rem] md:ml-[0rem] p-5">
        {/* Các Card Tổng Quan */}
        <div className="w-full flex justify-around flex-wrap">
          {/* Card Sales */}
          <div className="rounded-lg bg-gray-800 p-5 w-64 mt-5 shadow-lg">
            <div className="font-bold rounded-full w-12 h-12 bg-red-500 text-center flex items-center justify-center text-white text-2xl">
              $
            </div>

            <p className="mt-5 text-gray-300">Sales</p>
            <h1 className="text-xl font-bold text-white">
              $
              {salesLoading ? (
                <Loader />
              ) : (
                sales?.totalSales.toFixed(2) || "0.00"
              )}
            </h1>
          </div>

          {/* Card Customers */}
          <div className="rounded-lg bg-gray-800 p-5 w-64 mt-5 shadow-lg">
            <div className="font-bold rounded-full w-12 h-12 bg-blue-500 text-center flex items-center justify-center text-white text-2xl">
              👥
            </div>

            <p className="mt-5 text-gray-300">Customers</p>
            <h1 className="text-xl font-bold text-white">
              {customersLoading ? (
                <Loader />
              ) : (
                customers?.users?.length || 0
              )}
            </h1>
          </div>

          {/* Card Orders */}
          <div className="rounded-lg bg-gray-800 p-5 w-64 mt-5 shadow-lg">
            <div className="font-bold rounded-full w-12 h-12 bg-green-500 text-center flex items-center justify-center text-white text-2xl">
              🛒
            </div>

            <p className="mt-5 text-gray-300">All Orders</p>
            <h1 className="text-xl font-bold text-white">
              {ordersLoading ? <Loader /> : orders?.totalOrders || 0}
            </h1>
          </div>
        </div>

        {/* Container Flex cho hai biểu đồ */}
        <div className="mt-10 flex flex-col lg:flex-row gap-10">
          {/* Monthly User Registrations Chart */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-5">
              Monthly User Registrations
            </h2>
            {registrationsLoading ? (
              <Loader />
            ) : registrationsError ? (
              <p className="text-red-500">Error: {registrationsError.message}</p>
            ) : (
              <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                <Chart
                  options={registrationsChart.options}
                  series={registrationsChart.series}
                  type="bar" 
                  height="350"
                />
              </div>
            )}
          </div>

          {/* Sales Trend Chart */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-5">Sales Trend</h2>
            {salesLoading ? (
              <Loader />
            ) : (
              <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
                <Chart
                  options={salesChart.options}
                  series={salesChart.series}
                  type="line"
                  height="350"
                />
              </div>
            )}
          </div>
        </div>

        {/* User Registrations This Month Table */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-white mb-5">
            User Registrations This Month
          </h2>
          {registrationsLoading ? (
            <Loader />
          ) : registrationsError ? (
            <p className="text-red-500">Error: {registrationsError.message}</p>
          ) : (
            <div className="bg-gray-800 p-5 rounded-lg shadow-lg">
              <table className="min-w-full bg-gray-700 text-white">
                <thead>
                  <tr>
                    <th className="py-2">Tháng/Năm</th>
                    <th className="py-2">Số Người Đăng Ký</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyRegistrations?.map((item, index) => {
                    console.log("Mapping Item:", item);
                    return (
                      <tr key={index} className="text-center">
                        <td className="py-2">
                          {item._id.month}/{item._id.year}
                        </td>
                        <td className="py-2">{item.total}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;
