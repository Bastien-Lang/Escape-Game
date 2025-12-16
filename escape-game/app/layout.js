import { InventoryProvider } from "./context/InventoryContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <InventoryProvider>
          {children}
        </InventoryProvider>
      </body>
    </html>
  );
}
