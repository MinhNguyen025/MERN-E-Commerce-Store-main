import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import ProgressSteps from "../../components/ProgressSteps";
import Loader from "../../components/Loader";
import { useCreateOrderMutation } from "../../redux/api/orderApiSlice";
import { clearCartItems } from "../../redux/features/cart/cartSlice";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate("/shipping");
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();

      dispatch(clearCartItems());
      toast.success("Order placed successfully! A confirmation email has been sent to your inbox.");
      window.location.href = `/order/${res._id}`; // Sử dụng backticks
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(error?.data?.message || error.message || "Failed to place order."); // Hiển thị thông báo lỗi cụ thể
    }
  };

  return (
    <>
      <ProgressSteps step1 step2 step3 />
      <div className="container mx-auto mt-8 flex flex-col md:flex-row gap-8">
  {/* Bảng sản phẩm */}
  <div className="flex-[3] overflow-x-auto">
    {cart.cartItems.length === 0 ? (
      <Message>Your cart is empty</Message>
    ) : (
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <td className="px-1 py-2 text-left align-top">Image</td>
            <td className="px-1 py-2 text-left">Product</td>
            <td className="px-1 py-2 text-left">Quantity</td>
            <td className="px-1 py-2 text-left">Price</td>
            <td className="px-1 py-2 text-left">Total</td>
          </tr>
        </thead>

        <tbody>
          {cart.cartItems.map((item, index) => (
            <tr key={index}>
              <td className="p-2">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover"
                />
              </td>

              <td className="p-2">
                <Link to={`/product/${item.product}`}>{item.name}</Link>
              </td>
              <td className="p-2">{item.qty}</td>
              <td className="p-2">{item.price.toFixed(2)}</td>
              <td className="p-2">
                $ {(item.qty * item.price).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>

  {/* Thông tin đơn hàng */}
  <div className="flex-[1]">
    <h2 className="text-2xl font-semibold mb-5">Order Summary</h2>
    <div className="p-8 bg-[#181818] rounded-lg">
      <ul className="text-lg mb-4">
        <li>
          <span className="font-semibold">Items:</span> ${cart.itemsPrice}
        </li>
        <li>
          <span className="font-semibold">Shipping:</span> ${cart.shippingPrice}
        </li>
        <li>
          <span className="font-semibold">Tax:</span> ${cart.taxPrice}
        </li>
        <li>
          <span className="font-semibold">Total:</span> ${cart.totalPrice}
        </li>
      </ul>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Shipping</h2>
        <p>
          <strong>Address:</strong> {cart.shippingAddress.address},{" "}
          {cart.shippingAddress.city} {cart.shippingAddress.postalCode},{" "}
          {cart.shippingAddress.country}
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-semibold">Payment Method</h2>
        <p>
          <strong>Method:</strong> {cart.paymentMethod}
        </p>
      </div>

      <button
        type="button"
        className="bg-red-500 text-white py-2 px-4 rounded-full text-lg w-full mt-4"
        disabled={cart.cartItems.length === 0}
        onClick={placeOrderHandler}
      >
        Place Order
      </button>
    </div>
  </div>
</div>


    </>
  );
};

export default PlaceOrder;
