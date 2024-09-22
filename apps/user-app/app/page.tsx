import { Button } from "@repo/ui/button";
import { PrismaClient } from "@repo/db/client"


import { DarkThemeToggle } from "flowbite-react";
import React from "react";

export default function Home() {
  return (
    <div>
      <main>
        <DarkThemeToggle />
        <Button appName="tewt">ret</Button>
      </main>
    </div>
  );
}
