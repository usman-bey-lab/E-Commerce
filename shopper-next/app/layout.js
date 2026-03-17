import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { ShopContextProvider } from "@/context/ShopContext";
import "./globals.css";

export const metadata = {
  title: "Shopper",
  description: "Your one-stop fashion store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ShopContextProvider>
          <Navbar />
          {children}
          <Footer />
        </ShopContextProvider>
      </body>
    </html>
  );
}
