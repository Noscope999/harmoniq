import { Badge } from "@/components/ui/badge";

interface InterestBadgeProps {
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
}

export default function InterestBadge({ 
  label, 
  variant = "primary", 
  className = ""
}: InterestBadgeProps) {
  const baseClasses = "px-3 py-1 rounded-full";
  
  const variantClasses = {
    primary: "bg-primary bg-opacity-10 text-primary hover:bg-primary hover:bg-opacity-20",
    secondary: "bg-secondary bg-opacity-10 text-secondary hover:bg-secondary hover:bg-opacity-20"
  };
  
  return (
    <Badge
      variant="outline" 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {label}
    </Badge>
  );
}
