import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const VitaleFAQ = () => {
  const faqs = [
    {
      question: "Why only 3 days when others say weeks?",
      answer: "Most people think you need weeks to 'mature' a starter, but that's based on old myths. With proper dehydration and reactivation techniques, a healthy starter can be ready to bake in just 3 days. The key is starting with quality dehydrated starter that reactivates quickly."
    },
    {
      question: "What makes your dehydration process different?",
      answer: "We use the Brød & Taylor Sahara dehydrator with precise temperature control. This ensures the starter is properly dehydrated without killing the beneficial microorganisms. Many people try to dehydrate at home with ovens or other methods that are too hot and damage the starter."
    },
    {
      question: "What if it doesn't work?",
      answer: "We offer a 100% satisfaction guarantee. If your starter doesn't activate properly, we'll send you a replacement or full refund. We also provide email support and detailed troubleshooting guides."
    },
    {
      question: "How long does the sachet last unopened?",
      answer: "When stored in a cool, dry place, the dehydrated starter can last 2+ years. We recommend using within 18 months for best results, but properly stored starter remains viable much longer."
    },
    {
      question: "Can I really build two starters from one sachet?",
      answer: "Absolutely! Each sachet contains enough dehydrated starter to create two separate, full-sized starters. This gives you a backup in case something happens to your main starter, or you can share one with a friend."
    },
    {
      question: "What's your guarantee?",
      answer: "If your starter doesn't activate within 5 days of following our instructions, we'll replace it free of charge or provide a full refund. We're confident in our process and stand behind every sachet."
    },
    {
      question: "How do you test quality monthly?",
      answer: "Henry personally tests each batch by reactivating samples in his own kitchen. Only batches that meet his standards for activity and flavor are packaged for sale. This ensures consistent quality year-round."
    }
  ];

  return (
    <section className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about Vitale
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-2 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};