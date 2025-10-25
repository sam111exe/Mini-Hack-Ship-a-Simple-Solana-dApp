import React from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeader } from "@/components/section_header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const HomeSection: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "bx-buildings",
      title: "Real Estate Tokenization",
      description:
        "Convert your properties into digital tokens on the blockchain for fractional ownership and increased liquidity.",
    },
    {
      icon: "bx-shield-check",
      title: "Secure & Transparent",
      description:
        "All transactions are secured by blockchain technology with complete transparency and immutable records.",
    },
    {
      icon: "bx-group",
      title: "Fractional Ownership",
      description: "Buy and sell fractions of real estate properties, making investment accessible to everyone.",
    },
    {
      icon: "bx-line-chart",
      title: "Liquid Investment",
      description:
        "Trade your property tokens anytime, providing liquidity to traditionally illiquid real estate investments.",
    },
    {
      icon: "bx-check-shield",
      title: "KYC Verified",
      description: "All users undergo thorough KYC verification ensuring a secure and compliant marketplace.",
    },
    {
      icon: "bx-world",
      title: "Global Access",
      description: "Access real estate opportunities from anywhere in the world, breaking geographical barriers.",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create Account & Complete KYC",
      description: "Sign up with your wallet and complete the KYC verification process to ensure compliance.",
    },
    {
      number: "2",
      title: "Explore Properties",
      description: "Browse through our curated list of tokenized real estate properties from around the world.",
    },
    {
      number: "3",
      title: "Invest in Fractions",
      description: "Purchase fractional ownership in properties that match your investment goals and budget.",
    },
    {
      number: "4",
      title: "Manage & Trade",
      description: "Track your portfolio, receive rental income, and trade your tokens on our marketplace.",
    },
  ];

  const benefits = [
    {
      icon: "bx-dollar-circle",
      title: "Lower Entry Barriers",
      description: "Start investing in real estate with minimal capital through fractional ownership.",
    },
    {
      icon: "bx-time",
      title: "24/7 Trading",
      description: "Trade your property tokens anytime, unlike traditional real estate markets.",
    },
    {
      icon: "bx-globe",
      title: "Diversification",
      description: "Build a diversified portfolio across different properties and locations.",
    },
    {
      icon: "bx-trending-up",
      title: "Passive Income",
      description: "Earn rental income proportional to your ownership stake.",
    },
  ];

  const faqs = [
    {
      question: "What is real estate tokenization?",
      answer:
        "Real estate tokenization is the process of converting property ownership rights into digital tokens on a blockchain. Each token represents a fraction of the property, allowing multiple investors to own shares of real estate.",
    },
    {
      question: "How secure is the platform?",
      answer:
        "Our platform uses blockchain technology to ensure all transactions are secure, transparent, and immutable. Additionally, all users must complete KYC verification, and smart contracts govern all transactions.",
    },
    {
      question: "What are the minimum investment requirements?",
      answer:
        "The minimum investment varies by property but typically starts as low as $100, making real estate investment accessible to a broader range of investors.",
    },
    {
      question: "How do I receive rental income?",
      answer:
        "Rental income is distributed automatically to token holders proportional to their ownership stake. Payments are made directly to your wallet on a monthly basis.",
    },
    {
      question: "Can I sell my tokens anytime?",
      answer:
        "Yes, you can list your tokens for sale on our marketplace at any time. The liquidity depends on market demand, but tokenization generally provides much more liquidity than traditional real estate.",
    },
    {
      question: "What properties can be tokenized?",
      answer:
        "Currently, we support residential and commercial properties. Each property undergoes thorough due diligence before being listed on our platform.",
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <Badge className="mb-4" variant="secondary">
          <i className="bx bx-trending-up mr-1"></i>
          The Future of Real Estate Investment
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight">Tokenize Your Real Estate Assets</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your properties into digital tokens on the blockchain. Enable fractional ownership, increase
          liquidity, and unlock new investment opportunities.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button size="lg" onClick={() => navigate("/explore")}>
            <i className="bx bx-search-alt mr-2"></i>
            Explore Properties
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/assets/real")}>
            <i className="bx bx-plus-circle mr-2"></i>
            List Your Property
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-6">
        <SectionHeader
          icon={<i className="bx bx-star"></i>}
          title="Platform Features"
          subtitle="Everything you need for modern real estate investment"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <i className={`bx ${feature.icon} text-2xl text-primary`}></i>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="space-y-6">
        <SectionHeader
          icon={<i className="bx bx-list-ol"></i>}
          title="How It Works"
          subtitle="Get started in four simple steps"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="h-full">
                <CardHeader>
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                    {step.number}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <i className="bx bx-chevron-right text-2xl text-muted-foreground"></i>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="space-y-6">
        <SectionHeader
          icon={<i className="bx bx-trophy"></i>}
          title="Why Choose Solday"
          subtitle="Benefits of tokenized real estate investment"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <i className={`bx ${benefit.icon} text-2xl text-primary`}></i>
                  {benefit.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{benefit.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <SectionHeader
          icon={<i className="bx bx-help-circle"></i>}
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions"
        />
        <Card>
          <CardContent className="pt-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="text-center py-12 space-y-4">
          <h2 className="text-3xl font-bold">Ready to Start Your Journey?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of investors who are already benefiting from tokenized real estate. Start building your
            portfolio today.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" variant="secondary" onClick={() => navigate("/settings/kyc")}>
              <i className="bx bx-user-check mr-2"></i>
              Complete KYC
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              onClick={() => navigate("/explore")}
            >
              <i className="bx bx-search mr-2"></i>
              Browse Properties
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
