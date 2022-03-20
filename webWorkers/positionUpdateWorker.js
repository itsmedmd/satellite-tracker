importScripts("satellite.min.js");

onmessage = function(event) {
    const results = [];
    const satrecs = event.data.satrecs;
    const now = event.data.now;
    const year = event.data.year;
    const month = event.data.month
    const date = event.data.date;
    const hr = event.data.hr;
    const min = event.data.min;
    const sec = event.data.sec;

    satrecs.forEach((record) => {
        if (record) { 
            const propagated = satellite.propagate(
                record,
                now.getUTCFullYear() + year,
                now.getUTCMonth() + 1 + month, // month has to be in range from 1 to 12
                now.getUTCDate() + date,
                now.getUTCHours() + hr,
                now.getUTCMinutes() + min,
                now.getUTCSeconds() + sec
            );

            if (propagated.position && propagated.velocity) {
                results.push(propagated);
            }
        }
    });

    postMessage(results);
};
