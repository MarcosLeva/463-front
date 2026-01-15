import { FileCode } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="rounded-full bg-primary/10 p-4 text-primary">
          <FileCode className="h-10 w-10" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Tailwind Canvas
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          This is your blank canvas. Start by editing{" "}
          <code className="rounded bg-muted px-2 py-1 font-mono font-medium">
            src/app/page.tsx
          </code>
          . The world is your oyster.
        </p>
      </div>
    </main>
  );
}
