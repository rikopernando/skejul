"use client"

import { toast as toastPrimitive } from "sonner"
import type { ToastProps } from "sonner"

export const toast = toastPrimitive

export function useToast() {
  return {
    toast,
  }
}