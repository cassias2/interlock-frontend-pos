import { AppBar, Toolbar, Typography } from "@mui/material";
import { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import AuthProvider from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Interlock",
  description: "Interlock Lot and Part Number Double Checker",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <AppBar position="fixed" sx={{ background: "#626F47" }}>
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
          </Toolbar>
        </AppBar>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
