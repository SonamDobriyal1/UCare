import { motion } from "framer-motion";
import { Mail, MapPin, Globe, Github, Linkedin } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const developers = [
  {
    name: "Sonam Dobriyal",
    email: "sonamdobriyal@outlook.com",
    role: "Developer",
  },
  {
    name: "Shipra Upadhyay",
    email: null,
    role: "Developer",
  },
  {
    name: "Tanishka Gupta",
    email: null,
    role: "Developer",
  },
];

const Contact = () => (
  <Layout>
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <SectionHeading
          label="Contact"
          title="Get in touch"
          description="Have questions or want to learn more about UCare? Reach out to the team behind the platform."
        />

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Developer Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-foreground font-sans">
              Meet the Developers
            </h3>
            {developers.map((dev, i) => (
              <motion.div
                key={dev.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                {/* Avatar initials */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
                  {dev.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {dev.name}
                  </p>
                  <p className="text-xs text-muted-foreground mb-1">{dev.role}</p>
                  {dev.email && (
                    <a
                      href={`mailto:${dev.email}`}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <Mail className="h-3 w-3" />
                      {dev.email}
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4 font-sans">
                Project Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a
                      href="mailto:sonamdobriyal@outlook.com"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      sonamdobriyal@outlook.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Location</p>
                    <p className="text-sm text-muted-foreground">
                      KIET Group of Institutions, Ghaziabad, India
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Website</p>
                    <a
                      href="https://www.kiet.edu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      www.kiet.edu
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary rounded-xl p-6">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Project Supervisors
              </h4>
              <p className="text-sm text-muted-foreground">
                Dr. Neelam Rawat &amp; Ms. Shruti Aggarwal
              </p>
              <h4 className="text-sm font-semibold text-foreground mt-4 mb-2">
                Project Incharge
              </h4>
              <p className="text-sm text-muted-foreground">
                Dr. Ankit Verma &amp; Ms. Annu Yadav
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Contact;
