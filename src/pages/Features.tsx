import { motion } from "framer-motion";
import { MessageCircle, Users, BookOpen, Shield, Smartphone, Brain } from "lucide-react";
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

const features = [
  {
    icon: Brain,
    title: "AI-Powered Chatbot",
    description: "An empathetic AI companion trained to provide personalized emotional guidance, coping strategies, and support — available around the clock.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80",
  },
  {
    icon: Users,
    title: "Community Support",
    description: "A safe, moderated online forum where users share experiences, offer encouragement, and connect with others on their recovery journey.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&auto=format&fit=crop&q=80",
  },
  {
    icon: BookOpen,
    title: "Educational Resources",
    description: "Comprehensive, curated materials covering addiction awareness, recovery pathways, mental health tips, and well-being strategies.",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Robust data encryption and privacy measures ensure all conversations and personal information remain strictly confidential.",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=600&auto=format&fit=crop&q=80",
  },
  {
    icon: Smartphone,
    title: "Accessible Design",
    description: "An intuitive, responsive interface designed for users of all technical abilities, accessible on any device, anywhere.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
  },
  {
    icon: MessageCircle,
    title: "Real-time Guidance",
    description: "Instant responses powered by RAG and Langchain, offering contextually relevant and helpful advice in real time.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
  },
];

const Features = () => (
  <Layout>
    <section className="py-24 md:py-32">
      <div className="container mx-auto px-4">
        <SectionHeading
          label="Features"
          title="Everything you need for mental wellness"
          description="UCare combines AI intelligence with human compassion to deliver a comprehensive support experience."
        />

        <div className="space-y-20">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className={`grid md:grid-cols-2 gap-10 items-center ${
                i % 2 === 1 ? "md:direction-rtl" : ""
              }`}
            >
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <div className="rounded-2xl overflow-hidden aspect-[3/2]">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Features;
