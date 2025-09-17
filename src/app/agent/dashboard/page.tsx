import Link from "next/link";

export default function AgentDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 transition-all duration-200">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Agent Dashboard
          </h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">
            Manage your properties and verification requests.
          </p>
        </div>

        <div className="mt-8 sm:mt-10">
          <h3 className="text-lg sm:text-xl font-semibold tracking-tight mb-4 sm:mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Link 
              href="/agent/dashboard/properties" 
              className="relative group bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg sm:rounded-xl p-5 sm:p-6 
                shadow-sm border border-green-100 transition-all duration-200 
                hover:shadow-lg hover:-translate-y-0.5"
            >
              <h4 className="font-semibold text-green-800 group-hover:text-green-700">
                Property Management
              </h4>
              <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600">
                Create and edit your property listings
              </p>
              <div className="absolute inset-0 rounded-lg sm:rounded-xl border border-green-200/0 group-hover:border-green-200/50 transition-colors" />
            </Link>

            <Link 
              href="/agent/dashboard/verifications" 
              className="relative group bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg sm:rounded-xl p-5 sm:p-6 
                shadow-sm border border-green-100 transition-all duration-200 
                hover:shadow-lg hover:-translate-y-0.5"
            >
              <h4 className="font-semibold text-green-800 group-hover:text-green-700">
                Verification Status
              </h4>
              <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600">
                Track and manage property verifications
              </p>
              <div className="absolute inset-0 rounded-lg sm:rounded-xl border border-green-200/0 group-hover:border-green-200/50 transition-colors" />
            </Link>

            <Link 
              href="/agent/dashboard/profile" 
              className="relative group bg-gradient-to-br from-green-50 to-green-100/50 rounded-lg sm:rounded-xl p-5 sm:p-6 
                shadow-sm border border-green-100 transition-all duration-200 
                hover:shadow-lg hover:-translate-y-0.5"
            >
              <h4 className="font-semibold text-green-800 group-hover:text-green-700">
                Profile Settings
              </h4>
              <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-gray-600">
                Update your profile and contact info
              </p>
              <div className="absolute inset-0 rounded-lg sm:rounded-xl border border-green-200/0 group-hover:border-green-200/50 transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
