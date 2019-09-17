/*
    Rest.js -

    export default new Rest('user', {
        check: { method: 'POST', uri: ':controller/check', ... },
        login: { method: 'POST', uri: ':controller/login' },
        logout: { method: 'POST', uri: ':controller/logout' },
    })

    APIs can have properties drawn from the js-net options. {
        base        Base url to use instead of the config.url.prefix
        clear       Clear prior feedback
        feedback    If false, never emit feedback. If true, emit feedback on success. Otherwise on errors.
        body        Post body data
        log         Set to true to trace the request and response
        method      HTTP method
        nologout    Don't logout if response is 401
        noparse     Don't json parse any JSON response
        progress    If true, show progress bar.
        raw         If true, return the full response object (see below). If false, return just the data.
        throw       If false, do not throw on errors
    }

    Callers then invoke as:

    import Model from '@/models/Model'

    Model.action(fields, options)
    Model.get({id: 2})
    Model.find(null, {raw: true})
    Model.find(null, {feedback: false, progress: true, method: 'DELETE', log: true})

    MOB - should we have auth abilities in the apis?  Controller will enforce anyway?
 */

/*
    SPA Route Table

    Path                                     Methods          Action
    ----                                     -------          ------
    ^/{controller}$                          GET,OPTIONS      $1
    ^/{controller}/{id=[0-9]+}/delete$       POST,OPTIONS     $1/delete
    ^/{controller}(/)*$                      POST,OPTIONS     $1/create
    ^/{controller}/{id=[0-9]+}/edit$         GET,OPTIONS      $1/edit
    ^/{controller}/{id=[0-9]+}               GET,OPTIONS      $1/get
    ^/{controller}/{id=[0-9]+}/get$          POST,OPTIONS     $1/getp
    ^/{controller}/init$                     GET,OPTIONS      $1/init
    ^/{controller}/list$                     POST,OPTIONS     $1/list
    ^/{controller}/stream                    GET,OPTIONS      $1/stream
    ^/{controller}/{id=[0-9]+}$              DELETE,OPTIONS   $1/remove
    ^/{controller}/{id=[0-9]+}$              POST,OPTIONS     $1/update
    ^/{controller}/{id=[0-9]+}/{action}(/)*$ GET,POST,OPTIONS $1/$3
    ^/{controller}/{action}(/)*$             GET,POST,OPTIONS $1/$2
    ^/{controller}/stream                    GET,POST         $&
    ^/                                       GET,POST         $&
    ^.*$                                     GET,POST         $&

    These client restful APIs below map onto the ESP routes
 */
import Net from 'js-net'

const GroupRest = {
    create: { method: 'POST',   uri: ':controller' },
    get:    { method: 'GET',    uri: ':controller/:id' },
    init:   { method: 'GET',    uri: ':controller/init' },
    list:   { method: 'POST',   uri: ':controller/list' },
    remove: { method: 'DELETE', uri: ':controller/:id' },
    update: { method: 'POST',   uri: ':controller/:id' },
}

const SingletonRest = {
    create: { method: 'POST',   uri: ':controller' },
    get:    { method: 'GET',    uri: ':controller/get' },
    init:   { method: 'GET',    uri: ':controller/init' },
    remove: { method: 'DELETE', uri: ':controller' },
    update: { method: 'POST',   uri: ':controller/update' },
}

export default class Rest {
    constructor(name, apis, modifiers = {group: true}) {
        this.net = new Net
        this.name = name
        this.apis = Object.assign({}, apis)
        let extraAPIs = modifiers.group ? GroupRest : SingletonRest
        this.apis = Object.assign(this.apis, extraAPIs)

        for (let [key,api] of Object.entries(this.apis)) {
            /*
                Params
                    get({id: ID})
                    list(null, options)

                Options:
                    offset      Starting offset for first row
                    limit       Limit of rows to return
                    filter      Filter pattern to apply to results


                Additional Fetch options:
                    clear       Clear prior feedback
                    feedback    If false, never emit feedback. If true, emit feedback on success. Otherwise on errors.
                    body        Post body data
                    log         Set to true to trace the request and response
                    method      HTTP method
                    nologout    Don't logout if response is 401
                    noparse     Don't json parse any JSON response
                    noprefix    Don't prefix the URL. Use the window.location host address.
                    progress    If true, show progress bar.
                    raw         If true, return the full response object (see below). If false, return just the data.
                    throw       If false, do not throw on errors
             */
            this[key] = async function(fields, options = {}) {
                /*
                    Replace the route :NAME fields with param values
                 */
                let uri = api.uri.replace(/:\w*/g, function(match, lead, tail) {
                    let key = match.slice(1)
                    if (key == 'controller') {
                        return name
                    }
                    return (fields && fields[key]) ? fields[key] : ''
                })

                let args = Object.assign(Object.assign({}, api), options)
/*
                if (api.abilities && !this.$auth.can(api.abilities)) {
                    this.$feedback.error('Unauthorized')
                    this.navigate('/')
                    throw new Error('Unauthorized')
                }
*/
                let body = {}
                if (fields) {
                    for (let [field,value] of Object.entries(fields)) {
                        if (value != null) {
//MOB-ZZ test if encoding in fields
                            body.fields = body.fields || {}
                            body.fields[field] = value
                        }
                    }
                }
                if (options.offset || options.limit || options.filter) {
//MOB-ZZ
                    body.options = Object.white(options, ['offset', 'limit', 'filter'])
                }
                if (Object.keys(body).length > 0) {
                    if (args.method != 'POST') {
//MOB-ZZ remove this
                        body._encoded_json_ = true;
                    }
                    body = JSON.stringify(body)
                    if (args.method == 'POST') {
                        args.body = body
                    } else {
//MOB-ZZ remove this
                        body = encodeURIComponent(body)
                        let sep = (uri.indexOf('?') >= 0) ? '&' : '?'
                        uri = `${uri}${sep}${body}`
                    }
                }
                args.headers = Object.assign(args.headers || {}, {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                })
                return await this.net.fetch(uri, args)
            }
        }
    }
}
