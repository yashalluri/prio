import { Loader2 } from "lucide-react";

export default function ChatLoading() {
  return (
    <div className="flex h-[calc(100vh-3rem)] items-center justify-center">
      <Loader2 className="text-muted-foreground size-6 animate-spin" />
    </div>
  );
}
