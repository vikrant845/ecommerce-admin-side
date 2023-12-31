import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import ModalProvider from '@/providers/modal_provider'
import { Provider } from 'react-redux'
import { store } from '@/states/store'
import StoreProvider from '@/hooks/useStoreProvider'
import ToastProvider from '@/providers/toast_provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-Commerce Admin',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <StoreProvider>
            <ToastProvider />
            <ModalProvider />
            {children}
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
