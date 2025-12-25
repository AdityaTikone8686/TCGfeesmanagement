import React from 'react'
import { Badge } from '../components/ui/badge'
import { Card, CardContent } from '../components/ui/card'
import { FileText } from 'lucide-react'
import Layout from '../components/layout/Layout'

export default function TermsOfService() {
  return (
    <Layout>
      <section className="bg-gradient-to-br from-background via-muted/20 to-muted/10 py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="mb-4">
            <FileText className="h-4 w-4 mr-2" />
            Legal
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Terms of Service
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            These terms govern the use of Tikone Cricket Gurukul services and facilities.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="shadow-lg">
            <CardContent className="space-y-8 p-6 sm:p-10">
              <div>
                <h2 className="text-xl font-semibold mb-2">Academy Enrollment</h2>
                <p className="text-muted-foreground">
                  Enrollment is subject to availability and compliance with academy rules.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Code of Conduct</h2>
                <p className="text-muted-foreground">
                  Students must maintain discipline, respect coaches, and follow academy guidelines.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Fees & Payments</h2>
                <p className="text-muted-foreground">
                  Fees once paid are non-refundable unless explicitly stated by management.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Termination</h2>
                <p className="text-muted-foreground">
                  The academy reserves the right to terminate enrollment for misconduct or rule violations.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  )
}

