import Skeleton from "react-loading-skeleton";

// The <Skeleton> component is designed to be used directly in your components,
// in place of content while it's still loading.
// Unlike other libraries, rather than meticulously crafting a skeleton screen to match the font-size,
// line-height or margins your content takes on,
// use a <Skeleton> component to have it automatically fill the correct dimensions.

export default function User({ name, picture, handleLogout }) {
  return !name || !picture ? (
    <Skeleton count={1} height={61} />
  ) : (
    <div className="flex items-center justify-between mt-14 ml-10">
      <img
        className="w-15 h-16 rounded-full border p-[2px]"
        src={picture}
        alt="mini-profile-pic"
      />
      <div className="flex-1 mx-4">
        <h2 className="font-bold">{name}</h2>
        <h3 className="text-sm text-gray-400">Welcome to Instagram</h3>
      </div>

      <button
        className="text-blue-400 text-sm-font-semibold"
        onClick={handleLogout}
      >
        Sign Out
      </button>
    </div>
  );
}
