import Footer from './Footer';
import Header from './Header';

export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr_auto] bg-background ">
      <Header />
      <div className="overflow-y-auto w-full">
        <main className="container mx-auto px-4 py-6  ">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
