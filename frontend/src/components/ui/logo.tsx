import * as React from "react";
import { cn } from "@/utils/styleUtils";

/* ---------------- Logo root ---------------- */

type LogoProps = React.HTMLAttributes<HTMLSpanElement>;

const Logo = React.forwardRef<HTMLSpanElement, LogoProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "relative inline-flex h-20 w-20 shrink-0 overflow-hidden rounded-full bg-muted",
        className
      )}
      {...props}
    />
  )
);
Logo.displayName = "Logo";

/* ---------------- Logo image ---------------- */

type LogoImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

const LogoImage = React.forwardRef<HTMLImageElement, LogoImageProps>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn(
        "aspect-square h-full w-full object-cover",
        className
      )}
      {...props}
    />
  )
);
LogoImage.displayName = "LogoImage";

/* ---------------- Logo fallback ---------------- */

type LogoFallbackProps = React.HTMLAttributes<HTMLSpanElement>;

const LogoFallback = React.forwardRef<
  HTMLSpanElement,
  LogoFallbackProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
));
LogoFallback.displayName = "LogoFallback";

export { Logo, LogoImage, LogoFallback };
