
type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "8xl" | "9xl";
  className?: string;
  isLoading: boolean;
  color?: string;
};

export function LoadingSpinner({ size = "xl", className, isLoading, color = "primary" }: LoadingSpinnerProps) {
  return <i className={`${className} ${!isLoading && "hidden"} text-${color} animate-spin bx bx-loader-alt text-${size}`}></i>;
}
