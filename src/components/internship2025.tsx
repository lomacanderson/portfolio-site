import Countdown, { CountdownRenderProps } from 'react-countdown';

const Completionist = () => <span>I'm back!</span>;

// Helper to calculate months and days between two dates
function getMonthsAndDays(start: Date, end: Date) {
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate() - 1;

    if (days < 0) {
        months -= 1;
        // Get days in previous month
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }
    return {
        months: years * 12 + months,
        days,
    };
}

const renderer = ({ hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
        return <Completionist />;
    } else {
        const now = new Date();
        const target = new Date('2026-06-16T00:00:00');
        const { months, days } = getMonthsAndDays(now, target);

        return (
            <div className='flex justify-center gap-3'>
                { [
                    { value: months, label: 'months' },
                    { value: days, label: 'days' },
                    { value: hours, label: 'hours' },
                    { value: minutes, label: 'minutes' },
                    { value: seconds, label: 'seconds' },
                ].map(({ value, label }) => (
                    <div key={label} className='flex bg-gray-100 rounded flex-col items-center h-23 w-18 justify-center'>
                        <span className='text-5xl font-bold'>{value}</span>
                        <span className='text-sm text-gray-500'>{label}</span>
                    </div>
                )) }
            </div>
        );
    }
};

export function Internship2025() {
    return (
        <section className='pt-10 flex flex-col'>
            <div className='text-5xl font-bold text-center justify-center'>
                <Countdown
                    date={new Date('2026-06-16T00:00:00')}
                    renderer={renderer}
                />
            </div>
        </section>
    );
}