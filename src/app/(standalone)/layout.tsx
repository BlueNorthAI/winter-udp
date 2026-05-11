import Image from "next/image";
import Link from "next/link";

interface StandloneLayoutProps {
  children: React.ReactNode;
};

const StandloneLayout = ({ children }: StandloneLayoutProps) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center h-[73px]">
          <Link href="/" className="flex items-center gap-2">
          <Image src="/assets/logo.png" alt="logo" width={40} height={40} />
          <Image src="/assets/Bluenorthai.png" alt="logo" width={180} height={180} />
          </Link>
        </nav>
        <div className="flex flex-col items-center justify-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
}
 
export default StandloneLayout;