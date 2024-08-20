import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

import { ModalProviders } from "@/components/providers/modal-providers";
import { QueryProviders } from "@/components/providers/query-providers";

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <QueryProviders>
        <Toaster />
        <ModalProviders />
        {children}
      </QueryProviders>
    </ClerkProvider>
  );
};

export default PlatformLayout;
