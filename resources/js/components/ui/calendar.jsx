"use client";
import * as React from "react";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
function Calendar({ className, classNames, showOutsideDays = true, captionLayout = "label", buttonVariant = "ghost", formatters, components, ...props }) {
    const defaultClassNames = getDefaultClassNames();
    return (<DayPicker showOutsideDays={showOutsideDays} className={cn("bg-background group/calendar p-3 [--cell-size:2rem] min-h-0 [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent", String.raw `rtl:**:[.rdp-button\_next>svg]:rotate-180`, String.raw `rtl:**:[.rdp-button\_previous>svg]:rotate-180`, className)} captionLayout={captionLayout} formatters={{
            formatMonthDropdown: (date) => date.toLocaleString("default", { month: "short" }),
            ...formatters,
        }} classNames={{
            ...classNames,
            root: cn("w-fit", defaultClassNames.root, classNames?.root),
            months: cn("relative flex flex-col gap-4 md:flex-row", defaultClassNames.months, classNames?.months),
            month: cn("flex w-full flex-col gap-4", defaultClassNames.month, classNames?.month),
            nav: cn("absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 z-10 pointer-events-none", defaultClassNames.nav, classNames?.nav),
            button_previous: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50 hover:bg-primary/10 hover:text-primary relative z-20 pointer-events-auto", defaultClassNames.button_previous),
            button_next: cn(buttonVariants({ variant: buttonVariant }), "h-(--cell-size) w-(--cell-size) select-none p-0 aria-disabled:opacity-50 hover:bg-primary/10 hover:text-primary relative z-20 pointer-events-auto", defaultClassNames.button_next),
            month_caption: cn("flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)", defaultClassNames.month_caption),
            dropdowns: cn("flex h-(--cell-size) w-full items-center justify-center gap-1.5 text-sm font-medium", defaultClassNames.dropdowns),
            dropdown_root: cn("has-focus:border-ring border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] relative rounded-md border", defaultClassNames.dropdown_root),
            dropdown: cn("bg-popover absolute inset-0 opacity-0", defaultClassNames.dropdown),
            caption_label: cn("select-none font-medium", captionLayout === "label"
                ? "text-sm"
                : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5", defaultClassNames.caption_label),
            table: "w-full border-collapse",
            weekdays: cn("grid grid-cols-7 gap-px", defaultClassNames.weekdays),
            weekday: cn("text-muted-foreground flex items-center justify-center h-8 w-8 select-none rounded-md text-[0.8rem] font-normal mx-auto", defaultClassNames.weekday),
            week: cn("grid grid-cols-7 gap-px mt-1 w-full", defaultClassNames.week),
            week_number_header: cn("w-(--cell-size) select-none", defaultClassNames.week_number_header),
            week_number: cn("text-muted-foreground select-none text-[0.8rem]", defaultClassNames.week_number),
            day: cn("group/day relative flex items-center justify-center h-8 w-8 aspect-square select-none p-0 text-center mx-auto [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md", defaultClassNames.day),
            range_start: cn("bg-transparent rounded-l-md", defaultClassNames.range_start),
            range_middle: cn("bg-transparent rounded-none", defaultClassNames.range_middle),
            range_end: cn("bg-transparent rounded-r-md", defaultClassNames.range_end),
            today: cn("bg-transparent text-foreground rounded-md", defaultClassNames.today),
            outside: cn("text-muted-foreground aria-selected:text-muted-foreground invisible pointer-events-none data-[range-start=true]:bg-transparent data-[range-middle=true]:bg-transparent data-[range-end=true]:bg-transparent opacity-0", defaultClassNames.outside),
            disabled: cn("text-muted-foreground opacity-30 cursor-not-allowed pointer-events-none bg-transparent", defaultClassNames.disabled),
            hidden: cn("invisible", defaultClassNames.hidden, classNames?.hidden),
        }} components={{
            Root: ({ className, rootRef, ...props }) => {
                return <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props}/>;
            },
            Chevron: ({ className, orientation, ...props }) => {
                if (orientation === "left") {
                    return <ChevronLeftIcon className={cn("size-4", className)} {...props}/>;
                }
                if (orientation === "right") {
                    return <ChevronRightIcon className={cn("size-4", className)} {...props}/>;
                }
                return <ChevronDownIcon className={cn("size-4", className)} {...props}/>;
            },
            DayButton: CalendarDayButton,
            WeekNumber: ({ children, ...props }) => {
                return (<td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>);
            },
            ...components,
        }} {...props}/>);
}
function CalendarDayButton({ className, day, modifiers, ...props }) {
    const defaultClassNames = getDefaultClassNames();
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (modifiers["focused"])
            ref.current?.focus();
    }, [modifiers]);
    return (<Button ref={ref} variant="ghost" size="icon" data-day={day.date.toLocaleDateString()} data-selected-single={modifiers["selected"] &&
            !modifiers["range_start"] &&
            !modifiers["range_end"] &&
            !modifiers["range_middle"]} data-range-start={modifiers["range_start"]} data-range-end={modifiers["range_end"]} data-range-middle={modifiers["range_middle"]} className={cn("hover:bg-primary/10 hover:text-primary data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-primary/10 data-[range-middle=true]:text-primary data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex h-8 w-8 items-center justify-center aspect-square min-w-0 p-0 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70", defaultClassNames.day, className)} {...props}/>);
}
export { Calendar, CalendarDayButton };
