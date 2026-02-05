"use client";

import Link from "next/link";
import { Clapperboard, Search, Bookmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useWatchlist } from "@/contexts/watchlist-context";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { watchlist } = useWatchlist();

  const form = useForm({
    defaultValues: {
      search: searchParams.get("q") || "",
    },
  });

  function onSubmit(data: { search: string }) {
    if (data.search) {
      router.push(`/search?q=${data.search}`);
    } else {
      router.push("/");
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Clapperboard className="h-6 w-6 text-primary" />
          <span className="font-bold font-headline text-lg hidden sm:inline-block">
            CineView
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="search"
                          placeholder="Search films, actors..."
                          className="pl-10 h-9"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </form>
            </Form>
          </div>
          <nav className="flex items-center gap-2">
             <Link href="/watchlist">
              <Button variant="ghost" size="icon" aria-label="Watchlist" className="relative">
                <Bookmark className="h-5 w-5" />
                {watchlist.length > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                    {watchlist.length}
                    </span>
                )}
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
