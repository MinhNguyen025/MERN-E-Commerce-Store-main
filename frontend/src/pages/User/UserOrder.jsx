import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto ml-40">
      <h2 className="text-2xl font-semibold mb-4">My Orders </h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
<table className="w-full border border-gray-400">
  <thead>
  <tr style={{ backgroundColor: "#cd2626" }} className="hover:text-black transition duration-200">

      <th className="py-2 px-4 border border-gray-400">IMAGE</th>
      <th className="py-2 px-4 border border-gray-400">ID</th>
      <th className="py-2 px-4 border border-gray-400">DATE</th>
      <th className="py-2 px-4 border border-gray-400">TOTAL</th>
      <th className="py-2 px-4 border border-gray-400">PAID</th>
      <th className="py-2 px-4 border border-gray-400">DELIVERED</th>
      <th className="py-2 px-4 border border-gray-400">ACTION</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order) => (
      <tr key={order._id} className="hover:bg-red-100 hover:text-black transition duration-200">
        <td className="py-2 px-4 border border-gray-400">
          <img
            src={order.orderItems[0].image}
            alt={order.user}
            className="w-[6rem] mb-5"
          />
        </td>
        <td className="py-2 px-4 border border-gray-400">{order._id}</td>
        <td className="py-2 px-4 border border-gray-400">
          {order.createdAt.substring(0, 10)}
        </td>
        <td className="py-2 px-4 border border-gray-400">$ {order.totalPrice}</td>
        <td className="py-2 px-4 border border-gray-400">
          {order.isPaid ? (
            <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
              Completed
            </p>
          ) : (
            <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
              Pending
            </p>
          )}
        </td>
        <td className="py-2 px-4 border border-gray-400">
          {order.isDelivered ? (
            <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
              Completed
            </p>
          ) : (
            <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
              Pending
            </p>
          )}
        </td>
        <td className="py-2 px-4 border border-gray-400 text-center">
          <Link to={`/order/${order._id}`}>
            <button className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600 transition duration-200">
              View Details
            </button>
          </Link>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      )}
    </div>
  );
};

export default UserOrder;
