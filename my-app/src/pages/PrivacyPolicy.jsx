import React from 'react'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { ShieldCheck } from 'lucide-react'
import Layout from '../components/layout/Layout'

export default function PrivacyPolicy() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-background via-muted/20 to-muted/10 py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Legal
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Your privacy is important to Tikone Cricket Gurukul. This policy explains how we collect and use information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-lg">
            <CardContent className="space-y-8 p-6 sm:p-10">
              <div>
                <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
                <p className="text-muted-foreground">
                  We may collect personal details such as name, phone number, email address,
                  and academy-related information during registration or enquiry.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Student registration & communication</li>
                  <li>Academy updates and announcements</li>
                  <li>Improving our services</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Data Security</h2>
                <p className="text-muted-foreground">
                  We take reasonable steps to protect your personal information from unauthorized access.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
                <p className="text-muted-foreground">
                  For privacy-related concerns, email us at  
                  <span className="font-medium text-foreground"> tikonecricketgurukul@gmail.com</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  )
}

