"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">Customer Support</h1>
      <p className="text-lg text-center text-muted-foreground mb-12">
        We're here to help you with any questions or issues you might have regarding your purchases and access to our
        books. Your satisfaction is our priority!
      </p>

      {/* Accessing Purchased Books */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-primary">Accessing Your Purchased Books</h2>
        <div className="space-y-6 text-foreground">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Digital Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                For digital books (e-books, booklets, etc.), you will receive a download link in your order confirmation
                email. Please check your inbox (and spam/junk folder) for an email from "Enlightened Kids Africa" with
                the subject "Your Order Confirmation and Download Links". Click the link provided to download your
                digital content directly.
              </p>
              <p>
                If you encounter any issues with the download link or accessing the file, please refer to our
                troubleshooting section below or contact us directly.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Physical Book Delivery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Physical books are shipped to the address provided during checkout. Once your order is processed and
                dispatched, you will receive a separate shipping confirmation email containing tracking information (if
                applicable). This email will allow you to monitor the delivery status of your physical book(s).
              </p>
              <p>
                Delivery times may vary based on your location. Please allow the estimated delivery time frame before
                contacting us about your shipment.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Order Confirmation Process */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-primary">Order Confirmation & Processing</h2>
        <Card className="text-foreground">
          <CardContent className="pt-6">
            <p className="mb-4">
              Please note that all orders currently undergo a **manual verification process** to ensure accuracy and
              security. This means your order confirmation email, including any download links for digital products,
              will be sent out after our team has manually reviewed and confirmed your purchase.
            </p>
            <p className="mb-4">
              We kindly ask for your patience during this period. You will receive a follow-up email with your complete
              order details and access information as soon as this manual verification is complete. We are working
              diligently to process all orders as quickly as possible.
            </p>
            <p>Thank you for your understanding and support!</p>
          </CardContent>
        </Card>
      </section>

      {/* Troubleshooting & Delays */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6 text-primary">Troubleshooting & Delays</h2>
        <div className="space-y-6 text-foreground">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Stuck at Checkout?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                If you're experiencing issues during the checkout process, such as payment failures or the page
                freezing, please try the following:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Clear your browser's cache and cookies.</li>
                <li>Try using a different web browser or device.</li>
                <li>Ensure your internet connection is stable.</li>
                <li>Double-check all payment details for accuracy.</li>
              </ul>
              <p>
                If the problem persists, please contact our support team with details of the issue, including any error
                messages you received.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Pending Downloads (Bonus Books)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                For any extra or bonus digital books that are part of your purchase, please be aware that these may
                sometimes have a separate processing time. While your main purchase might be immediately accessible,
                bonus content might be delivered in a subsequent email or become available after a short delay.
              </p>
              <p>
                This is typically due to system processing or manual allocation. We appreciate your patience as we
                ensure all your purchased content is delivered.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Physical Book Delivery Status</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Once your physical book order has been dispatched, you will receive a shipping confirmation email. This
                email will contain a tracking number (if available) that you can use to monitor your package's journey.
              </p>
              <p>
                If you haven't received a shipping confirmation within 3-5 business days of your order confirmation, or
                if your tracking information hasn't updated for an extended period, please reach out to us.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-3xl font-semibold text-center mb-8 text-primary">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
              How do I access my digital book after purchase?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              You will receive a download link in your order confirmation email. Please check your inbox, including
              spam/junk folders.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
              What should I do if my payment fails at checkout?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              Try clearing your browser cache, using a different browser, or checking your internet connection. If
              issues persist, contact our support team.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
              Why is my bonus book download pending?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              Bonus content may have a separate processing time due to system allocation. Please be patient; it will be
              delivered shortly.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
              How can I track my physical book order?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              A shipping confirmation email with tracking information will be sent once your order is dispatched.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
              How long does order confirmation take?
            </AccordionTrigger>
            <AccordionContent className="text-foreground">
              Orders undergo manual verification. You will receive a follow-up email with full details once this process
              is complete. We appreciate your patience.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Contact Section */}
      <section className="mt-12 text-center text-foreground">
        <h2 className="text-3xl font-semibold mb-4 text-primary">Still Need Help?</h2>
        <p className="mb-6">
          If your question isn't answered here, or if you need further assistance, please don't hesitate to reach out to
          our dedicated support team.
        </p>
        <Link href="/contact">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-lg px-8 py-3 rounded-lg">
            Contact Us
          </Button>
        </Link>
      </section>
    </div>
  )
}
