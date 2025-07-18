import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-12 md:py-20">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
              Terms and Conditions
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">Last updated: July 18, 2025</p>
          </CardHeader>
          <CardContent className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">1. Introduction</h2>
              <p>
                Welcome to Enlightened Kids Africa. These Terms and Conditions ("Terms") govern your use of our website,
                enlightenedkidsafrica.com, and the services provided therein. By accessing or using our website, you
                agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access
                the Service.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                2. Intellectual Property Rights
              </h2>
              <p>
                Unless otherwise indicated, the Site is our proprietary property and all source code, databases,
                functionality, software, website designs, audio, video, text, photographs, and graphics on the Site
                (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the
                "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark
                laws and various other intellectual property rights and unfair competition laws of the United States,
                international copyright laws, and international conventions.
              </p>
              <p>
                The Content and the Marks are provided on the Site "AS IS" for your information and personal use only.
                Except as expressly provided in these Terms of Use, no part of the Site and no Content or Marks may be
                copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated,
                transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever,
                without our express prior written permission.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">3. User Representations</h2>
              <p>By using the Site, you represent and warrant that:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>you have the legal capacity and you agree to comply with these Terms of Use;</li>
                <li>you are not a minor in the jurisdiction in which you reside;</li>
                <li>
                  you will not access the Site through automated or non-human means, whether through a bot, script, or
                  otherwise;
                </li>
                <li>you will not use the Site for any illegal or unauthorized purpose;</li>
                <li>your use of the Site will not violate any applicable law or regulation.</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">4. Prohibited Activities</h2>
              <p>
                You may not access or use the Site for any purpose other than that for which we make the Site available.
                The Site may not be used in connection with any commercial endeavors except those that are specifically
                endorsed or approved by us.
              </p>
              <p>As a user of the Site, you agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  Systematically retrieve data or other content from the Site to create or compile, directly or
                  indirectly, a collection, compilation, database, or directory without written permission from us.
                </li>
                <li>
                  Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users
                  by electronic or other means for the purpose of sending unsolicited email, or creating user accounts
                  by automated means or under false pretenses.
                </li>
                <li>
                  Circumvent, disable, or otherwise interfere with security-related features of the Site, including
                  features that prevent or restrict use or copying of any Content or enforce limitations on the use of
                  the Site and/or the Content contained therein.
                </li>
                <li>Engage in unauthorized framing of or linking to the Site.</li>
                <li>
                  Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account
                  information such as user passwords.
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">5. Disclaimer</h2>
              <p>
                The Site is provided on an AS-IS and AS-AVAILABLE basis. You agree that your use of the Site and our
                services will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties,
                express or implied, in connection with the Site and your use thereof, including, without limitation, the
                implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We make
                no warranties or representations about the accuracy or completeness of the Site’s content or the content
                of any websites linked to the Site and we will assume no liability or responsibility for any (1) errors,
                mistakes, or inaccuracies of content and materials, (2) personal injury or property damage, of any
                nature whatsoever, resulting from your access to and use of the Site, (3) any unauthorized access to or
                use of our secure servers and/or any and all personal information and/or financial information stored
                therein, (4) any interruption or cessation of transmission to or from the Site, (5) any bugs, viruses,
                trojan horses, or the like which may be transmitted to or through the Site by any third party, and/or
                (6) any errors or omissions in any content and materials or for any loss or damage of any kind incurred
                as a result of the use of any content posted, transmitted, or otherwise made available via the Site.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">6. Governing Law</h2>
              <p>
                These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without
                regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms
                will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid
                or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
                7. Changes to Terms and Conditions
              </h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a
                revision is material we will try to provide at least 30 days notice prior to any new terms taking
                effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-3">8. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us:</p>
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
