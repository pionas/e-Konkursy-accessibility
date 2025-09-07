function registerLoggerTasks(on) {
    on("task", {
        log: (msg) => {
            console.log(msg);
            return null;
        },
        table: (msg) => {
            console.table(msg);
            return null;
        },
    });
}

module.exports = { registerLoggerTasks };
