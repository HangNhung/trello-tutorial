import { cn } from "@/lib/utils";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";

const headerFont = localFont({
  src: "../public/fonts/Poppins-Black.ttf",
});

export const Logo = () => {
  return (
    <Link href={"/"}>
      <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
        <Image src={"/logo.svg"} alt="Taskify Logo" width={30} height={30} />
        <p
          className={cn("text-lg text-neutral-700 pb-1", headerFont.className)}>
          Taskify
        </p>
      </div>
    </Link>
  );
};
