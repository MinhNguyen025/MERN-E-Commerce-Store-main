import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct";
import ProductCarousel from "../pages/Products/ProductCarousel";

const PopularProduct = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1 className="text-red-500 text-center">ERROR</h1>;
  }

  return (
    <div className="flex justify-around py-4 px-6 bg-black-900 text-white shadow-md">
      <div className="xl:block lg:hidden md:hidden sm:hidden">
        <div className="grid grid-cols-2 gap-4">
          {data.map((product) => (
            <div key={product._id}>
              <SmallProduct product={product} />
            </div>
          ))}
        </div>
      </div>
      <ProductCarousel />
    </div>
  );
};

export default PopularProduct;
