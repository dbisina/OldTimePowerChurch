import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ConnectModal } from "../ConnectModal";
import { Toaster } from "@/components/ui/toaster";

export default function ConnectModalExample() {
  const [open, setOpen] = useState(true);

  return (
    <div className="p-4">
      <Button onClick={() => setOpen(true)}>Open Connect Modal</Button>
      <ConnectModal open={open} onOpenChange={setOpen} />
      <Toaster />
    </div>
  );
}
