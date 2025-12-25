import React from 'react'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { Cookie } from 'lucide-react'
import Layout from '../components/layout/Layout'

export default function CookiePolicy() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-background via-muted/20 to-muted/10 py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            <Cookie className="h-4 w-4 mr-2" />
            Legal
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            This policy explains how cookies are used on our website.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-lg">
            <CardContent className="space-y-8 p-6 sm:p-10">
              <div>
                <h2 className="text-xl font-semibold mb-2">What Are Cookies?</h2>
                <p className="text-muted-foreground">
                  Cookies are small files stored on your device to improve user experience.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">How We Use Cookies</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Website functionality</li>
                  <li>Analytics & performance</li>
                  <li>User experience improvement</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Managing Cookies</h2>
                <p className="text-muted-foreground">
                  You can disable cookies through your browser settings at any time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  )
}

