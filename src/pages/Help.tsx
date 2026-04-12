import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Phone, MapPin, Building2, Heart, AlertCircle } from "lucide-react";

interface Center {
  name: string;
  type: "Rehabilitation Center" | "NGO";
  state: string;
  city: string;
  phone: string;
  address: string;
  services: string[];
}

interface EmergencyContact {
  name: string;
  number: string;
  available: string;
  description: string;
}

const emergencyContacts: EmergencyContact[] = [
  {
    name: "iCall – NIMHANS Helpline",
    number: "9152987821",
    available: "Mon–Sat, 8 AM – 10 PM",
    description: "Free psychological counselling and mental health support",
  },
  {
    name: "Vandrevala Foundation Helpline",
    number: "1860-2662-345",
    available: "24/7",
    description: "Mental health crisis intervention and addiction support",
  },
  {
    name: "NIMHANS De-addiction Helpline",
    number: "080-46110007",
    available: "24/7",
    description: "National helpline for alcohol & drug de-addiction by NIMHANS Bangalore",
  },
  {
    name: "National Drug Dependence Treatment Centre (NDDTC)",
    number: "011-26588500",
    available: "Mon–Fri, 9 AM – 5 PM",
    description: "AIIMS-based national referral centre for substance abuse treatment",
  },
  {
    name: "Snehi Helpline",
    number: "044-24640050",
    available: "24/7",
    description: "Emotional support and suicide prevention helpline",
  },
  {
    name: "iCall (TISS)",
    number: "9152987821",
    available: "Mon–Sat, 8 AM – 10 PM",
    description: "Counselling by trained psychologists at Tata Institute of Social Sciences",
  },
  {
    name: "Aasra Helpline",
    number: "9820466627",
    available: "24/7",
    description: "Crisis intervention for people in distress and addiction crisis",
  },
];

