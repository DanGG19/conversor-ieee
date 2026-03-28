import "./globals.css";

export const metadata = {
  title: "Conversor IEEE 754",
  description: "Conversor didáctico paso a paso para IEEE 754",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}