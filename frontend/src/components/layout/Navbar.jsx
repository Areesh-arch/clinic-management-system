import SearchBar from "../ui/SearchBar";
import Avatar from "../ui/Avatar";

function Navbar() {
  return (
    <header className="bg-[#FCFBF8] h-20 border-b border-slate-200 px-8 flex items-center justify-between">

      <SearchBar />

      <Avatar image="https://i.pravatar.cc/150?img=8" />

    </header>
  );
}

export default Navbar;