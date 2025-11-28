import type { Metadata } from 'next'
import { Arimo } from 'next/font/google'
import '@/app/globals.css'
import { Providers } from '@/providers/providers'
import { Toaster as SonnerToaster } from '@/components/sonner'
import { Toaster } from '@/components/toaster'

const arimo = Arimo({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dream House',
  description: 'Created by Kaiky 2025',


  icons: {
    icon: '/favicon.ico',
  },

}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={arimo.className}>
        <Providers>
          {children}
          <SonnerToaster />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
