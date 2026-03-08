import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary px-4">
      <Link href="/" className="mb-8 flex flex-col items-center gap-3">
        <div className="overflow-hidden rounded-[10px] border border-border/30 bg-card p-1 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)]">
          <Image
            src="/images/logo-nsa.png"
            alt="Paróquia Nossa Senhora Aparecida"
            width={64}
            height={64}
            className="h-14 w-auto rounded-[10px]"
          />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-foreground">
            Paróquia Nossa Senhora Aparecida
          </p>
          <p className="text-xs text-muted-foreground">Maringá — PR</p>
        </div>
      </Link>
      {children}
    </div>
  );
}
