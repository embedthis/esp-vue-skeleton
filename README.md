esp-vue-skeleton
===

Pak for esp-vue-skeleton

### Description

The esp-vue-skeleton is a starter skeleton for ESP using [vueJS](http://vuejs.org). It has a server backend using Appweb and ESP that provides an application database, web server, initial page load and ongoing data for the site.
The client interface is provided by VueJS with a Material Design look and feel via Vuetify.

The skeleton includes templates for ESP to generate controllers, scaffolds and database migrations.

### Provides

* ui &mdash; Client side user interface
* ui/public &mdash; Static HTML page for initial load
* ui/main.js &mdash; Primary application script
* esp.json &mdash; ESP configuration file
* controllers &mdash; Server-side controllers using ESP
* paks/ &mdash; Installed extension packages

### Dependencies

The esp-vue-skeleton package depends upon:

* [vue](https://vuejs.org) for the vueJS framework
* [npm](https://www.npmjs.com) for the NPM tool

### Installation

    pak -w install esp-vue-skeleton

### Building

    make build

### Running in development mode

    make

### Configuration

#### esp.json

* esp.generate &mdash; Template files to use when using esp generate.
* http.formats.date &mdash; Default date format.
* http.formats.float &mdash; Default numerical format for floating point numbers.
* http.routes &mdash; Set the route set to use 'esp-spa'

```
{
    "esp": {
        "generate": {
            "appweb": "esp-vue-skeleton/generate/appweb.conf",
            "clientModel": "esp-vue-skeleton/generate/model.js",
            "clientController": "esp-vue-skeleton/generate/controller.js",
            "clientList": "esp-vue-skeleton/generate/list.html",
            "clientEdit": "esp-vue-skeleton/generate/edit.html",
            "controller": "esp-vue-skeleton/generate/controller.c",
            "controllerSingleton": "esp-vue-skeleton/generate/controllerSingleton.c"
        }
    },
    "http": {
        "formats": {
            "response": "json",
            "date": "yyyy-MM-dd",
            "float": 2
        },
        "routes": "esp-restful"
    }
}
```

### Get Pak from

[https://www.embedthis.com/pak](https://www.embedthis.com/pak)
