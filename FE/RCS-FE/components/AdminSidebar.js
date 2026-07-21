'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  
  const menuItems = [
    { name: 'Profile', path: '/admin/profile' },
    { name: 'Dashboard', path: '/admin/dashboard'},
  ];

  return (
    <div className="w-64 bg-[#F5F6FA] border-r border-gray-200 min-h-screen">
      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className= "flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-black hover:bg-gray-300 transition">
              <span className="text-lg">{item.name}</span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
}