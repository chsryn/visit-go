import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

/** Step 2: rentang tanggal perjalanan (maks 30 hari). */
export default function StepDate({
    range,
    onSelectRange,
    month,
    onMonthChange,
    today,
    disabledAfter,
    isMobile,
    durationDays,
}) {
    return (
        <>
            <div className="text-center mb-4">
                <h3 className="font-display text-2xl font-bold text-foreground">Kapan petualanganmu dimulai?</h3>
                <p className="mt-1 text-sm text-muted-foreground">Pilih tanggal perjalananmu dan temukan tempat terbaik • Maks 30 hari</p>
            </div>
            <div className="bg-transparent">
                <CalendarPicker
                    mode="range"
                    selected={range}
                    onSelect={onSelectRange}
                    month={month}
                    onMonthChange={onMonthChange}
                    numberOfMonths={isMobile ? 1 : 2}
                    locale={localeId}
                    fromDate={today}
                    disabled={range.from ? [{ before: today }, { after: disabledAfter }] : { before: today }}
                    className="bg-transparent p-0 w-full [--cell-size:2rem] text-[13px] leading-none"
                    classNames={{
                        months: "flex flex-col md:flex-row gap-3 relative",
                        month: "bg-white/65 backdrop-blur-xl border border-white/30 rounded-2xl p-3.5 shadow-sm flex w-full flex-col gap-2 min-h-0",
                        month_caption: "h-7 text-[13px] font-semibold",
                        weekdays: "grid grid-cols-7 gap-px",
                        weekday: "flex items-center justify-center h-8 w-8 mx-auto text-[11px] leading-none",
                        week: "grid grid-cols-7 gap-px mt-1 w-full",
                        day: "flex items-center justify-center h-8 w-8 mx-auto p-0",
                        nav: "absolute inset-x-0 top-1.5 flex w-full items-center justify-between px-1.5 z-10 pointer-events-none",
                        button_previous: "relative z-20 pointer-events-auto",
                        button_next: "relative z-20 pointer-events-auto",
                    }}
                    showOutsideDays={false}
                />
            </div>
            <div className="mt-3 text-center text-sm text-gray-500">
                {range.from && range.to ? (
                    <p className="font-medium text-primary">{format(range.from, "d MMM yyyy", { locale: localeId })} — {format(range.to, "d MMM yyyy", { locale: localeId })} • <span className="font-bold">{durationDays} hari</span></p>
                ) : range.from ? (
                    <p>Pilih tanggal selesai (maks 30 hari, akan diburamkan jika lebih)</p>
                ) : (
                    <p>Pilih tanggal mulai dan selesai</p>
                )}
            </div>
        </>
    );
}
