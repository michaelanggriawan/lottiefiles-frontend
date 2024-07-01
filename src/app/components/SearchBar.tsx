import { useState } from "react";
import { XIcon, SearchIcon } from "@heroicons/react/solid";

type SearchBarProps = {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="flex items-center w-full max-w-2xl bg-white rounded-lg shadow-md">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search animations..."
        className="flex-grow px-4 py-2 text-gray-700 focus:outline-none rounded-l-lg"
      />
      {searchTerm && (
        <button
          onClick={handleClear}
          className="ml-2 p-2 text-gray-700 hover:text-gray-900"
        >
          <XIcon className="w-5 h-5" />
        </button>
      )}
      <button
        onClick={handleSearch}
        className="px-4 py-2 text-white bg-blue-600 rounded-r-lg hover:bg-blue-700"
      >
        <SearchIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchBar;
