import * as React from "react";
import { cn } from "@/utils/styleUtils";

/* ---------------- Banner root ---------------- */

type BannerProps = React.HTMLAttributes<HTMLSpanElement>;

const Banner = React.forwardRef<HTMLSpanElement, BannerProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "relative inline-flex w-full h-40 shrink-0 overflow-hidden rounded-xl bg-muted",
        className
      )}
      {...props}
    />
  )
);
Banner.displayName = "Banner";

/* ---------------- Banner image ---------------- */

type BannerImageProps = React.ImgHTMLAttributes<HTMLImageElement>;

const BannerImage = React.forwardRef<HTMLImageElement, BannerImageProps>(
  ({ className, ...props }, ref) => (
    <img
      ref={ref}
      className={cn(
        "h-full w-full object-cover",
        className
      )}
      {...props}
    />
  )
);
BannerImage.displayName = "BannerImage";

/* ---------------- Banner fallback ---------------- */

type BannerFallbackProps = React.HTMLAttributes<HTMLSpanElement>;

const BannerFallback = React.forwardRef<
  HTMLSpanElement,
  BannerFallbackProps
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center bg-muted text-sm font-medium text-muted-foreground",
      className
    )}
    {...props}
  />
));
BannerFallback.displayName = "BannerFallback";

export { Banner, BannerImage, BannerFallback };
