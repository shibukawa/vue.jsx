import "console.jsx";
import "vue.jsx";

class _Main {
    static function main(argv : string[]) : void
    {
        Vue.directive('demo', {
            bind: (context : VueContext) -> {
                context.el.style.color = '#fff';
                context.el.style.backgroundColor = context.arg as string;
            },
            update: (context : VueContext, value : variant) -> {
                context.el.innerHTML =
                    'argument - ' + (context.arg as string) + '<br>' +
                    'key - ' + context.key + '<br>' +
                    'value - ' + (value as string);
            }
        });

        Vue.directive('literal-dir', {
            isLiteral: true,
            bind: (context : VueContext) -> {
                console.log(context.expression); // 'foo'
            }
        });

        Vue.directive('my-handler', {
            isFn: true, // important!
            bind: (context : VueContext) -> {
                // ...
            },
            update: (context : VueContext, handler : variant) -> {
                // the passed in value is a function
            },
            unbind: (context : VueContext) -> {
                // ...
            }
        });

        Vue.filter('reverse', (self : Vue, value : variant) -> {
            return (value as string).split('').reverse().join('') as variant;
        });

        Vue.filter('concat', (self : Vue, value : variant, args : variant[]) -> {
            // `this` points to the VM invoking the filter
            var key = args[0] as string;
            return (value as string + self[key] as string) as variant;
        });

        var demo = new Vue({
            el: '#demo',
            data: {
                title: 'todos',
                todos: [
                    {
                        done: true,
                        content: 'Learn JavaScript'
                    },
                    {
                        done: false,
                        content: 'Learn vue.js'
                    }
                ],
                items: [
                    { childMsg: 'Foo' },
                    { childMsg: 'Bar' }
                ]
            }
        });
        var items = demo['items'] as VueArray;
        items.set(0, { childMsg: 'Changed!'});
        items.remove(0);
        demo['items'] = items.filter((item) -> {
            var itemMap = item as Map.<string>;
            return itemMap['childMsg'].match(/Hello/) != null;
        });
    }
}
