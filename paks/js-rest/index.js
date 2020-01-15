/*
    Rest.js - REST API supports

    export default new Rest('user', {
        check: { method: 'POST', uri: '/:controller/check', getMap: fn },
        login: { method: 'POST', uri: '/:controller/login', nomap: true },
        logout: { method: 'POST', uri: '/:controller/logout' },
    })

    APIs can have properties drawn from the js-net options. {
        base        Base url to use instead of the config.prefix
        clear       Clear prior feedback
        feedback    If false, never emit feedback. If true, emit feedback on success. Otherwise on errors.
        body        Post body data
        getMap      Invoke getMap function to map data before returning
        log         Set to true to trace the request and response
        method      HTTP method
        nomap       Do not use global map functions
        nologout    Don't logout if response is 401
        noparse     Don't json parse any JSON response
        progress    If true, show progress bar.
        putMap      Invoke putMap function to map data before saving
        raw         If true, return the full response object (see below). If false, return just the data.
        throw       If false, do not throw on errors
    }

    Callers then invoke as:

    import Model from '@/models/Model'
    Model.method(fields, options)

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

import Net from 'js-net'
import Clone from 'js-clone'
import Blend from 'js-blend'
import UUID from 'js-uuid'

/*
    Default routes
 */
const GroupRest = {
    create: { method: 'POST',  uri: '/:controller/create' },
    get:    { method: 'POST',  uri: '/:controller/get' },
    init:   { method: 'POST',  uri: '/:controller/init' },
    find:   { method: 'POST',  uri: '/:controller/find' },
    remove: { method: 'POST',  uri: '/:controller/remove', nomap: true },
    update: { method: 'POST',  uri: '/:controller/update' },
}

const SingletonRest = {
    create: { method: 'POST',  uri: '/:controller/create' },
    get:    { method: 'POST',  uri: '/:controller/get' },
    init:   { method: 'POST',  uri: '/:controller/init' },
    remove: { method: 'POST',  uri: '/:controller/remove', nomap: true },
    update: { method: 'POST',  uri: '/:controller/update' },
}

export default class Rest {
    /*
        WARNING: API keys become top-level instance properties
     */
    constructor(name, customApis = {}, modifiers = {group: true}) {
        this._net = new Net
        this._name = name
        this._model = toTitle(name)
        this._clientId = UUID()
        modifiers = this.modifiers = Object.assign({}, modifiers)
        let base
        if (modifiers.base == 'singleton') {
            base = SingletonRest
        } else if (modifiers.base != 'none') {
            base = GroupRest
        }
        this._apis = Blend(Clone(base), customApis)

        for (let [action,api] of Object.entries(this._apis)) {
            if (typeof api == 'function') {
                this[action] = api
            } else {
                api.action = action
                this[action] = this.createAction(api, action)
            }
            if ((modifiers.getMap || modifiers.putMap) && !customApis[action]) {
                if (api.getMap === undefined && !api.nomap) {
                    api.getMap = modifiers.getMap
                }
                if (api.putMap === undefined && !api.nomap) {
                    api.putMap = modifiers.putMap
                }
                if (api.context === undefined) {
                    api.context = modifiers.context
                }
            }
        }
    }

    createAction(api, action) {
        return async function(fields, options = {}) {
            let {args, uri} = await this.prepRemote(api, fields, options)
            let mark = new Date
            let result = await this._net.fetch(uri, args)
            let elapsed = (new Date() - mark) / 1000
            if (result && api.getMap && !api.nomap) {
                result = await api.getMap(result)
            }
            return result
        }
    }

    async prepRemote(api, fields, options) {
        /*
            Replace the route :NAME fields with param values
         */
        let action = api.action
        let name = this._name
        let uri = api.uri.replace(/:\w*/g, function(match, lead, tail) {
            let controller = match.slice(1)
            if (controller == 'controller') {
                return name.toLowerCase()
            }
            return (fields && fields[controller]) ? fields[controller] : ''
        })
        let args = Object.assign(Object.assign({}, api), options)
        let body = {fields: {}}
        if (fields) {
            for (let [field,value] of Object.entries(fields)) {
                if (value != null) {
                    body.fields[field] = value
                }
            }
            if (body.fields && api.putMap && !api.nomap) {
                body.fields = await api.putMap(body.fields)
            }
        }
        /*  MOB - should be done via a callback.
        if (name != 'Table' && !body.fields.orgId && app.state.auth.orgId) {
            body.fields.orgId = app.state.auth.orgId
        } */
        if (api.context) {
            body.fields = api.context(body.fields)
        }
        if (app.state.app.logging) {
            options.logging = options.logging || app.state.app.logging
        }
        options.clientId = this._clientId
        body.options = Object.white(options, ['clientId', 'offset', 'limit', 'filter', 'logging'])

        if (Object.keys(body).length > 0) {
            if (args.method != 'POST') {
                body._encoded_json_ = true;
            }
            body = JSON.stringify(body)
            if (args.method == 'POST') {
                args.body = body
            } else {
                let sep = (uri.indexOf('?') >= 0) ? '&' : '?'
                body = encodeURIComponent(body)
                uri = `${uri}${sep}${body}`
            }
        }
        args.headers = Object.assign(args.headers || {}, {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
        if (app.state.auth.tokens) {
            args.headers.Authorization = app.state.auth.tokens.idToken.jwtToken
        }
        args.base = app.config.api
        return {args, uri}
    }
}
