import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'JavaScript 代码在线运行器',
  description: 'js 代码在线运行器',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="cn">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
