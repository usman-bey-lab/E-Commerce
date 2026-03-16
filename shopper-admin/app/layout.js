import './globals.css'

export const metadata = {
  title: 'Shopper Admin',
  description: 'Shopper Admin Panel',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}