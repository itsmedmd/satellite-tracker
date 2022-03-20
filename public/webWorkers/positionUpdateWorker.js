importScripts("satellite.min.js");

onmessage = function(event) {
    const results = [];
    const satrecs = event.data.satrecs;
    const now = event.data.now;

    satrecs.forEach((record) => {
        if (record) { 
            const propagated = satellite.propagate(
                record,
                now.getUTCFullYear(),
                now.getUTCMonth() + 1, // month has to be in range from 1 to 12
                now.getUTCDate(),
                now.getUTCHours(),
                now.getUTCMinutes(),
                now.getUTCSeconds()
            );

            if (propagated.position && propagated.velocity) {
                results.push(propagated);
            }
        }
    });

    postMessage(results);
};
