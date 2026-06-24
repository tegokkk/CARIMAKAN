import LenisProvider from "./LenisProvider";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { Toaster } from "react-hot-toast";

function AppProvider({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <LenisProvider>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3200,
              style: {
                border: "2px solid #281712",
                borderRadius: "0",
                background: "#ffffff",
                color: "#281712",
                boxShadow: "4px 4px 0 #281712",
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: "13px",
                fontWeight: 700,
                padding: "12px 14px",
              },
              success: {
                iconTheme: {
                  primary: "#aa3000",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ba1a1a",
                  secondary: "#ffffff",
                },
              },
            }}
          />
          {children}
        </LenisProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default AppProvider;
