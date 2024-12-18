import { describe, it, expect, assert } from 'vitest';
import { splitIntervalByDays } from '$lib/utils/time'
import { DateTime, Interval } from 'luxon';


describe('Splitting interval by days', () => {
	it('splits same day interval', () => {
        const start = DateTime.fromISO('2024-12-17T22:33:09.642+00:00')
        const end = DateTime.fromISO('2024-12-17T23:33:09.642+00:00')
        const interval = Interval.fromDateTimes(start, end)

        // Confirm interval is valid: start is before end
        assert(interval.isValid)

        const intervals = splitIntervalByDays(interval)

        expect(intervals).toStrictEqual([interval])
	});

	it('splits interval spanning two days', () => {
        const start = DateTime.fromISO('2024-12-17T22:33:09.642+00:00')
        const end = DateTime.fromISO('2024-12-18T23:33:09.642+00:00')
        const interval = Interval.fromDateTimes(start, end)

        // Confirm interval is valid: start is before end
        assert(interval.isValid)

        const intervals = splitIntervalByDays(interval)

        const endOfDay = start.startOf("day").plus({days: 1})

        expect(intervals).toStrictEqual([
            Interval.fromDateTimes(start, endOfDay),
            Interval.fromDateTimes(endOfDay, end),
        ])
	});

	it('splits interval spanning three days', () => {
        const start = DateTime.fromISO('2024-12-17T22:33:09.642+00:00')
        const end = DateTime.fromISO('2024-12-19T23:33:09.642+00:00')
        const interval = Interval.fromDateTimes(start, end)

        // Confirm interval is valid: start is before end
        assert(interval.isValid)

        const intervals = splitIntervalByDays(interval)

        const endOfDay = start.startOf("day").plus({days: 1})
        const endOfNextDay = start.startOf("day").plus({days: 2})

        expect(intervals).toStrictEqual([
            Interval.fromDateTimes(start, endOfDay),
            Interval.fromDateTimes(endOfDay, endOfNextDay),
            Interval.fromDateTimes(endOfNextDay, end),
        ])
	});
});

describe.skip('Calculating overlay positions', () => {
    it('calculates left position of an interval', () => {

    })
})
