import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import Product from "../pages/Products/Product";
import ProductCarousel from "../pages/Products/ProductCarousel";
import AdBanner from "./AdBanner";

const PopularProducts = () => {
  const { data, isLoading, error } = useGetTopProductsQuery();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <h1>ERROR</h1>;
  }

  return (
    
    <div className="px-[4rem] mt-[4rem]">
      <AdBanner />
      <div 
      style={{background: "#1A1A1A"}}
      className="ml-24 my-8 p-4 rounded-lg w-[90%]">
        <h1 className="text-4xl text-center font-bold text-white mb-6 ml-20">
          Best sellers in this week!
        </h1>
        <ProductCarousel className="relative"/>
      </div>
      <h1 className="text-4xl font-bold text-white mb-6 ml-20">
        Popular Products
      </h1>
      <div className="grid grid-cols-4 gap-7 ml-20 ">
        {data.map((product) => (
          <div key={product._id}>
            <Product product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PopularProducts;