const centers: Center[] = [
  // Delhi / NCR
  {
    name: "National Drug Dependence Treatment Centre (NDDTC), AIIMS",
    type: "Rehabilitation Center",
    state: "Delhi",
    city: "New Delhi",
    phone: "011-26588500",
    address: "AIIMS Campus, Ansari Nagar, New Delhi – 110029",
    services: ["De-addiction", "Detox", "Counselling", "Aftercare"],
  },
  {
    name: "Tulsi Healthcare",
    type: "Rehabilitation Center",
    state: "Delhi",
    city: "New Delhi",
    phone: "9899100200",
    address: "B-51, Second Floor, Lajpat Nagar-II, New Delhi – 110024",
    services: ["Drug Rehabilitation", "Alcohol De-addiction", "Therapy"],
  },
  {
    name: "Samarpan Foundation – Delhi",
    type: "NGO",
    state: "Delhi",
    city: "New Delhi",
    phone: "1800-102-4567",
    address: "Delhi NCR (Multiple Centres)",
    services: ["Free Counselling", "Support Groups", "Family Therapy"],
  },
  // Maharashtra
  {
    name: "Muktangan De-addiction & Rehabilitation Centre",
    type: "Rehabilitation Center",
    state: "Maharashtra",
    city: "Mumbai",
    phone: "022-23077000",
    address: "S. K. Patil Udyan, Girgaon, Mumbai – 400004",
    services: ["Detox", "Residential Treatment", "Outpatient"],
  },
  {
    name: "Kripa Foundation",
    type: "NGO",
    state: "Maharashtra",
    city: "Mumbai",
    phone: "022-26490111",
    address: "3 Carter Road, Bandra West, Mumbai – 400050",
    services: ["Rehabilitation", "Counselling", "Halfway Houses"],
  },
  {
    name: "iCall – TISS Mumbai",
    type: "NGO",
    state: "Maharashtra",
    city: "Mumbai",
    phone: "9152987821",
    address: "Tata Institute of Social Sciences, V. N. Purav Marg, Deonar, Mumbai – 400088",
    services: ["Telephonic Counselling", "Online Therapy", "Crisis Support"],
  },
  // Karnataka
  {
    name: "NIMHANS De-addiction Services",
    type: "Rehabilitation Center",
    state: "Karnataka",
    city: "Bengaluru",
    phone: "080-46110007",
    address: "Hosur Road, Lakkasandra, Bengaluru – 560029",
    services: ["Inpatient Detox", "Psychiatric Care", "Counselling"],
  },
  {
    name: "Sahai – Mental Health & De-addiction",
    type: "NGO",
    state: "Karnataka",
    city: "Bengaluru",
    phone: "080-25497777",
    address: "3rd Cross, Sadashivanagar, Bengaluru – 560080",
    services: ["Helpline", "Counselling", "Support Groups"],
  },
  // Tamil Nadu
  {
    name: "SCARF (Schizophrenia Research Foundation)",
    type: "NGO",
    state: "Tamil Nadu",
    city: "Chennai",
    phone: "044-26151088",
    address: "R/7A, North Main Road, Anna Nagar West Extension, Chennai – 600101",
    services: ["Mental Health", "Substance Abuse", "Community Programs"],
  },
  {
    name: "Navjeevan De-addiction Centre",
    type: "Rehabilitation Center",
    state: "Tamil Nadu",
    city: "Chennai",
    phone: "044-22350098",
    address: "15 Anna Salai, Triplicane, Chennai – 600005",
    services: ["De-addiction", "Counselling", "Family Therapy"],
  },
  // West Bengal
  {
    name: "Pavlov Hospital – De-addiction Unit",
    type: "Rehabilitation Center",
    state: "West Bengal",
    city: "Kolkata",
    phone: "033-22413303",
    address: "7 Loknath Dutta Lane, Kolkata – 700014",
    services: ["Government Facility", "Inpatient Detox", "Psychiatric Support"],
  },
  {
    name: "Disha – Alcoholics Anonymous Kolkata",
    type: "NGO",
    state: "West Bengal",
    city: "Kolkata",
    phone: "033-24790091",
    address: "Ballygunge, Kolkata – 700019",
    services: ["12-Step Programme", "Support Groups", "Peer Support"],
  },
  // Punjab
  {
    name: "Government Medical College & Hospital De-addiction Centre",
    type: "Rehabilitation Center",
    state: "Punjab",
    city: "Amritsar",
    phone: "0183-2561000",
    address: "Circular Road, Amritsar – 143001",
    services: ["Government Facility", "Detox", "OPD & IPD"],
  },
  {
    name: "Umeed – De-addiction Centre Punjab",
    type: "NGO",
    state: "Punjab",
    city: "Ludhiana",
    phone: "9814000785",
    address: "Model Town, Ludhiana – 141002",
    services: ["Drug Rehabilitation", "Counselling", "Youth Programmes"],
  },
  // Rajasthan
  {
    name: "SMS Medical College – Psychiatry & De-addiction",
    type: "Rehabilitation Center",
    state: "Rajasthan",
    city: "Jaipur",
    phone: "0141-2518307",
    address: "JLN Marg, Jaipur – 302004",
    services: ["Government Hospital", "Detox", "Psychiatric Services"],
  },
  {
    name: "Navjyoti India Foundation",
    type: "NGO",
    state: "Rajasthan",
    city: "Jaipur",
    phone: "0141-2624444",
    address: "A-8, Sahkar Marg, Jaipur – 302001",
    services: ["Community Outreach", "Counselling", "Vocational Training"],
  },
  // Uttar Pradesh
  {
    name: "KGMU – Drug De-addiction Centre",
    type: "Rehabilitation Center",
    state: "Uttar Pradesh",
    city: "Lucknow",
    phone: "0522-2258880",
    address: "King George's Medical University, Shah Mina Rd, Lucknow – 226003",
    services: ["Government Hospital", "Detox", "Long-term Rehabilitation"],
  },
  {
    name: "Turning Point Foundation",
    type: "NGO",
    state: "Uttar Pradesh",
    city: "Varanasi",
    phone: "9415202525",
    address: "Sigra, Varanasi – 221010",
    services: ["Counselling", "Peer Support", "Family Education"],
  },
  // Gujarat
  {
    name: "Ahmedabad Municipal Corporation – De-addiction Clinics",
    type: "Rehabilitation Center",
    state: "Gujarat",
    city: "Ahmedabad",
    phone: "079-25391470",
    address: "Maninagar, Ahmedabad – 380008",
    services: ["Government Clinic", "OPD", "Counselling"],
  },
  {
    name: "Lok Sewa Trust",
    type: "NGO",
    state: "Gujarat",
    city: "Surat",
    phone: "0261-2655445",
    address: "Rander Road, Surat – 395005",
    services: ["De-addiction", "Community Health", "Support Groups"],
  },
  // Himachal Pradesh
  {
    name: "IGMC De-addiction Centre",
    type: "Rehabilitation Center",
    state: "Himachal Pradesh",
    city: "Shimla",
    phone: "0177-2804251",
    address: "Indira Gandhi Medical College, Shimla – 171001",
    services: ["Government Hospital", "Detox", "Psychiatric Care"],
  },
  // Assam
  {
    name: "Gauhati Medical College – Psychiatry De-addiction",
    type: "Rehabilitation Center",
    state: "Assam",
    city: "Guwahati",
    phone: "0361-2529457",
    address: "Bhangagarh, Guwahati – 781032",
    services: ["Government Hospital", "Inpatient", "Counselling"],
  },
  {
    name: "Hayat – Drug Abuse Prevention NGO",
    type: "NGO",
    state: "Assam",
    city: "Guwahati",
    phone: "9435015555",
    address: "Ulubari, Guwahati – 781007",
    services: ["Prevention", "Counselling", "Youth Outreach"],
  },
  // Odisha
  {
    name: "SCB Medical College De-addiction Unit",
    type: "Rehabilitation Center",
    state: "Odisha",
    city: "Cuttack",
    phone: "0671-2304802",
    address: "Mangalabag, Cuttack – 753007",
    services: ["Government Hospital", "Detox", "Rehabilitation"],
  },
  // Telangana
  {
    name: "NIMHANS Regional Centre – Hyderabad",
    type: "Rehabilitation Center",
    state: "Telangana",
    city: "Hyderabad",
    phone: "040-23268000",
    address: "Erragadda, Hyderabad – 500018",
    services: ["Psychiatry", "De-addiction", "OPD & IPD"],
  },
  {
    name: "Roshni – Hyderabad NGO",
    type: "NGO",
    state: "Telangana",
    city: "Hyderabad",
    phone: "040-66202000",
    address: "Saroornagar, Hyderabad – 500035",
    services: ["Crisis Helpline", "Counselling", "Suicide Prevention"],
  },
  // Kerala
  {
    name: "Medical College Kozhikode – De-addiction",
    type: "Rehabilitation Center",
    state: "Kerala",
    city: "Kozhikode",
    phone: "0495-2350216",
    address: "Medical College Road, Kozhikode – 673008",
    services: ["Government Facility", "Detox", "Aftercare"],
  },
  {
    name: "Thanal – Drug Rehabilitation NGO",
    type: "NGO",
    state: "Kerala",
    city: "Thiruvananthapuram",
    phone: "0471-2723456",
    address: "Vanchiyoor, Thiruvananthapuram – 695035",
    services: ["Rehabilitation", "Counselling", "Community Support"],
  },
];

