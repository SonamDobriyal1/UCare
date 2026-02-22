import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const team = [
  { name: "Tanishka Gupta", role: "Developer" },
  { name: "Sonam Dobriyal", role: "Developer" },
  { name: "Shipra Upadhyay", role: "Developer" },
];

const supervisors = [
  { name: "Dr. Neelam Rawat", role: "Supervisor" },
  { name: "Ms. Shruti Aggarwal", role: "Supervisor" },
  { name: "Dr. Ankit Kumar", role: "Project Incharge" },
  { name: "Ms. Annu Yadav", role: "Project Incharge" },
];

const About = () => (
  <Layout>
    {/* Hero */}
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary mb-4">
              About UCare
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground leading-tight mb-6">
              Bridging the gap in mental health care
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Addiction and alcohol abuse have far-reaching consequences, deeply affecting not only individuals but also their families. Family members often experience significant stress, anxiety, and emotional trauma.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Traditional mental health support can be prohibitively costly and often difficult to access. UCare is a digital platform designed to offer crucial emotional support through an intelligent AI chatbot and engaging community forums.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden aspect-[4/3]"
          >
            <img
              src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&auto=format&fit=crop&q=80"
              alt="People connecting and supporting each other"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* Scope */}
    <section className="bg-secondary py-24">
      <div className="container mx-auto px-4">
        <SectionHeading label="Project Scope" title="What UCare covers" />
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0} variants={fadeUp}
            className="bg-card border border-border rounded-xl p-8"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 font-sans">In Scope</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-primary mt-0.5">✓</span> AI chatbot for emotional support and coping strategies</li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">✓</span> Community discussion forum for peer encouragement</li>
              <li className="flex gap-2"><span className="text-primary mt-0.5">✓</span> Curated mental health resources and awareness materials</li>
            </ul>
          </motion.div>
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1} variants={fadeUp}
            className="bg-card border border-border rounded-xl p-8"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 font-sans">Out of Scope</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><span className="text-destructive mt-0.5">✗</span> Medical diagnosis or treatment plans</li>
              <li className="flex gap-2"><span className="text-destructive mt-0.5">✗</span> Professional therapy or clinical interventions</li>
              <li className="flex gap-2"><span className="text-destructive mt-0.5">✗</span> Emergency medical treatment or crisis intervention</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="py-24">
      <div className="container mx-auto px-4">
        <SectionHeading label="Our Team" title="The people behind UCare" description="A dedicated team from KIET Group of Institutions, Session 2025-26." />
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          {team.map((member, i) => (
            <motion.div
              key={member.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-center bg-card border border-border rounded-xl p-6"
            >
              <div className="w-16 h-16 rounded-full bg-accent mx-auto mb-4 flex items-center justify-center text-xl font-serif text-accent-foreground">
                {member.name[0]}
              </div>
              <h4 className="font-semibold text-foreground text-sm">{member.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{member.role}</p>
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {supervisors.map((s, i) => (
            <motion.div
              key={s.name} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="text-center"
            >
              <h4 className="font-semibold text-foreground text-sm">{s.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{s.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
