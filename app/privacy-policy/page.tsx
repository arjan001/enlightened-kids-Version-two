import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">Privacy Policy</CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Last updated: July 18, 2025</p>
          </CardHeader>
          <CardContent className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Introduction</h2>
              <p>
                Welcome to Enlightened Kids Africa. We are committed to protecting your privacy and ensuring you have a
                positive experience on our website. This Privacy Policy outlines how we collect, use, disclose, and
                safeguard your information when you visit our website enlightenedkidsafrica.com.
              </p>
              <p>
                By using our website, you agree to the collection and use of information in accordance with this policy.
                If you do not agree with the terms of this Privacy Policy, please do not access or use the website.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                2. Information We Collect
              </h2>
              <p>
                We may collect personal identification information from Users in a variety of ways, including, but not
                limited to, when Users visit our site, register on the site, place an order, subscribe to the
                newsletter, respond to a survey, fill out a form, and in connection with other activities, services,
                features or resources we make available on our Site.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain
                  personally identifiable information that can be used to contact or identify you. Personally
                  identifiable information may include, but is not limited to: Email address, First name and last name,
                  Phone number, Address, State, Province, ZIP/Postal code, City, Cookies and Usage Data.
                </li>
                <li>
                  <strong>Usage Data:</strong> We may also collect information how the Service is accessed and used
                  ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol
                  address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the
                  time and date of your visit, the time spent on those pages, unique device identifiers and other
                  diagnostic data.
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                3. How We Use Your Information
              </h2>
              <p>The information we collect is used for various purposes:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>To provide and maintain our Service</li>
                <li>To notify you about changes to our Service</li>
                <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                <li>To provide customer support</li>
                <li>To gather analysis or valuable information so that we can improve our Service</li>
                <li>To monitor the usage of our Service</li>
                <li>To detect, prevent and address technical issues</li>
                <li>
                  To provide you with news, special offers and general information about other goods, services and
                  events which we offer that are similar to those that you have already purchased or enquired about
                  unless you have opted not to receive such information
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Disclosure Of Data</h2>
              <p>We may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>To comply with a legal obligation</li>
                <li>To protect and defend the rights or property of Enlightened Kids Africa</li>
                <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
                <li>To protect the personal safety of users of the Service or the public</li>
                <li>To protect against legal liability</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">5. Security Of Data</h2>
              <p>
                The security of your data is important to us, but remember that no method of transmission over the
                Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable
                means to protect your Personal Data, we cannot guarantee its absolute security.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                6. Changes To This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                Changes to this Privacy Policy are effective when they are posted on this page.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">7. Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>By email: info@enlightenedkidsafrica.com</li>
                <li>By visiting this page on our website: /contact</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  )
}
