
import Link from "next/link";
import React from "react";



const Sidebar = () => {
  return (
    <div className="h-screen w-60 border-2  p-2 flex flex-col justify-between">
      <div>
        {sidebarLinks.map((link, index) => (
          <Link href={link.link} key={index}>
            <div className="w-full border-b-2 border-r-2  text-sm  p-3 text-center border- mt-4 cursor-pointer hover:bg-red-700 hover:text-white hover:shadow-2xl">
              {link.name}
            </div>
          </Link>
        ))}
      </div>
      <div>

      </div>
    </div>
  );
};


const sidebarLinks = [
    {
      name: "Characters",
      auth: false,
      link: "/characters",
    },
    {
      name: "Creators",
      auth: false,
      link: "/creators",
    },
    {
      name: "Comics",
      auth: false,
      link: "/comics",
    },
    {
      name: "Favorite Characters",
      auth: true,
      link: "/favorite-characters",
    },
    {
      name: "Favorite Comics",
      auth: true,
      link: "/favorite-comics",
    },
    {
      name: "Favorite Creators",
      auth: true,
      link: "/favorite-creators",
    },
  ];

export default Sidebar;
