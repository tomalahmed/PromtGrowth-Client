import { cn } from "@/lib/cn";

export function AuthField({ label, htmlFor, children, labelExtra }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          className="block text-[14px] font-medium leading-[1.4] text-on-surface-variant"
          htmlFor={htmlFor}
        >
          {label}
        </label>
        {labelExtra}
      </div>
      {children}
    </div>
  );
}

export function AuthInput({
  icon: Icon,
  className,
  inputClassName,
  ...props
}) {
  return (
    <div className={cn("relative", className)}>
      {Icon && (
        <Icon
          className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-outline-variant"
          strokeWidth={1.75}
        />
      )}
      <input
        className={cn(
          "w-full rounded-xl border border-outline-variant/25 bg-white py-3.5 text-[15px] text-on-surface outline-none transition-all placeholder:text-outline-variant/80 focus:border-primary-container focus:ring-2 focus:ring-primary-container/15",
          Icon ? "pl-11 pr-4" : "px-4",
          inputClassName
        )}
        {...props}
      />
    </div>
  );
}