const allStates = ["All States", ...Array.from(new Set(centers.map((c) => c.state))).sort()];

const Help = () => {
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [typeFilter, setTypeFilter] = useState<"All" | "Rehabilitation Center" | "NGO">("All");

  const filtered = useMemo(() => {
    return centers.filter((c) => {
      const matchesState = selectedState === "All States" || c.state === selectedState;
      const matchesType = typeFilter === "All" || c.type === typeFilter;
      const query = search.toLowerCase();
      const matchesSearch =
        !query ||
        c.name.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query) ||
        c.state.toLowerCase().includes(query) ||
        c.services.some((s) => s.toLowerCase().includes(query));
      return matchesState && matchesType && matchesSearch;
    });
  }, [search, selectedState, typeFilter]);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-28 pb-12 px-4 bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Heart className="h-4 w-4" />
            Help &amp; Support Directory
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Find Help Near You
          </h1>
          <p className="text-muted-foreground text-lg">
            A curated directory of rehabilitation centers, NGOs, and emergency helplines
            across India dedicated to helping people overcome addiction.
          </p>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-10 px-4 bg-red-50/50 dark:bg-red-950/10 border-y border-red-200/40">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-center gap-2 mb-6">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h2 className="text-2xl font-serif font-semibold text-foreground">
              Emergency &amp; Helpline Numbers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {emergencyContacts.map((ec) => (
              <div
                key={ec.number}
                className="bg-white dark:bg-background border border-red-200/60 rounded-xl p-4 flex flex-col gap-2 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-sm text-foreground leading-tight">
                    {ec.name}
                  </span>
                  <Badge variant="destructive" className="shrink-0 text-xs">
                    Helpline
                  </Badge>
                </div>
                <a
                  href={`tel:${ec.number}`}
                  className="flex items-center gap-1.5 text-red-600 font-bold text-lg hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {ec.number}
                </a>
                <p className="text-xs text-muted-foreground">{ec.description}</p>
                <span className="text-xs text-muted-foreground font-medium">
                  Available: {ec.available}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="py-8 px-4 bg-muted/30 border-b border-border sticky top-16 z-40 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, city, state or service…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            {/* State filter */}
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {allStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {/* Type filter */}
            <div className="flex gap-2">
              {(["All", "Rehabilitation Center", "NGO"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
                    typeFilter === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-input text-muted-foreground hover:border-primary hover:text-primary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
            {centers.length} centers
          </p>
        </div>
      </section>

      {/* Results */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-lg font-medium">No results found</p>
              <p className="text-sm">Try a different state or search term.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((center) => (
                <Card
                  key={center.name + center.city}
                  className="border border-border hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base font-semibold leading-snug">
                        {center.name}
                      </CardTitle>
                      <Badge
                        variant={center.type === "NGO" ? "secondary" : "default"}
                        className="shrink-0 text-xs"
                      >
                        {center.type === "NGO" ? (
                          <><Heart className="h-3 w-3 mr-1" />NGO</>
                        ) : (
                          <><Building2 className="h-3 w-3 mr-1" />Rehab Center</>
                        )}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                      <div>
                        <span className="font-medium text-foreground">
                          {center.city}, {center.state}
                        </span>
                        <p className="text-xs mt-0.5">{center.address}</p>
                      </div>
                    </div>
                    <a
                      href={`tel:${center.phone}`}
                      className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"
                    >
                      <Phone className="h-4 w-4" />
                      {center.phone}
                    </a>
                    <div className="flex flex-wrap gap-1.5">
                      {center.services.map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="pb-12 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="bg-muted/50 border border-border rounded-xl p-5 text-sm text-muted-foreground">
            <strong className="text-foreground">Disclaimer:</strong> The information listed here is
            compiled from publicly available sources for awareness and reference purposes only.
            UCare does not endorse any specific facility. Please verify contact details directly
            with the organization before visiting. If you or someone you know is in immediate
            danger, please call <strong className="text-red-500">112</strong> (National Emergency).
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Help;
