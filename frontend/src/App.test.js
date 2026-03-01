import { render, screen } from "@testing-library/react";
import ShopContextProvider from "./Context/ShopContext";
import App from "./App";

test("renders navbar with SHOPPER brand", () => {
  render(
    <ShopContextProvider>
      <App />
    </ShopContextProvider>
  );
  const brand = screen.getByText(/shopper/i);
  expect(brand).toBeInTheDocument();
});