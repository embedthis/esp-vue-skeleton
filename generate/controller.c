/*
    ${CONTROLLER} Controller (esp-vue-skeleton)
 */
#include "esp.h"

/*
    Create a new resource in the database
 */
static void create${UCONTROLLER}() {
    sendResult(updateRec(createRec("${TABLE}", params("fields"))));
}

/*
    Get a resource
 */
static void get${UCONTROLLER}() {
    sendRec(readRec("${TABLE}", param("id")));
}

/*
    Initialize a new resource for the client to complete
 */
static void init${UCONTROLLER}() {
    sendRec(createRec("${TABLE}", NULL));
}

/*
    List the resources in this group
 */
static void list${UCONTROLLER}() {
    sendGrid(findGrid("${TABLE}", NULL));
}

/*
    Redirect to get a properly terminated URL. Essential for relative URL references.
 */
static void redirect${UCONTROLLER}() {
    redirect(sjoin(getUri(), "/", NULL));
}

/*
    Remove a resource identified by the request params
 */
static void remove${UCONTROLLER}() {
    //  MOB - will also by in ID
    sendResult(removeRec("${TABLE}", param("id")));
}

/*
    Update an existing resource in the database
    If "id" is not defined, this is the same as a create
 */
static void update${UCONTROLLER}() {
    sendResult(updateFields("${TABLE}", params("fields")));
}

/*
    Dynamic module initialization
 */
ESP_EXPORT int esp_controller_${NAME}_${CONTROLLER}(HttpRoute *route)
{
    cchar   *role = "user";

    espAction(route, "${CONTROLLER}/create", role, create${UCONTROLLER});
    espAction(route, "${CONTROLLER}/get", role, get${UCONTROLLER});
    espAction(route, "${CONTROLLER}/init", role, init${UCONTROLLER});
    espAction(route, "${CONTROLLER}/list", role, list${UCONTROLLER});
    espAction(route, "${CONTROLLER}/remove", role, remove${UCONTROLLER});
    espAction(route, "${CONTROLLER}/update", role, update${UCONTROLLER});
    espAction(route, "${CONTROLLER}/", role, list${UCONTROLLER});
    espAction(route, "${CONTROLLER}", role, redirect${UCONTROLLER});
${DEFINE_ACTIONS}

#if SAMPLE_VALIDATIONS
    Edi *edi = espGetRouteDatabase(route);
    ediAddValidation(edi, "present", "${CONTROLLER}", "title", 0);
    ediAddValidation(edi, "unique", "${CONTROLLER}", "title", 0);
    ediAddValidation(edi, "banned", "${CONTROLLER}", "body", "(swear|curse)");
    ediAddValidation(edi, "format", "${CONTROLLER}", "phone", "/^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/");
#endif
    return 0;

}
