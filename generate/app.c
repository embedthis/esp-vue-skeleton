/*
    app.c -- ${TITLE} Application Module (esp-mvc)

    This module is loaded when ESP starts.
 */
#include "esp.h"

/*
    This base for controllers is called before processing each request
 */
static void base(HttpStream *stream, EspAction *action) {
    setHeader("Access-Control-Allow-Origin", "%s", stream->rx->origin);
    setContentType("application/json");

    if (smatch(stream->rx->method, "OPTIONS")) {
        setStatus(200);
        finalize();
        return;
    }
}

ESP_EXPORT int esp_app_${NAME}(HttpRoute *route) {
    espController(route, base);
    return 0;
}
