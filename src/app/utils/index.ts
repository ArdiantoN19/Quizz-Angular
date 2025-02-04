// Password must have at least 1 capital character, 1 small character, and 1 number
export const patternPassword: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/

export const formatDate = (date: string): string => {
    const dateTime: number = new Date(date).getTime();
    const dateTimeNow: number = Date.now();
    const oneMinute =  60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;
    const oneYear = 365 * oneDay;

    const offsetTime: number = dateTimeNow - dateTime;

    const messages = [
        {
            time: oneMinute,
            message: '1 minute ago'
        },
        {
            time: oneHour,
            message: '1 hour ago'
        },
        {
            time: oneDay,
            message: '1 day ago'
        },
        {
            time: oneWeek,
            message: '1 week ago'
        },
        {
            time: oneMonth,
            message: '1 month ago'
        },
        {
            time: oneYear,
            message: '1 year ago'
        },
    ]

    const message = messages.find(({ time }) => offsetTime === time)?.message;

    if (message) {
        return message;
    }

    const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',   // 'long' untuk hari lengkap seperti 'Monday'
        day: 'numeric',    // 'numeric' untuk tanggal (misalnya 28)
        month: 'short',     // 'long' untuk nama bulan lengkap seperti 'January'
        year: 'numeric',   // 'numeric' untuk tahun 2025
      }

    return new Intl.DateTimeFormat('id-ID', options).format(dateTime)
}

export const formatSlug = (value: string, separator: string = '-') => {
    return value.toLowerCase().split(' ').join(separator)
}