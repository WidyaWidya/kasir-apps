import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { SessionProvider } from '@/providers/SessionProvider';
import { SettingProvider } from '@/context/SettingContext';
import NextTopLoader from 'nextjs-toploader';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} dark:bg-gray-900 overflow-x-hidden`}>
        <NextTopLoader color="#3B82F6" showSpinner={false} />
        <SessionProvider>
          <ThemeProvider>
            <SidebarProvider>
              <SettingProvider>
                {children}
              </SettingProvider>
            </SidebarProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
