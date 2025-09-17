import AgentHeader from "@/components/AgentHeader";
import AgentSidebar from "@/components/AgentSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agents | PropertyVerify",
  description: "Manage and verify your properties",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AgentHeader />
      <div className="min-h-screen bg-gray-50 flex mt-[65px]">
        <AgentSidebar />
        <div className="flex-1 transition-all duration-200 
          lg:ml-64 p-4 sm:p-5 
          md:p-6 lg:p-8"
        >
          {children}
        </div>
      </div>
    </>
  );
}
