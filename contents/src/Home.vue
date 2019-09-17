<template>
    <article>
        <h1>Welcome to Embedded Server Pages</h1>

        <section>
            <p>ESP is a powerful "C"-based web framework for blazing fast dynamic web applications.
            It has an page templating engine, layout pages, a Model-View-Controller framework,
                embedded database, content caching and application generator.</p>
        </section>

        <section>
            <h2>Quick Start</h2>
            <ol>
                <li>
                    <b><a href="https://embedthis.com/esp/doc/users/pages.html">Create ESP Pages</a></b>
                <p>Create web pages under the <b>clients</b> directory or to group pages together, under <b>clients/pages</b>. Modify the home page in "index.esp" and customize the Less-based style sheet in the "css/app.less" and "css/theme.less".</p>
                </li>
                <li>
                    <b><a href="https://embedthis.com/esp/doc/users/controllers.html">Generate
                    Controllers</a></b>
                    <p>Create controllers to manage your app. Run <a href="https://embedthis.com/esp/doc/users/program.html"><b>esp</b></a> with no options to see its usage.</p>
                    <pre>esp generate controller NAME [action, ...]</pre>
                </li>
                <li>
                    <b><a href="https://embedthis.com/esp/doc/users/program.html#scaffolds">Generate
                    Scaffolds</a></b>
                    <p>Create entire scaffolds for large sections of your application.</p>
                    <pre>esp generate scaffold NAME [field:type, ...]</pre>
                </li>

                <li><b><a href="https://embedthis.com/esp/doc/">Read the Documentation</a></b>
                    <p>Go to <a href="https://embedthis.com/esp/doc/">
                    https://embedthis.com/esp/doc/</a> for the latest ESP documentation.
                    Here you can read quick tours, overviews and access all the ESP APIs.</p>
                </li>
                <li><b>Enjoy!</b></li>
            </ol>
        </section>
        <aside class="mt-4">
            <h2>ESP Links</h2>
            <ul>
                <li><a href="https://www.embedthis.com">Embedthis Web Site</a></li>
                <li><a href="https://www.embedthis.com/esp/doc/">Documentation</a></li>
                <li><a href="https://www.embedthis.com/esp/doc/users/">ESP User's Guide</a></li>
                <li><a href="https://github.com/embedthis/esp">ESP Repository and Issue List</a></li>
                <li><a href="https://www.embedthis.com/blog/">Embedthis Blog</a></li>
            </ul>
        </aside>
    </article>
</template>

<script>
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
    name: 'home',
    components: {
        // HelloWorld
    },
    methods: {
        mounted() {
            console.log('here');
        }
    },
}
</script>
