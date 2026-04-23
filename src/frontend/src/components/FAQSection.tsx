import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "motion/react";

const faqs = [
  {
    id: "what-is-prydo-id",
    q: "What is a Prydo ID?",
    a: "Prydo ID is a Soulbound NFT that represents your decentralized identity in the Prydo ecosystem.",
  },
  {
    id: "soulbound-nft",
    q: "What is a Soulbound NFT?",
    a: "Soulbound NFTs are non-transferable tokens tied permanently to a wallet identity. They cannot be sold, transferred, or taken away.",
  },
  {
    id: "transfer",
    q: "Can I sell my Prydo ID?",
    a: "No. Prydo IDs are Soulbound NFTs and cannot be transferred or sold. Your identity is yours permanently.",
  },
  {
    id: "why-mint",
    q: "Why mint a Prydo ID?",
    a: "To participate in the Prydo ecosystem, build your on-chain identity, access community features, and be part of a global LGBTQ+ Web3 movement.",
  },
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold tracking-[0.3em] text-pride-gradient uppercase mb-3">
            FAQ
          </p>
          <h2 className="font-display font-bold text-4xl sm:text-5xl text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            Everything you need to know about Prydo ID and the Prydo ecosystem.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Accordion
            type="single"
            collapsible
            className="flex flex-col gap-3"
            data-ocid="faq.list"
          >
            {faqs.map((faq, i) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="glass-card rounded-2xl border border-white/10 px-6 overflow-hidden"
                data-ocid={`faq.item.${i + 1}`}
              >
                <AccordionTrigger className="text-left text-white font-semibold hover:no-underline hover:text-white/90 py-5 text-sm sm:text-base">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
