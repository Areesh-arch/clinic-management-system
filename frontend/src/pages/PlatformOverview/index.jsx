import Layout from "../../components/layout/Layout";

function PlatformOverview() {
  return (
    <Layout>
      <div className="space-y-8">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div>
          <p className="text-sm font-semibold tracking-[0.18em] text-[#9B8246] uppercase">
            Platform Administration
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#234D3C]">
            Platform Overview
          </h1>

          <p className="mt-2 max-w-2xl text-[#647267]">
            Monitor your DermaCare SaaS platform, clinics,
            subscriptions, patients and overall activity.
          </p>
        </div>


        {/* =====================================================
            DASHBOARD CARDS
        ===================================================== */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-3xl border border-[#E6E1D8] bg-[#FFFDF8] p-6 shadow-sm">

            <p className="text-sm font-medium text-[#647267]">
              Total Clinics
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#234D3C]">
              —
            </h2>

            <p className="mt-2 text-xs text-[#8C938D]">
              Platform-wide
            </p>

          </div>


          <div className="rounded-3xl border border-[#E6E1D8] bg-[#FFFDF8] p-6 shadow-sm">

            <p className="text-sm font-medium text-[#647267]">
              Active Subscriptions
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#234D3C]">
              —
            </h2>

            <p className="mt-2 text-xs text-[#8C938D]">
              Currently active
            </p>

          </div>


          <div className="rounded-3xl border border-[#E6E1D8] bg-[#FFFDF8] p-6 shadow-sm">

            <p className="text-sm font-medium text-[#647267]">
              Total Patients
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#234D3C]">
              —
            </h2>

            <p className="mt-2 text-xs text-[#8C938D]">
              Across all clinics
            </p>

          </div>


          <div className="rounded-3xl border border-[#E6E1D8] bg-[#FFFDF8] p-6 shadow-sm">

            <p className="text-sm font-medium text-[#647267]">
              Platform Revenue
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#234D3C]">
              —
            </h2>

            <p className="mt-2 text-xs text-[#8C938D]">
              Subscription revenue
            </p>

          </div>

        </div>


        {/* =====================================================
            WELCOME PANEL
        ===================================================== */}

        <div className="rounded-3xl border border-[#D8C99B]/50 bg-[#234D3C] p-8 text-white shadow-sm">

          <p className="text-xs font-bold tracking-[0.2em] text-[#D8C99B] uppercase">
            SaaS Platform
          </p>

          <h2 className="mt-3 text-2xl font-semibold">
            Welcome to DermaCare Platform Administration
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#E8EEE9]">
            This dashboard will give you a complete overview of
            the clinics using the DermaCare platform, subscription
            activity and platform-wide operational metrics.
          </p>

        </div>

      </div>
    </Layout>
  );
}

export default PlatformOverview;