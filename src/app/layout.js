import './globals.css';
import ClientLayout from '@/lib/client-layout';

// export const metadata = {
//   title: 'Flaer CRM',
//   description: 'Welcome to FlaerHomes CRM',
// };

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='bg-lightPurple antialiased flex'>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
