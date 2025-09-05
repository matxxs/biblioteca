"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ReturnButton({
  variant = "ghost",
  short = false,
  ...props
}: ComponentProps<typeof Button> & { short?: boolean }) {
  const router = useRouter()

  return (
    <Button
      variant={variant}
      onClick={() => router.back()}
      className={cn("group hover:bg-transparent transition-all duration-200", props.className)}
      {...props}
    >
      <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-200" />
      {short ? null : "Retornar"}
    </Button>
  )
}
