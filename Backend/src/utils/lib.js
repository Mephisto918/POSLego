function toDateAndTime(dateProperty) { // needs a date property
    const dateObj = new Date(dateProperty);
    const date = dateObj.toISOString().split('T')[0];
    const time = dateObj.toISOString().split('T')[1].slice(0, -8);

    return {
        date,
        time
    }
}

export { toDateAndTime };