import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import emptyFavoritesImage from "/src/images/empty-favorite.png";

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);
  
  return (
    <div className="ml-[10rem]">
      <h1 className="text-lg font-bold ml-[3rem] mt-[3rem] mb-[2rem]">
        FAVORITE PRODUCTS
      </h1>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <img
            src={emptyFavoritesImage}
            alt="No favorites"
            className="w-[300px] mb-6"
          />
          <h2 className="text-2xl font-semibold mb-4">
            No favorite products yet
          </h2>
          <p className="mb-6 text-gray-500">
            Start exploring and add your favorite items to this list!
          </p>
          <Link
            to="/shop"
            className="bg-red-500 text-white px-6 py-3 rounded-full text-lg hover:bg-red-600 transition"
          >
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;