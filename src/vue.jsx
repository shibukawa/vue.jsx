import "js/web.jsx";
import "js.jsx";

interface VuePlugin {
    function install(vue : Vue, options : variant[]) : void;
}

native __fake__ class VueContext {
    var el : HTMLElement;     // the element the directive is bound to.
    var key : string;         // the keypath of the binding, excluding arguments and filters.
    var arg : variant;        //the argument, if present.
    var expression : variant; // the raw, unparsed expression.
    var vm : Vue;             // the context ViewModel that owns this directive.
    var value : variant;      // the current binding value.
}

native __fake__ class VueArray {
    function set(index : int, value : variant) : void;
    function remove(index : int) : void;
    function filter(func : (variant) -> boolean) : VueArray;
}

native class Vue {
    function constructor(options : Map.<variant>);

    function el()       : HTMLElement   ;
    function parent()   : Vue           ;
    function root()     : Vue           ;
    function compiler() : variant       ;
    function hold()     : variant       ;

    function set(key : string, val : variant) : void;
    function get(key : string) : variant;
    function watch(key : string, callback : (variant) -> void) : void;
    function unwatch(key : string) : void;
    function unwatch(key : string, callback : (variant) -> void) : void;
    function destory() : void;
    function broadcast() : void;
    function dispatch() : void;
    function emit(method : string) : void;
    function on(method : string) : void;
    function off(method : string) : void;
    function once(method : string) : void;
    function appendTo(target : variant, callback : variant) : void;
    function remove(callback : variant) : void;
    function before(target : variant, callback : variant) : void;
    function after(target : variant, callback : variant) : void;

    function __native_index_operator__(name : string) : variant;

    //static function extend( options : variant ) : Vue ;

    static function config(key : string, value : variant) : variant;
    static function config(key : string) : variant;
    static function config(options : Map.<variant>) : variant;

    static function directive(id : string, definition : (variant) -> void) : void;
    static function directive(id : string, definition : Map.<variant>) : void;
    static function directive(id : string) : void;

    static function filter(id : string) : void;
    static function filter(id : string, definition : (Vue, variant) -> variant) : void;
    static function filter(id : string, definition : (Vue, variant, variant[]) -> variant) : void;

    static function component(id : string, definition : variant) : void;
    static function component(id : string) : void;

    static function transition( id : string, definition : variant ) : variant ;
    static function transition( id : string ) : variant ;

    static function partial(id : string) : variant ;
    static function partial(id : string, definition : string) : variant;
    static function partial(id : string, definition : HTMLElement) : variant;

    static function nextTick(callback : () -> void) : void;
    static function require(module : string) : void;
    static function use(plugin : VuePlugin, ...param : variant) : variant;
} = '''
(function() {
Vue         = window.Vue;
VueProto    = Vue.prototype;

'set watch unwatch destory broadcast dispatch emmit on off once appendTo remove before after'.split(' ').forEach(function ( key ) {
    VueProto[key] = VueProto[ '$' + key ];
});

'data index'.split(' ').forEach(function ( name ) {
    VueProto[name] = function ( val ) {
        if ( typeof(val) === 'undefined' ) {
            return this['$' + name];
        } else {
            return this['$' + name] = val;
        }
    }
});

'el parent root compiler'.split(' ').forEach(function ( name ) {
    VueProto[name] = function () {
        return this['$' + name];
    }
});

VueProto['hold'] = function () {
    return this['$'];
};

var oldFilter = Vue.filter;
Vue.filter = function (id, definition) {
    if (!definition) {
        oldFilter.call(Vue, id);
    } else {
        oldFilter.call(Vue, id, function (value) {
            definition.call(this, value, Array.prototype.slice.call(arguments, 1));
        });
    }
};

var oldDirective = Vue.directive;
Vue.directive = function (id, definition) {
    if (!definition) {
        oldDirective.call(Vue, id);
    } else if (typeof(definition) === 'function') {
        oldDirective.call(Vue, id, function (value) {
            definition.call(null, this, value);
        });
    } else {
        var newDefinition = {
            isFn: definition.isFn,
            isEmpty: definition.isEmpty,
            isLiteral: definition.isLiteral
        };
        if (definition.bind) {
            newDefinition.bind = function (value) {
                definition.bind.call(null, this, value);
            }
        }
        if (definition.update) {
            newDefinition.update = function (value) {
                definition.update.call(null, this, value);
            }
        }
        if (definition.unbind) {
            newDefinition.unbind = function () {
                definition.unbind.call(null, this);
            }
        }
        oldDirective.call(Vue, id, newDefinition);
    }
};

return Vue;
})();
''';

