var betterSharing = (function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, basedir, module) {
		return module = {
		  path: basedir,
		  exports: {},
		  require: function (path, base) {
	      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
	    }
		}, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};

	var f$4 = Object.getOwnPropertySymbols;

	var objectGetOwnPropertySymbols = {
		f: f$4
	};

	// all object keys, includes non-enumerable and symbols
	var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = objectGetOwnPropertyNames.f(anObject(it));
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
	};

	var copyConstructorProperties = function (target, source) {
	  var keys = ownKeys(source);
	  var defineProperty = objectDefineProperty.f;
	  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	  }
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var nativeAssign = Object.assign;
	var defineProperty = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : nativeAssign;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var TO_STRING_TAG = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags = function () {
	  var that = anObject(this);
	  var result = '';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var TO_STRING = 'toString';
	var RegExpPrototype = RegExp.prototype;
	var nativeToString = RegExpPrototype[TO_STRING];

	var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = nativeToString.name != TO_STRING;

	// `RegExp.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  redefine(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject(this);
	    var p = String(R.source);
	    var rf = R.flags;
	    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? regexpFlags.call(R) : rf);
	    return '/' + p + '/' + f;
	  }, { unsafe: true });
	}

	var MATCH = wellKnownSymbol('match');

	// `IsRegExp` abstract operation
	// https://tc39.github.io/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
	};

	var notARegexp = function (it) {
	  if (isRegexp(it)) {
	    throw TypeError("The method doesn't accept regular expressions");
	  } return it;
	};

	var MATCH$1 = wellKnownSymbol('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (e) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (f) { /* empty */ }
	  } return false;
	};

	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;






	var nativeStartsWith = ''.startsWith;
	var min$2 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('startsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG =  !CORRECT_IS_REGEXP_LOGIC && !!function () {
	  var descriptor = getOwnPropertyDescriptor$2(String.prototype, 'startsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.startsWith` method
	// https://tc39.github.io/ecma262/#sec-string.prototype.startswith
	_export({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = String(requireObjectCoercible(this));
	    notARegexp(searchString);
	    var index = toLength(min$2(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = String(searchString);
	    return nativeStartsWith
	      ? nativeStartsWith.call(that, search, index)
	      : that.slice(index, index + search.length) === search;
	  }
	});

	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var defineProperty$1 = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty$1(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $forEach = arrayIteration.forEach;



	var STRICT_METHOD = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var slice = [].slice;
	var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check

	var wrap = function (scheduler) {
	  return function (handler, timeout /* , ...arguments */) {
	    var boundArgs = arguments.length > 2;
	    var args = boundArgs ? slice.call(arguments, 2) : undefined;
	    return scheduler(boundArgs ? function () {
	      // eslint-disable-next-line no-new-func
	      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
	    } : handler, timeout);
	  };
	};

	// ie9- setTimeout & setInterval additional parameters fix
	// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
	_export({ global: true, bind: true, forced: MSIE }, {
	  // `setTimeout` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
	  setTimeout: wrap(global_1.setTimeout),
	  // `setInterval` method
	  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
	  setInterval: wrap(global_1.setInterval)
	});

	var addressBookConnector_min = createCommonjsModule(function (module, exports) {
	!function(t,e){module.exports=e();}(commonjsGlobal,function(){var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:{};function M(t,e,n){return t(n={path:e,exports:{},require:function(t,e){throw null==e&&n.path,new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}},n.exports),n.exports}function D(t){return t&&t.Math==Math&&t}function l(t){try{return !!t()}catch(t){return !0}}function U(t,e){return {enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}function f(t){if(null==t)throw TypeError("Can't call method on "+t);return t}function q(t){return ut(f(t))}function F(t,e){if(!u(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!u(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!u(r=n.call(t)))return r;if(e||"function"!=typeof(n=t.toString)||u(r=n.call(t)))throw TypeError("Can't convert object to primitive value");return r}function G(e,n){try{S(y,e,n);}catch(t){y[e]=n;}return n}function V(t){return "Symbol("+String(void 0===t?"":t)+")_"+(++mt+vt).toString(36)}function B(t){return bt[t]||(bt[t]=V(t))}function $(t){return "function"==typeof t?t:void 0}function H(t,e){return arguments.length<2?$(xt[t])||$(y[t]):xt[t]&&xt[t][e]||y[t]&&y[t][e]}function z(t){return 0<t?_t(jt(t),9007199254740991):0}function K(c){return function(t,e,n){var r,o=q(t),i=z(o.length),u=function(t,e){t=jt(t);return t<0?Rt(t+e,0):Tt(t,e)}(n,i);if(c&&e!=e){for(;u<i;)if((r=o[u++])!=r)return !0}else for(;u<i;u++)if((c||u in o)&&o[u]===e)return c||u||0;return !c&&-1}}function W(t,e){var n,r=q(t),o=0,i=[];for(n in r)!m(St,n)&&m(r,n)&&i.push(n);for(;e.length>o;)!m(r,n=e[o++])||~Pt(i,n)||i.push(n);return i}function e(t,e){return (t=Dt[Mt(t)])==qt||t!=Ut&&("function"==typeof e?l(e):!!e)}function n(t,e){var n,r,o,i=t.target,u=t.global,c=t.stat,a=u?y:c?y[i]||G(i,{}):(y[i]||{}).prototype;if(a)for(n in e){if(r=e[n],o=t.noTargetGet?(o=Gt(a,n))&&o.value:a[n],!Ft(u?n:i+(c?".":"#")+n,t.forced)&&void 0!==o){if(typeof r==typeof o)continue;h=g=d=p=s=void 0;for(var l=r,f=o,s=Nt(f),p=b.f,d=dt.f,g=0;g<s.length;g++){var h=s[g];m(l,h)||p(l,h,d(f,h));}}(t.sham||o&&o.sham)&&S(r,"sham",!0),E(a,n,r,t);}}function Y(t){return Object(f(t))}function s(t){return m(Xt,t)||(Jt&&m(w,t)?Xt[t]=w[t]:Xt[t]=Qt("Symbol."+t)),Xt[t]}var r,J,X,Q,Z,o,tt,i,y=D("object"==typeof globalThis&&globalThis)||D("object"==typeof window&&window)||D("object"==typeof self&&self)||D("object"==typeof t&&t)||Function("return this")(),p=!l(function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}),t={}.propertyIsEnumerable,et=Object.getOwnPropertyDescriptor,nt={f:et&&!t.call({1:2},1)?function(t){t=et(this,t);return !!t&&t.enumerable}:t},rt={}.toString,ot=function(t){return rt.call(t).slice(8,-1)},it="".split,ut=l(function(){return !Object("z").propertyIsEnumerable(0)})?function(t){return "String"==ot(t)?it.call(t,""):Object(t)}:Object,u=function(t){return "object"==typeof t?null!==t:"function"==typeof t},ct={}.hasOwnProperty,m=function(t,e){return ct.call(t,e)},at=y.document,lt=u(at)&&u(at.createElement),ft=function(t){return lt?at.createElement(t):{}},st=!p&&!l(function(){return 7!=Object.defineProperty(ft("div"),"a",{get:function(){return 7}}).a}),pt=Object.getOwnPropertyDescriptor,dt={f:p?pt:function(t,e){if(t=q(t),e=F(e,!0),st)try{return pt(t,e)}catch(t){}if(m(t,e))return U(!nt.f.call(t,e),t[e])}},v=function(t){if(u(t))return t;throw TypeError(String(t)+" is not an object")},gt=Object.defineProperty,b={f:p?gt:function(t,e,n){if(v(t),e=F(e,!0),v(n),st)try{return gt(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported");return "value"in n&&(t[e]=n.value),t}},S=p?function(t,e,n){return b.f(t,e,U(1,n))}:function(t,e,n){return t[e]=n,t},t="__core-js_shared__",c=y[t]||G(t,{}),ht=Function.toString,yt=("function"!=typeof c.inspectSource&&(c.inspectSource=function(t){return ht.call(t)}),c.inspectSource),t=y.WeakMap,t="function"==typeof t&&/native code/.test(yt(t)),a=M(function(t){(t.exports=function(t,e){return c[t]||(c[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.6.5",mode:"global",copyright:"© 2020 Denis Pushkarev (zloirock.ru)"});}),mt=0,vt=Math.random(),bt=a("keys"),St={},d=y.WeakMap,Et=(tt=t?(r=new d,J=r.get,X=r.has,Q=r.set,Z=function(t,e){return Q.call(r,t,e),e},o=function(t){return J.call(r,t)||{}},function(t){return X.call(r,t)}):(i=B("state"),St[i]=!0,Z=function(t,e){return S(t,i,e),e},o=function(t){return m(t,i)?t[i]:{}},function(t){return m(t,i)}),{set:Z,get:o,has:tt,enforce:function(t){return tt(t)?o(t):Z(t,{})},getterFor:function(e){return function(t){if(u(t)&&(t=o(t)).type===e)return t;throw TypeError("Incompatible receiver, "+e+" required")}}}),E=M(function(t){var e=Et.get,u=Et.enforce,c=String(String).split("String");(t.exports=function(t,e,n,r){var o=!!r&&!!r.unsafe,i=!!r&&!!r.enumerable,r=!!r&&!!r.noTargetGet;"function"==typeof n&&("string"!=typeof e||m(n,"name")||S(n,"name",e),u(n).source=c.join("string"==typeof e?e:"")),t===y?i?t[e]=n:G(e,n):(o?!r&&t[e]&&(i=!0):delete t[e],i?t[e]=n:S(t,e,n));})(Function.prototype,"toString",function(){return "function"==typeof this&&e(this).source||yt(this)});}),xt=y,wt=Math.ceil,Ot=Math.floor,jt=function(t){return isNaN(t=+t)?0:(0<t?Ot:wt)(t)},_t=Math.min,Rt=Math.max,Tt=Math.min,Pt={includes:K(!0),indexOf:K(!1)}.indexOf,At=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],Ct=At.concat("length","prototype"),Lt={f:Object.getOwnPropertyNames||function(t){return W(t,Ct)}},It={f:Object.getOwnPropertySymbols},Nt=H("Reflect","ownKeys")||function(t){var e=Lt.f(v(t)),n=It.f;return n?e.concat(n(t)):e},kt=/#|\.prototype\./,Mt=e.normalize=function(t){return String(t).replace(kt,".").toLowerCase()},Dt=e.data={},Ut=e.NATIVE="N",qt=e.POLYFILL="P",Ft=e,Gt=dt.f,Vt=Object.keys||function(t){return W(t,At)},g=Object.assign,Bt=Object.defineProperty,t=!g||l(function(){if(p&&1!==g({b:1},g(Bt({},"a",{enumerable:!0,get:function(){Bt(this,"b",{value:3,enumerable:!1});}}),{b:2})).b)return 1;var t={},e={},n=Symbol(),r="abcdefghijklmnopqrst";return t[n]=7,r.split("").forEach(function(t){e[t]=t;}),7!=g({},t)[n]||Vt(g({},e)).join("")!=r})?function(t,e){for(var n=Y(t),r=arguments.length,o=1,i=It.f,u=nt.f;o<r;)for(var c,a=ut(arguments[o++]),l=i?Vt(a).concat(i(a)):Vt(a),f=l.length,s=0;s<f;)c=l[s++],p&&!u.call(a,c)||(n[c]=a[c]);return n}:g,h=(n({target:"Object",stat:!0,forced:Object.assign!==t},{assign:t}),{cloudspongeOptions:{}}),x="addressBookConnector",$t=x+"JsonData",Ht="cloudsponge-widget-script",d=b.f,t=Function.prototype,zt=t.toString,Kt=/^\s*function ([^ (]*)/,Wt=(!p||"name"in t||d(t,"name",{configurable:!0,get:function(){try{return zt.call(this).match(Kt)[1]}catch(t){return ""}}}),Object.setPrototypeOf||("__proto__"in{}?function(){var n,r=!1,t={};try{(n=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(t,[]),r=t instanceof Array;}catch(t){}return function(t,e){return v(t),function(t){if(u(t)||null===t)return;throw TypeError("Can't set "+String(t)+" as a prototype")}(e),r?n.call(t,e):t.__proto__=e,t}}():void 0)),Yt=function(t,e,n){return Wt&&"function"==typeof(e=e.constructor)&&e!==n&&u(e=e.prototype)&&e!==n.prototype&&Wt(t,e),t},Jt=!!Object.getOwnPropertySymbols&&!l(function(){return !String(Symbol())}),d=Jt&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,Xt=a("wks"),w=y.Symbol,Qt=d?w:w&&w.withoutSetter||V,Zt=s("match"),te=function(t){var e;return u(t)&&(void 0!==(e=t[Zt])?!!e:"RegExp"==ot(t))},ee=function(){var t=v(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e};function ne(t,e){return RegExp(t,e)}var t={UNSUPPORTED_Y:l(function(){var t=ne("a","y");return t.lastIndex=2,null!=t.exec("abcd")}),BROKEN_CARET:l(function(){var t=ne("^r","gy");return t.lastIndex=2,null!=t.exec("str")})},a=s("species"),re=b.f,d=Lt.f,oe=Et.set,ie=s("match"),O=y.RegExp,ue=O.prototype,j=/a/g,ce=/a/g,ae=new O(j)!==j,le=t.UNSUPPORTED_Y;if(p&&Ft("RegExp",!ae||le||l(function(){return ce[ie]=!1,O(j)!=j||O(ce)==ce||"/a/i"!=O(j,"i")}))){for(var _=function(t,e){var n,r=this instanceof _,o=te(t),i=void 0===e;if(!r&&o&&t.constructor===_&&i)return t;ae?o&&!i&&(t=t.source):t instanceof _&&(i&&(e=ee.call(t)),t=t.source),le&&(n=!!e&&-1<e.indexOf("y"))&&(e=e.replace(/y/g,""));o=Yt(ae?new O(t,e):O(t,e),r?this:ue,_);return le&&n&&oe(o,{sticky:n}),o},fe=d(O),se=0;fe.length>se;)!function(e){e in _||re(_,e,{configurable:!0,get:function(){return O[e]},set:function(t){O[e]=t;}});}(fe[se++]);(ue.constructor=_).prototype=ue,E(y,"RegExp",_);}d=H(d="RegExp"),T=b.f,p&&d&&!d[a]&&T(d,a,{configurable:!0,get:function(){return this}});function pe(n,t,e,r){var i,o,u=s(n),c=!l(function(){var t={};return t[u]=function(){return 7},7!=""[n](t)}),a=c&&!l(function(){var t=!1,e=/a/;return "split"===n&&((e={constructor:{}}).constructor[Pe]=function(){return e},e.flags="",e[u]=/./[u]),e.exec=function(){return t=!0,null},e[u](""),!t});c&&a&&("replace"!==n||Ae&&Ce&&!Le)&&("split"!==n||Ie)||(i=/./[u],e=(a=e(u,""[n],function(t,e,n,r,o){return e.exec===P?c&&!o?{done:!0,value:i.call(e,n,r)}:{done:!0,value:t.call(n,e,r)}:{done:!1}},{REPLACE_KEEPS_$0:Ce,REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:Le}))[0],o=a[1],E(String.prototype,n,e),E(RegExp.prototype,u,2==t?function(t,e){return o.call(t,this,e)}:function(t){return o.call(t,this)})),r&&S(RegExp.prototype[u],"sham",!0);}function de(o){return function(t,e){var n,t=String(f(t)),e=jt(e),r=t.length;return e<0||r<=e?o?"":void 0:(n=t.charCodeAt(e))<55296||56319<n||e+1===r||(r=t.charCodeAt(e+1))<56320||57343<r?o?t.charAt(e):n:o?t.slice(e,e+2):r-56320+(n-55296<<10)+65536}}function ge(t,e,n){return e+(n?Ne(t,e).length:1)}function he(t,e){var n=t.exec;if("function"==typeof n){n=n.call(t,e);if("object"!=typeof n)throw TypeError("RegExp exec method returned something other than an Object or null");return n}if("RegExp"!==ot(t))throw TypeError("RegExp#exec called on incompatible receiver");return P.call(t,e)}function ye(t,e){var n;return new(void 0===(n=Me(t)&&("function"==typeof(n=t.constructor)&&(n===Array||Me(n.prototype))||u(n)&&null===(n=n[De]))?void 0:n)?Array:n)(0===e?0:e)}function R(p){var d=1==p,g=2==p,h=3==p,y=4==p,m=6==p,v=5==p||m;return function(t,e,n,r){for(var o,i,u=Y(t),c=ut(u),a=function(r,o,t){if(ke(r),void 0===o)return r;switch(t){case 0:return function(){return r.call(o)};case 1:return function(t){return r.call(o,t)};case 2:return function(t,e){return r.call(o,t,e)};case 3:return function(t,e,n){return r.call(o,t,e,n)}}return function(){return r.apply(o,arguments)}}(e,n,3),l=z(c.length),f=0,e=r||ye,s=d?e(t,l):g?e(t,0):void 0;f<l;f++)if((v||f in c)&&(i=a(o=c[f],f,u),p))if(d)s[f]=i;else if(i)switch(p){case 3:return !0;case 5:return o;case 6:return f;case 2:Ue.call(s,o);}else if(y)return !1;return m?-1:h||y?y:s}}function me(t){throw t}function ve(t,e){if(m(Fe,t))return Fe[t];var n=[][t],r=!!m(e=e||{},"ACCESSORS")&&e.ACCESSORS,o=m(e,0)?e[0]:me,i=m(e,1)?e[1]:void 0;return Fe[t]=!!n&&!l(function(){if(r&&!p)return 1;var t={length:-1};r?qe(t,1,{enumerable:!0,get:me}):t[1]=1,n.call(t,o,i);})}var be,Se,Ee,xe=RegExp.prototype.exec,we=String.prototype.replace,T=xe,Oe=(d=/a/,a=/b*/g,xe.call(d,"a"),xe.call(a,"a"),0!==d.lastIndex||0!==a.lastIndex),je=t.UNSUPPORTED_Y||t.BROKEN_CARET,_e=void 0!==/()??/.exec("")[1],P=T=Oe||_e||je?function(t){var e,n,r,o,i=this,u=je&&i.sticky,c=ee.call(i),a=i.source,l=0,f=t;return u&&(-1===(c=c.replace("y","")).indexOf("g")&&(c+="g"),f=String(t).slice(i.lastIndex),0<i.lastIndex&&(!i.multiline||i.multiline&&"\n"!==t[i.lastIndex-1])&&(a="(?: "+a+")",f=" "+f,l++),n=new RegExp("^(?:"+a+")",c)),_e&&(n=new RegExp("^"+a+"$(?!\\s)",c)),Oe&&(e=i.lastIndex),r=xe.call(u?n:i,f),u?r?(r.input=r.input.slice(l),r[0]=r[0].slice(l),r.index=i.lastIndex,i.lastIndex+=r[0].length):i.lastIndex=0:Oe&&r&&(i.lastIndex=i.global?r.index+r[0].length:e),_e&&r&&1<r.length&&we.call(r[0],n,function(){for(o=1;o<arguments.length-2;o++)void 0===arguments[o]&&(r[o]=void 0);}),r}:T,d=(n({target:"RegExp",proto:!0,forced:/./.exec!==P},{exec:P}),"toString"),Re=RegExp.prototype,Te=Re[d],a=l(function(){return "/a/b"!=Te.call({source:"a",flags:"b"})}),t=Te.name!=d,Pe=((a||t)&&E(RegExp.prototype,d,function(){var t=v(this),e=String(t.source),n=t.flags;return "/"+e+"/"+String(void 0===n&&t instanceof RegExp&&!("flags"in Re)?ee.call(t):n)},{unsafe:!0}),s("species")),Ae=!l(function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")}),Ce="$0"==="a".replace(/./,"$0"),T=s("replace"),Le=!!/./[T]&&""===/./[T]("a","$0"),Ie=!l(function(){var t=/(?:)/,e=t.exec,t=(t.exec=function(){return e.apply(this,arguments)},"ab".split(t));return 2!==t.length||"a"!==t[0]||"b"!==t[1]}),Ne={codeAt:de(!1),charAt:de(!0)}.charAt,ke=(pe("match",1,function(r,a,l){return [function(t){var e=f(this),n=null==t?void 0:t[r];return void 0!==n?n.call(t,e):new RegExp(t)[r](String(e))},function(t){var e=l(a,t,this);if(e.done)return e.value;var n=v(t),r=String(this);if(!n.global)return he(n,r);for(var o=n.unicode,i=[],u=n.lastIndex=0;null!==(c=he(n,r));){var c=String(c[0]);""===(i[u]=c)&&(n.lastIndex=ge(r,z(n.lastIndex),o)),u++;}return 0===u?null:i}]}),function(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t}),Me=Array.isArray||function(t){return "Array"==ot(t)},De=s("species"),Ue=[].push,a={forEach:R(0),map:R(1),filter:R(2),some:R(3),every:R(4),find:R(5),findIndex:R(6)},qe=Object.defineProperty,Fe={},Ge=a.forEach,t=!!(Se=[]["forEach"])&&l(function(){Se.call(null,be||function(){throw 1},1);}),d=ve("forEach"),Ve=t&&d?[].forEach:function(t){return Ge(this,t,1<arguments.length?arguments[1]:void 0)};for(Ee in {CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}){var A=y[Ee],A=A&&A.prototype;if(A&&A.forEach!==Ve)try{S(A,"forEach",Ve);}catch(t){A.forEach=Ve;}}function Be(){return document.querySelector("[data-"+x+"-js]")}function $e(t){var e=Be();return e&&e.querySelector("[name="+t+"],[data-"+x+"-name="+t+"]")}function He(){return $e("owner")}function ze(){var t=Be();return t&&t.querySelector(".cloudsponge-contacts,[data-"+x+"-name=contacts]")}function Ke(t,e){return void 0===e&&(e=[]),t.dataset&&t.dataset[$t]?JSON.parse(t.dataset[$t]):e}function We(t,e){t&&(t.dataset[$t]=JSON.stringify(e));}function Ye(t){return e=t,n=new RegExp("\\bcloudsponge-contacts\\b"),e.className&&e.className.match(n)?"contacts":t.dataset&&t.dataset[x+"Name"]||t.name||t.id;var e,n;}function Je(){}function Xe(e){return function(t){t=String(f(t));return 1&e&&(t=t.replace(mn,"")),t=2&e?t.replace(vn,""):t}}var Qe,Ze,C,T=H("navigator","userAgent")||"",t=y.process,d=t&&t.versions,t=d&&d.v8,d=(t?N=(I=t.split("."))[0]+I[1]:T&&(!(I=T.match(/Edge\/(\d+)/))||74<=I[1])&&(I=T.match(/Chrome\/(\d+)/))&&(N=I[1]),N&&+N),tn=s("species"),en=a.map,t=(Qe="map",51<=d||!l(function(){var t=[];return (t.constructor={})[tn]=function(){return {foo:1}},1!==t[Qe](Boolean).foo})),T=ve("map"),nn=(n({target:"Array",proto:!0,forced:!t||!T},{map:function(t){return en(this,t,1<arguments.length?arguments[1]:void 0)}}),s("species")),rn=[].push,on=Math.min,un=4294967295,L=!l(function(){return !RegExp(un,"y")}),cn=(pe("split",2,function(o,g,h){var y="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||1<".".split(/()()/).length||"".split(/.?/).length?function(t,e){var n=String(f(this)),r=void 0===e?un:e>>>0;if(0==r)return [];if(void 0===t)return [n];if(!te(t))return g.call(n,t,r);for(var o,i,u,c=[],e=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),a=0,l=new RegExp(t.source,e+"g");(o=P.call(l,n))&&!(a<(i=l.lastIndex)&&(c.push(n.slice(a,o.index)),1<o.length&&o.index<n.length&&rn.apply(c,o.slice(1)),u=o[0].length,a=i,c.length>=r));)l.lastIndex===o.index&&l.lastIndex++;return a===n.length?!u&&l.test("")||c.push(""):c.push(n.slice(a)),c.length>r?c.slice(0,r):c}:"0".split(void 0,0).length?function(t,e){return void 0===t&&0===e?[]:g.call(this,t,e)}:g;return [function(t,e){var n=f(this),r=null==t?void 0:t[o];return void 0!==r?r.call(t,n,e):y.call(String(n),t,e)},function(t,e){var n=h(y,t,this,e,y!==g);if(n.done)return n.value;var n=v(t),r=String(this),o=(t=n,o=RegExp,void 0===(t=v(t).constructor)||null==(t=v(t)[nn])?o:ke(t)),i=n.unicode,t=(n.ignoreCase?"i":"")+(n.multiline?"m":"")+(n.unicode?"u":"")+(L?"y":"g"),u=new o(L?n:"^(?:"+n.source+")",t),c=void 0===e?un:e>>>0;if(0==c)return [];if(0===r.length)return null===he(u,r)?[r]:[];for(var a=0,l=0,f=[];l<r.length;){u.lastIndex=L?l:0;var s,p=he(u,L?r:r.slice(l));if(null===p||(s=on(z(u.lastIndex+(L?0:l)),r.length))===a)l=ge(r,l,i);else {if(f.push(r.slice(a,l)),f.length===c)return f;for(var d=1;d<=p.length-1;d++)if(f.push(p[d]),f.length===c)return f;l=a=s;}}return f.push(r.slice(a)),f}]},!L),p?Object.defineProperties:function(t,e){v(t);for(var n,r=Vt(e),o=r.length,i=0;i<o;)b.f(t,n=r[i++],e[n]);return t}),an=H("document","documentElement"),ln="prototype",fn="script",sn=B("IE_PROTO"),pn=function(t){return "<"+fn+">"+t+"</"+fn+">"},dn=function(){try{Ze=document.domain&&new ActiveXObject("htmlfile");}catch(t){}dn=Ze?((t=Ze).write(pn("")),t.close(),e=t.parentWindow.Object,t=null,e):(t=ft("iframe"),e="java"+fn+":",t.style.display="none",an.appendChild(t),t.src=String(e),(e=t.contentWindow.document).open(),e.write(pn("document.F=Object")),e.close(),e.F);for(var t,e,n=At.length;n--;)delete dn[ln][At[n]];return dn()},I=(St[sn]=!0,Object.create||function(t,e){var n;return null!==t?(Je[ln]=v(t),n=new Je,Je[ln]=null,n[sn]=t):n=dn(),void 0===e?n:cn(n,e)}),N=s("unscopables"),d=Array.prototype,gn=(null==d[N]&&b.f(d,N,{configurable:!0,value:I(null)}),a.find),t="find",hn=!0,T=ve(t),yn=(t in[]&&Array(1)[t](function(){hn=!1;}),n({target:"Array",proto:!0,forced:hn||!T},{find:function(t){return gn(this,t,1<arguments.length?arguments[1]:void 0)}}),d[N][t]=!0,"\t\n\v\f\r                　\u2028\u2029\ufeff"),I="["+yn+"]",mn=RegExp("^"+I+I+"*"),vn=RegExp(I+I+"*$"),a={start:Xe(1),end:Xe(2),trim:Xe(3)},bn=a.trim;function Sn(t,e){return t.find(function(t){return t.email==e||t.__selectedMail__==e})}function En(t,e){void 0===e&&(e={}),t=t||{};var n,r={email:Array.isArray(t.email)?t.email[0].address:t.email};return r.first_name=t.first_name||"",r.last_name=t.last_name||"",e.owner?(n=(r.first_name+" "+r.last_name).trim(),r.sender_name=n||h.defaultSenderName||"",h.senderEmail&&(r.sender_email=h.senderEmail),r.from_name=r.sender_name,r.reply_to_name=n||h.defaultReplyToName||h.defaultSenderName||"",r.reply_to_email=h.replyToEmail||r.email||h.defaultReplyToEmail||""):(e.subject&&(r.subject=e.subject,t.first_name?r.personal_subject=(t.first_name+" "+e.subject).trim():r.personal_subject=e.subject),r.to=function(t){if(t.first_name||t.last_name)return (((t.first_name||"")+" "+(t.last_name||"")).trim()+" <"+t.email+">").trim();return t.email}(t),r.greeting=((h.greeting||"Hi")+" "+(t.first_name||h.greetingPlaceholder||"")).trim()),r}n({target:"String",proto:!0,forced:(C="trim",l(function(){return yn[C]()||"​᠎"!="​᠎"[C]()||yn[C].name!==C}))},{trim:function(){return bn(this)}});function xn(t,r,o,i){return t.map(function(t){return e=o,n=i,En(Sn(r,t=t)||Sn(e,t)||{email:t},n);var e,n;})}function wn(t){var e,n,r={},o=(r.subject=h.subject,r.subject||(o=$e("subject"),r.subject=o&&o.value),ze());o&&(n=o.value.split(/[,\s]+/),e=Ke(o),n=xn(n,e,t,r),We(o,n)),t&&t.length&&h.onUpdateContacts&&h.onUpdateContacts.call&&h.onUpdateContacts(t);}function On(t){var e;t.preventDefault(),wn([]),(t=(t=Be())?(e={},t.querySelectorAll("input,textarea,select").forEach(function(t){e[Ye(t)]=Ke(t,t.value);}),e):null)&&Rn(t);}function jn(){var t=h.cloudspongeOptions||{},e=Be();e&&(He()&&(t.beforeDisplayContacts=Cn),ze()&&(t.afterSubmitContacts=wn),e.addEventListener("submit",On)),_n(t);}function _n(t){window.cloudsponge.init(t);}function Rn(e){window.cloudsponge.trigger(e).then(function(){h.success&&h.success(e);}).catch(function(t){h.failure&&h.failure(t,e);});}function Tn(t){return "object"==typeof t&&!Nn(t)&&!In(t)}function Pn(t){Object.assign(h,t),t.key&&Ln(t),Cn();}function An(){Tn(k)&&Tn(k.dataset)&&"string"==typeof k.dataset.key&&Pn(k.dataset);}var Cn=function(t,e,n){We(He(),En(n,{owner:!0})),n&&h.onUpdateOwner&&h.onUpdateOwner.call&&h.onUpdateOwner(n);},k=document.currentScript||document.querySelector("script[data-id=cloudsponge-"+x+'],script[src*="address-book-connector.js"]')||{parentElement:document.head},Ln=function(t){var e,n;t.key&&(t="http"+(t.insecure?"":"s")+"://"+(t.host||"api.cloudsponge.com")+"/widget/"+t.key+".js",e=jn,window.cloudsponge||document.querySelector("#"+Ht)?e&&e():((n=document.createElement("script")).id=Ht,n.src=t,n.onload=e,k.parentElement.appendChild(n)));},In=function(t){return null===t},Nn=function(t){return Array.isArray(t)};return An(),{initialize:An,setOptions:Pn}});
	});

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	var $find = arrayIteration.find;



	var FIND = 'find';
	var SKIPS_HOLES = true;

	var USES_TO_LENGTH$1 = arrayMethodUsesToLength(FIND);

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

	// `Array.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.find
	_export({ target: 'Array', proto: true, forced: SKIPS_HOLES || !USES_TO_LENGTH$1 }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (error) {
	    var returnMethod = iterator['return'];
	    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
	    throw error;
	  }
	};

	var iterators = {};

	var ITERATOR = wellKnownSymbol('iterator');
	var ArrayPrototype$1 = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod = function (it) {
	  return it !== undefined && (iterators.Array === it || ArrayPrototype$1[ITERATOR] === it);
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var ITERATOR$1 = wellKnownSymbol('iterator');

	var getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$1]
	    || it['@@iterator']
	    || iterators[classof(it)];
	};

	// `Array.from` method implementation
	// https://tc39.github.io/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject(arrayLike);
	  var C = typeof this == 'function' ? this : Array;
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = iteratorMethod.call(O);
	    next = iterator.next;
	    result = new C();
	    for (;!(step = next.call(iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = toLength(O.length);
	    result = new C(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$2] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$2] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.github.io/ecma262/#sec-array.from
	_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: arrayFrom
	});

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
	// so we use an intermediate function.
	function RE(s, f) {
	  return RegExp(s, f);
	}

	var UNSUPPORTED_Y = fails(function () {
	  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	  var re = RE('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	var BROKEN_CARET = fails(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = RE('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
		UNSUPPORTED_Y: UNSUPPORTED_Y,
		BROKEN_CARET: BROKEN_CARET
	};

	var nativeExec = RegExp.prototype.exec;
	// This always refers to the native implementation, because the
	// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
	// which loads this file before patching the method.
	var nativeReplace = String.prototype.replace;

	var patchedExec = nativeExec;

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  nativeExec.call(re1, 'a');
	  nativeExec.call(re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;

	if (PATCH) {
	  patchedExec = function exec(str) {
	    var re = this;
	    var lastIndex, reCopy, match, i;
	    var sticky = UNSUPPORTED_Y$1 && re.sticky;
	    var flags = regexpFlags.call(re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = flags.replace('y', '');
	      if (flags.indexOf('g') === -1) {
	        flags += 'g';
	      }

	      strCopy = String(str).slice(re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = nativeExec.call(sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = match.input.slice(charsAdded);
	        match[0] = match[0].slice(charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
	      nativeReplace.call(match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    return match;
	  };
	}

	var regexpExec = patchedExec;

	_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
	  exec: regexpExec
	});

	// `String.prototype.{ codePointAt, at }` methods implementation
	var createMethod$2 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = String(requireObjectCoercible($this));
	    var position = toInteger(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = S.charCodeAt(position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING ? S.charAt(position) : first
	        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$2(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$2(true)
	};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype : null;
	};

	var ITERATOR$3 = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	var returnThis = function () { return this; };

	// `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if ( !has(IteratorPrototype, ITERATOR$3)) {
	  createNonEnumerableProperty(IteratorPrototype, ITERATOR$3, returnThis);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var defineProperty$2 = objectDefineProperty.f;



	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG$2)) {
	    defineProperty$2(it, TO_STRING_TAG$2, { configurable: true, value: TAG });
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$4 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$2 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$4]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$4] != 'function') {
	          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$4, returnThis$2);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;
	    defaultIterator = function values() { return nativeIterator.call(this); };
	  }

	  // define iterator
	  if ( IterablePrototype[ITERATOR$4] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$4, defaultIterator);
	  }
	  iterators[NAME] = defaultIterator;

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var charAt = stringMultibyte.charAt;



	var STRING_ITERATOR = 'String Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
	defineIterator(String, 'String', function (iterated) {
	  setInternalState(this, {
	    type: STRING_ITERATOR,
	    string: String(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return { value: undefined, done: true };
	  point = charAt(string, index);
	  state.index += point.length;
	  return { value: point, done: false };
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points







	var SPECIES$1 = wellKnownSymbol('species');

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
	  // #replace needs built-in support for named groups.
	  // #match works fine because it just return the exec results, even if it has
	  // a "grops" property.
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  return ''.replace(re, '$<a>') !== '7';
	});

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	var REPLACE = wellKnownSymbol('replace');
	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
	  var SYMBOL = wellKnownSymbol(KEY);

	  var DELEGATES_TO_SYMBOL = !fails(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$1] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    (KEY === 'replace' && !(
	      REPLACE_SUPPORTS_NAMED_GROUPS &&
	      REPLACE_KEEPS_$0 &&
	      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    )) ||
	    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
	  ) {
	    var nativeRegExpMethod = /./[SYMBOL];
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      if (regexp.exec === regexpExec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
	        }
	        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
	      }
	      return { done: false };
	    }, {
	      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
	      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
	    });
	    var stringMethod = methods[0];
	    var regexMethod = methods[1];

	    redefine(String.prototype, KEY, stringMethod);
	    redefine(RegExp.prototype, SYMBOL, length == 2
	      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
	      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
	      ? function (string, arg) { return regexMethod.call(string, this, arg); }
	      // 21.2.5.6 RegExp.prototype[@@match](string)
	      // 21.2.5.9 RegExp.prototype[@@search](string)
	      : function (string) { return regexMethod.call(string, this); }
	    );
	  }

	  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
	};

	var charAt$1 = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-advancestringindex
	var advanceStringIndex = function (S, index, unicode) {
	  return index + (unicode ? charAt$1(S, index).length : 1);
	};

	// `RegExpExec` abstract operation
	// https://tc39.github.io/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (typeof exec === 'function') {
	    var result = exec.call(R, S);
	    if (typeof result !== 'object') {
	      throw TypeError('RegExp exec method returned something other than an Object or null');
	    }
	    return result;
	  }

	  if (classofRaw(R) !== 'RegExp') {
	    throw TypeError('RegExp#exec called on incompatible receiver');
	  }

	  return regexpExec.call(R, S);
	};

	// @@match logic
	fixRegexpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.github.io/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible(this);
	      var matcher = regexp == undefined ? undefined : regexp[MATCH];
	      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
	    function (regexp) {
	      var res = maybeCallNative(nativeMatch, regexp, this);
	      if (res.done) return res.value;

	      var rx = anObject(regexp);
	      var S = String(this);

	      if (!rx.global) return regexpExecAbstract(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regexpExecAbstract(rx, S)) !== null) {
	        var matchStr = String(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	// this module is a generic way to handle capturing options as a script is added to a page
	// read the script options from:
	// * declared default or config
	// * the current script's data attributes
	// * applied via function
	// each takes precedence over the next
	// default options set internally that may be overwritten
	var defaultOptions = {}; // default options set internally which may not be overwritten

	var immutableDefaults = {}; // options specified in the script's data-* attributes

	var scriptDataOptions = {}; // options applied with the options() function

	var appliedOptions = {}; // the currently computed options

	var currentOptions = {}; // callbacks to be executed after the options are updated anytime

	var afterUpdateCallbacks = []; // state var to prevent infinite recursion

	var updatingOptions = false;

	var updateOptions = function updateOptions(optionSet, args) {
	  // optionSet is a refernce to the private member
	  if (optionSet) {
	    Object.assign(optionSet, args);
	  } // since one of the private sets update, we'll apply them all now


	  currentOptions = Object.assign({}, defaultOptions, scriptDataOptions, appliedOptions, immutableDefaults);

	  if (!updatingOptions) {
	    updatingOptions = true;

	    try {
	      executeAfterCallback();
	    } catch (e) {// do nada
	    }

	    updatingOptions = false;
	  }

	  return currentOptions;
	};

	var executeAfterCallback = function executeAfterCallback() {
	  afterUpdateCallbacks.forEach(function (cb) {
	    return cb(currentOptions);
	  });
	};

	var afterUpdateOptions = function afterUpdateOptions(callback) {
	  afterUpdateCallbacks.push(callback);
	};
	var init = function init() {
	  // get a reference to the currently executing script
	  //  we start by looking for the currentScript which is support by most browsers (except IE)
	  //  but can also be defeated if this code executes in a callback. so to be clever, we're going to
	  //  check for any script with a bettersharing-* data attribute or a script that includes a better-sharing.js built file
	  var thisScript = // document.currentScript || // most browsers support currentScript, which is nice and easy but is problematic when the script is added dynamically so:
	  document.querySelector('script[data-key][src*=better-sharing], script[data-better-sharing-key]') || // if the current script is unavailable, lets look for any script matching our install instructions
	  Array.from(document.querySelectorAll('script')).find(function (script) {
	    // failing that, we'll look for the script based on it containing any data-bettersharing-* attributes
	    return script.src.match(/better-sharing[^\/]+\.js/) || Object.keys(script.dataset).find(function (key) {
	      return key.startsWith('betterSharing');
	    });
	  });

	  if (thisScript) {
	    updateOptions(scriptDataOptions, thisScript.dataset);
	  }

	  return scriptDataOptions;
	}; // always initialize thisScript and get its options as we load this file

	init(); // sets the default options for this instance and returns the full set of defaults

	var defaults = function defaults(args, immutable) {
	  if (args === void 0) {
	    args = null;
	  }

	  if (immutable === void 0) {
	    immutable = false;
	  }

	  if (args) {
	    if (immutable) {
	      updateOptions(immutableDefaults, args);
	      return immutableDefaults;
	    }

	    updateOptions(defaultOptions, args);
	  }

	  return defaultOptions;
	}; // sets the appliedOptions, calculates and returns the currentOptions

	var options = function options(args) {
	  if (args === void 0) {
	    args = null;
	  }

	  if (args) {
	    return updateOptions(appliedOptions, args);
	  }

	  return currentOptions;
	}; // export the init function as well


	options.init = init;

	defaults({
	  cloudsponge: {
	    sources: ['gmail', 'yahoo', 'windowslive', 'aol', 'icloud', 'office365', 'outlook', 'addressbook', 'csv']
	  }
	});
	var clearAlert = function clearAlert() {
	  var alertElement = document.getElementById('better-sharing-status-message');

	  if (alertElement) {
	    alertElement.innerHTML = '';
	  }
	};
	var success = function success(data) {
	  var contacts = document.querySelector('[data-addressBookConnector-js] .cloudsponge-contacts') || document.createElement('input');
	  var emails = contacts.value;
	  var alertElement = document.getElementById('better-sharing-status-message');

	  if (alertElement) {
	    alertElement.innerHTML = '<div class="better-sharing-alert better-sharing-alert-success">' + ("We sent an email to " + emails + ".") + '</div>';
	    options().autoClear && setTimeout(clearAlert, 5000);
	  } // clear the contacts field


	  contacts.value = '';

	  try {
	    options().afterSuccess && options().afterSuccess();
	  } catch (e) {
	    // empty response here
	    console.error('Error in afterSuccess callback: ', e);
	  }
	};
	var failure = function failure(error, data) {
	  console.error('[betterSharing] There was a problem sending the email: ', data);
	  var alertElement = document.getElementById('better-sharing-status-message');

	  if (alertElement) {
	    alertElement.innerHTML = '<div class="better-sharing-alert better-sharing-alert-warning">We failed to send any email: ' + (data.xhr && data.xhr.responseText || 'This may have been a duplicate email or another unknown error occurred.') + '.</div>';
	    options().autoClear && setTimeout(clearAlert, 5000);
	  }
	};

	var emailOpts = function emailOpts(opts) {
	  var emailOptionNames = ['subject', 'body', 'senderEmail', 'defaultSenderName', 'defaultReplyToEmail', 'defaultReplyToName'];
	  var emailOpts = {};
	  emailOptionNames.forEach(function (keyName) {
	    if (opts[keyName]) {
	      emailOpts[keyName] = opts[keyName];
	    }
	  });
	  return emailOpts;
	};

	var initAddressBookConnector = function initAddressBookConnector(opts) {
	  addressBookConnector_min.setOptions(Object.assign({
	    key: opts.key || opts.cloudspongeKey || opts.betterSharingKey,
	    cloudspongeOptions: Object.assign({}, opts.cloudsponge)
	  }, emailOpts(opts), {
	    success: success,
	    failure: failure
	  }));
	};

	afterUpdateOptions(initAddressBookConnector);

	var defineProperty$3 = objectDefineProperty.f;

	var FunctionPrototype = Function.prototype;
	var FunctionPrototypeToString = FunctionPrototype.toString;
	var nameRE = /^\s*function ([^ (]*)/;
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.github.io/ecma262/#sec-function-instances-name
	if (descriptors && !(NAME in FunctionPrototype)) {
	  defineProperty$3(FunctionPrototype, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return FunctionPrototypeToString.call(this).match(nameRE)[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var templateMailto = (function (_) {
	  return "<div class=\"better-sharing-default\"><style>" + _.css + "</style><div id=\"better-sharing-status-message\"></div><form action=\"#\" accept-charset=\"UTF-8\" method=\"post\" data-addressbookconnector-js=\"true\" style=\"display:none\"><input type=\"hidden\" name=\"owner\" id=\"owner\" value=\"\"> <input type=\"hidden\" name=\"" + _.toField.name + "\" value=\"\" class=\"cloudsponge-contacts better-sharing-input\"> <input type=\"hidden\" name=\"subject\" value=\"" + _.subject + "\"> <input type=\"hidden\" name=\"body\" value=\"" + _.body + "\"></form></div>";
	});

	var buttonOnlyTemplate = (function (_) {
	  return "<div class=\"better-sharing-default\"><style>" + _.css + "</style><div class=\"better-sharing-row\"><div class=\"better-sharing-col-12\" id=\"better-sharing-status-message\"></div></div><form action=\"#\" accept-charset=\"UTF-8\" method=\"post\" data-addressbookconnector-js=\"true\"><input type=\"hidden\" name=\"owner\" id=\"owner\" value=\"\"> <input type=\"hidden\" name=\"" + _.toField.name + "\" value=\"\" class=\"cloudsponge-contacts better-sharing-input\"> <a href=\"#\" class=\"cloudsponge-launch better-sharing-button better-sharing-contact-button\" title=\"" + _.contactPickerButton.label + "\">" + _.contactPickerButton.label + "</a></form></div>";
	});

	var emailFormTemplate = (function (_) {
	  return "<div class=\"better-sharing-email-form\"><style>" + _.css + "</style><div class=\"better-sharing-row\"><div class=\"better-sharing-col-12\" id=\"better-sharing-status-message\"></div></div><form action=\"#\" accept-charset=\"UTF-8\" method=\"post\" data-addressbookconnector-js=\"true\"><input type=\"hidden\" name=\"owner\" id=\"owner\" value=\"\"> <input type=\"hidden\" name=\"subject\" value=\"" + _.subject.default + "\"> <input type=\"hidden\" name=\"referralLink\" id=\"referralLink\" value=\"" + _.referralLink + "\"> <input type=\"hidden\" name=\"body\" id=\"body\" value=\"" + _.body + "\"><div class=\"better-sharing-row\"><div class=\"better-sharing-col-8\"><input type=\"text\" name=\"" + _.toField.name + "\" class=\"cloudsponge-contacts better-sharing-input\" placeholder=\"" + _.toField.placeholder + "\" required=\"required\" title=\"To:\" aria-describedby=\"#better-sharing-email-help\"><div id=\"better-sharing-email-help\" class=\"better-sharing-input-help\">" + _.toField.hint + "</div></div><div class=\"better-sharing-col-4\"><a href=\"#\" class=\"cloudsponge-launch better-sharing-button better-sharing-contact-button\" title=\"" + _.contactPickerButton.label + "\">" + _.contactPickerButton.label + "</a></div></div><div class=\"better-sharing-row\"><div class=\"better-sharing-col-8\"><textarea title=\"Custom Message\" name=\"" + _.messageField.name + "\" class=\"better-sharing-input\" rows=\"3\" placeholder=\"" + _.messageField.placeholder + "\">" + _.messageField.default + "</textarea></div></div><div class=\"better-sharing-row\"><div class=\"better-sharing-col-4\"><button class=\"better-sharing-button better-sharing-send-button\" title=\"" + _.sendButton.label + "\" type=\"submit\">" + _.sendButton.label + "</button></div></div></form></div>";
	});

	var emailFormTemplateDeep = (function (_) {
	  return "<div class=\"better-sharing-email-form\"><style>" + _.css + "</style><div class=\"better-sharing-row\"><div class=\"better-sharing-col-12\" id=\"better-sharing-status-message\"></div></div><form action=\"#\" accept-charset=\"UTF-8\" method=\"post\" data-addressbookconnector-js=\"true\"><input type=\"hidden\" name=\"owner\" id=\"owner\" value=\"\"> <input type=\"hidden\" name=\"subject\" value=\"" + _.subject.default + "\"> <input type=\"hidden\" name=\"referralLink\" id=\"referralLink\" value=\"" + _.referralLink + "\"> <input type=\"hidden\" name=\"body\" id=\"body\" value=\"" + _.body + "\"><div class=\"better-sharing-row\"><div class=\"better-sharing-col-12\"><input type=\"text\" name=\"" + _.toField.name + "\" class=\"cloudsponge-contacts better-sharing-input\" placeholder=\"" + _.toField.placeholder + "\" required=\"required\" title=\"To:\" aria-describedby=\"#better-sharing-email-help\"><div id=\"better-sharing-email-help\" class=\"better-sharing-input-help\">" + _.toField.hint + "</div></div></div><div class=\"better-sharing-row\"><div class=\"better-sharing-col-12 better-sharing-contact-picker-title\">" + _.contactPickerButton.title + "</div></div><div class=\"better-sharing-row\"><div class=\"better-sharing-col-4\"><a class=\"cloudsponge-launch better-sharing-button better-sharing-contact-button\" data-cloudsponge-source=\"gmail\" title=\"Google Contacts\">Google Contacts</a></div><div class=\"better-sharing-col-4\"><a class=\"cloudsponge-launch better-sharing-button better-sharing-contact-button\" data-cloudsponge-source=\"yahoo\" title=\"Yahoo Contacts\">Yahoo</a></div><div class=\"better-sharing-col-4\"><a class=\"cloudsponge-launch better-sharing-button better-sharing-contact-button\" data-cloudsponge-source=\"outlookcom\" title=\"Outlook.com Contacts\">Outlook.com</a></div></div><div class=\"better-sharing-row\"><div class=\"better-sharing-col-12\"><textarea title=\"Custom Message\" name=\"" + _.messageField.name + "\" class=\"better-sharing-input\" rows=\"3\" placeholder=\"" + _.messageField.placeholder + "\">" + _.messageField.default + "</textarea></div></div><div class=\"better-sharing-row\"><div class=\"better-sharing-col-6\"><button class=\"better-sharing-button better-sharing-send-button\" title=\"" + _.sendButton.label + "\" type=\"submit\">" + _.sendButton.label + "</button></div></div></form></div>";
	});

	var css_248z = ".better-sharing *,.better-sharing :after,.better-sharing :before{box-sizing:border-box}.better-sharing a,.better-sharing a:hover{cursor:pointer;text-decoration:none}.better-sharing-alert{border:1px solid transparent;border-radius:.25rem;margin-bottom:1rem;padding:.75rem 1.25rem;position:relative}.better-sharing-alert-warning{background-color:#fff3cd;border-color:#ffeeba;color:#856404}.better-sharing-alert-success{background-color:#d4edda;border-color:#c3e6cb;color:#155724}.better-sharing-row{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;margin-bottom:.5rem;margin-left:-15px;margin-right:-15px}.better-sharing-col-4{margin-bottom:.5rem;padding-left:15px;padding-right:15px;position:relative;width:100%}@media (min-width:512px){.better-sharing-col-4{-ms-flex:0 0 33.333333%;flex:0 0 33.333333%;max-width:33.333333%}}.better-sharing-col-6{margin-bottom:.5rem;padding-left:15px;padding-right:15px;position:relative;width:100%}@media (min-width:512px){.better-sharing-col-6{-ms-flex:0 0 50%;flex:0 0 50%;max-width:50%}}.better-sharing-col-8{padding-left:15px;padding-right:15px;position:relative;width:100%}@media (min-width:512px){.better-sharing-col-8{-ms-flex:0 0 66.666667%;flex:0 0 66.666667%;max-width:66.666667%}}.better-sharing-col-12{-ms-flex:0 0 100%;flex:0 0 100%;max-width:100%;padding-left:15px;padding-right:15px;position:relative;width:100%}.better-sharing-input{background-clip:padding-box;background-color:#fff;border:1px solid #ced4da;border-radius:.25rem;box-sizing:border-box;color:#495057;display:block;font-family:inherit;height:calc(1.5em + .75rem + 2px);margin:0;padding:.375rem .75rem;width:100%}textarea.better-sharing-input{height:auto;overflow:auto;resize:vertical}.better-sharing-input-help{display:block;font-size:75%;margin-top:.25rem}.better-sharing-button{background-color:transparent;border:1px solid transparent;border-radius:.25rem;cursor:pointer;display:inline-block;font-family:inherit;font-size:100%;padding:.375rem .75rem;text-align:center;transition:color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;vertical-align:middle;width:100%}.better-sharing-button:hover{text-decoration:none}.better-sharing-contact-button{background-color:#6c757d;border-color:#6c757d;color:#fff}.better-sharing-contact-button:not([href]){color:#fff}.better-sharing-contact-button:hover{background-color:#5a6268;border-color:#545b62;color:#fff}.better-sharing-contact-button[data-cloudsponge-source]{align-items:center;display:flex;height:100%;justify-content:center}.better-sharing-contact-button[data-cloudsponge-source]:before{background-repeat:no-repeat;background-size:32px 32px;content:\" \";height:32px;margin:0 5px;width:32px}.better-sharing-contact-button[data-cloudsponge-source=gmail]:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg width='46' height='46' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Cfilter x='-50%25' y='-50%25' width='200%25' height='200%25' filterUnits='objectBoundingBox' id='a'%3E%3CfeOffset dy='1' in='SourceAlpha' result='shadowOffsetOuter1'/%3E%3CfeGaussianBlur stdDeviation='.5' in='shadowOffsetOuter1' result='shadowBlurOuter1'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.168 0' in='shadowBlurOuter1' result='shadowMatrixOuter1'/%3E%3CfeOffset in='SourceAlpha' result='shadowOffsetOuter2'/%3E%3CfeGaussianBlur stdDeviation='.5' in='shadowOffsetOuter2' result='shadowBlurOuter2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.084 0' in='shadowBlurOuter2' result='shadowMatrixOuter2'/%3E%3CfeMerge%3E%3CfeMergeNode in='shadowMatrixOuter1'/%3E%3CfeMergeNode in='shadowMatrixOuter2'/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3Crect id='b' x='0' y='0' width='40' height='40' rx='2'/%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg transform='translate(3 3)' filter='url(%23a)'%3E%3Cuse fill='%23FFF' xlink:href='%23b'/%3E%3Cuse xlink:href='%23b'/%3E%3Cuse xlink:href='%23b'/%3E%3Cuse xlink:href='%23b'/%3E%3C/g%3E%3Cpath d='M31.64 23.205c0-.639-.057-1.252-.164-1.841H23v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z' fill='%234285F4'/%3E%3Cpath d='M23 32c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711h-3.007v2.332A8.997 8.997 0 0 0 23 32Z' fill='%2334A853'/%3E%3Cpath d='M17.964 24.71a5.41 5.41 0 0 1-.282-1.71c0-.593.102-1.17.282-1.71v-2.332h-3.007A8.996 8.996 0 0 0 14 23c0 1.452.348 2.827.957 4.042l3.007-2.332Z' fill='%23FBBC05'/%3E%3Cpath d='M23 17.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C27.463 14.891 25.426 14 23 14a8.997 8.997 0 0 0-8.043 4.958l3.007 2.332c.708-2.127 2.692-3.71 5.036-3.71Z' fill='%23EA4335'/%3E%3Cpath d='M14 14h18v18H14V14Z'/%3E%3C/g%3E%3C/svg%3E\")}.better-sharing-contact-button[data-cloudsponge-source=yahoo]:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' aria-label='Yahoo!' viewBox='0 0 512 512' fill='%23fff'%3E%3Crect width='512' height='512' rx='15%25' fill='%235f01d1'/%3E%3Cpath d='M203 404h-62l25-59-69-165h63l37 95 37-95h62m58 76h-69l62-148h69'/%3E%3Ccircle cx='303' cy='308' r='38'/%3E%3C/svg%3E\")}.better-sharing-contact-button[data-cloudsponge-source=outlookcom]:before{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1831.085 1703.335' xml:space='preserve'%3E%3Cpath fill='%230A2767' d='M1831.083 894.25a40.879 40.879 0 0 0-19.503-35.131h-.213l-.767-.426-634.492-375.585a86.175 86.175 0 0 0-8.517-5.067 85.17 85.17 0 0 0-78.098 0 86.37 86.37 0 0 0-8.517 5.067l-634.49 375.585-.766.426c-19.392 12.059-25.337 37.556-13.278 56.948a41.346 41.346 0 0 0 14.257 13.868l634.492 375.585a95.617 95.617 0 0 0 8.517 5.068 85.17 85.17 0 0 0 78.098 0 95.52 95.52 0 0 0 8.517-5.068l634.492-375.585a40.84 40.84 0 0 0 20.268-35.685z'/%3E%3Cpath fill='%230364B8' d='M520.453 643.477h416.38v381.674h-416.38V643.477zM1745.917 255.5V80.908c1-43.652-33.552-79.862-77.203-80.908H588.204C544.552 1.046 510 37.256 511 80.908V255.5l638.75 170.333L1745.917 255.5z'/%3E%3Cpath fill='%230078D4' d='M511 255.5h425.833v383.25H511V255.5z'/%3E%3Cpath fill='%2328A8EA' d='M1362.667 255.5H936.833v383.25L1362.667 1022h383.25V638.75l-383.25-383.25z'/%3E%3Cpath fill='%230078D4' d='M936.833 638.75h425.833V1022H936.833V638.75z'/%3E%3Cpath fill='%230364B8' d='M936.833 1022h425.833v383.25H936.833V1022z'/%3E%3Cpath fill='%2314447D' d='M520.453 1025.151h416.38v346.969h-416.38v-346.969z'/%3E%3Cpath fill='%230078D4' d='M1362.667 1022h383.25v383.25h-383.25V1022z'/%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='1128.458' y1='811.083' x2='1128.458' y2='1.998' gradientTransform='matrix(1 0 0 -1 0 1705.333)'%3E%3Cstop offset='0' style='stop-color:%2335b8f1'/%3E%3Cstop offset='1' style='stop-color:%2328a8ea'/%3E%3C/linearGradient%3E%3Cpath fill='url(%23a)' d='m1811.58 927.593-.809.426-634.492 356.848c-2.768 1.703-5.578 3.321-8.517 4.769a88.437 88.437 0 0 1-34.407 8.517l-34.663-20.27a86.706 86.706 0 0 1-8.517-4.897L447.167 906.003h-.298l-21.036-11.753v722.384c.328 48.196 39.653 87.006 87.849 86.7h1230.914c.724 0 1.363-.341 2.129-.341a107.79 107.79 0 0 0 29.808-6.217 86.066 86.066 0 0 0 11.966-6.217c2.853-1.618 7.75-5.152 7.75-5.152a85.974 85.974 0 0 0 34.833-68.772V894.25a38.323 38.323 0 0 1-19.502 33.343z'/%3E%3Cpath opacity='.5' fill='%230A2767' d='M1797.017 891.397v44.287l-663.448 456.791-686.87-486.174a.426.426 0 0 0-.426-.426l-63.023-37.899v-31.938l25.976-.426 54.932 31.512 1.277.426 4.684 2.981s645.563 368.346 647.267 369.197l24.698 14.478c2.129-.852 4.258-1.703 6.813-2.555 1.278-.852 640.879-360.681 640.879-360.681l7.241.427z'/%3E%3Cpath fill='%231490DF' d='m1811.58 927.593-.809.468-634.492 356.848c-2.768 1.703-5.578 3.321-8.517 4.769a88.96 88.96 0 0 1-78.098 0 96.578 96.578 0 0 1-8.517-4.769l-634.49-356.848-.766-.468a38.326 38.326 0 0 1-20.057-33.343v722.384c.305 48.188 39.616 87.004 87.803 86.7H1743.277c48.188.307 87.5-38.509 87.807-86.696V894.25a38.33 38.33 0 0 1-19.504 33.343z'/%3E%3Cpath opacity='.1' d='m1185.52 1279.629-9.496 5.323a92.806 92.806 0 0 1-8.517 4.812 88.173 88.173 0 0 1-33.47 8.857l241.405 285.479 421.107 101.476a86.785 86.785 0 0 0 26.7-33.343l-637.729-372.604z'/%3E%3Cpath opacity='.05' d='m1228.529 1255.442-52.505 29.51a92.806 92.806 0 0 1-8.517 4.812 88.173 88.173 0 0 1-33.47 8.857l113.101 311.838 549.538 74.989a86.104 86.104 0 0 0 34.407-68.815v-9.326l-602.554-351.865z'/%3E%3Cpath fill='%2328A8EA' d='M514.833 1703.333h1228.316a88.316 88.316 0 0 0 52.59-17.033l-697.089-408.331a86.706 86.706 0 0 1-8.517-4.897L447.125 906.088h-.298l-20.993-11.838v719.914c-.048 49.2 39.798 89.122 88.999 89.169-.001 0-.001 0 0 0z'/%3E%3Cpath opacity='.1' d='M1022 418.722v908.303c-.076 31.846-19.44 60.471-48.971 72.392a73.382 73.382 0 0 1-28.957 5.962H425.833V383.25H511v-42.583h433.073c43.019.163 77.834 35.035 77.927 78.055z'/%3E%3Cpath opacity='.2' d='M979.417 461.305v908.302a69.36 69.36 0 0 1-6.388 29.808c-11.826 29.149-40.083 48.273-71.54 48.417H425.833V383.25h475.656a71.493 71.493 0 0 1 35.344 8.943c26.104 13.151 42.574 39.883 42.584 69.112z'/%3E%3Cpath opacity='.2' d='M979.417 461.305v823.136c-.208 43-34.928 77.853-77.927 78.225H425.833V383.25h475.656a71.493 71.493 0 0 1 35.344 8.943c26.104 13.151 42.574 39.883 42.584 69.112z'/%3E%3Cpath opacity='.2' d='M936.833 461.305v823.136c-.046 43.067-34.861 78.015-77.927 78.225H425.833V383.25h433.072c43.062.023 77.951 34.951 77.927 78.013a.589.589 0 0 1 .001.042z'/%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='162.747' y1='1383.074' x2='774.086' y2='324.259' gradientTransform='matrix(1 0 0 -1 0 1705.333)'%3E%3Cstop offset='0' style='stop-color:%231784d9'/%3E%3Cstop offset='.5' style='stop-color:%23107ad5'/%3E%3Cstop offset='1' style='stop-color:%230a63c9'/%3E%3C/linearGradient%3E%3Cpath fill='url(%23b)' d='M78.055 383.25h780.723c43.109 0 78.055 34.947 78.055 78.055v780.723c0 43.109-34.946 78.055-78.055 78.055H78.055c-43.109 0-78.055-34.947-78.055-78.055V461.305c0-43.108 34.947-78.055 78.055-78.055z'/%3E%3Cpath fill='%23FFF' d='M243.96 710.631a227.05 227.05 0 0 1 89.17-98.495 269.56 269.56 0 0 1 141.675-35.515 250.91 250.91 0 0 1 131.114 33.683 225.014 225.014 0 0 1 86.742 94.109 303.751 303.751 0 0 1 30.405 138.396 320.567 320.567 0 0 1-31.299 144.783 230.37 230.37 0 0 1-89.425 97.388 260.864 260.864 0 0 1-136.011 34.578 256.355 256.355 0 0 1-134.01-34.067 228.497 228.497 0 0 1-87.892-94.28 296.507 296.507 0 0 1-30.745-136.735 329.29 329.29 0 0 1 30.276-143.845zm95.046 231.227a147.386 147.386 0 0 0 50.163 64.812 131.028 131.028 0 0 0 78.353 23.591 137.244 137.244 0 0 0 83.634-24.358 141.156 141.156 0 0 0 48.715-64.812 251.594 251.594 0 0 0 15.543-90.404 275.198 275.198 0 0 0-14.649-91.554 144.775 144.775 0 0 0-47.182-67.537 129.58 129.58 0 0 0-82.91-25.55 135.202 135.202 0 0 0-80.184 23.804 148.626 148.626 0 0 0-51.1 65.365 259.759 259.759 0 0 0-.341 186.728l-.042-.085z'/%3E%3Cpath fill='%2350D9FF' d='M1362.667 255.5h383.25v383.25h-383.25V255.5z'/%3E%3C/svg%3E\")}.better-sharing-send-button{background-color:#007bff;border-color:#007bff;color:#fff}.better-sharing-send-button:hover{background-color:#0069d9;border-color:#0062cc;color:#fff}";

	var $indexOf = arrayIncludes.indexOf;



	var nativeIndexOf = [].indexOf;

	var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
	var STRICT_METHOD$1 = arrayMethodIsStrict('indexOf');
	var USES_TO_LENGTH$2 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

	// `Array.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$1 || !USES_TO_LENGTH$2 }, {
	  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
	    return NEGATIVE_ZERO
	      // convert -0 to +0
	      ? nativeIndexOf.apply(this, arguments) || 0
	      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$2 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$2] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
	var USES_TO_LENGTH$3 = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

	var SPECIES$3 = wellKnownSymbol('species');
	var nativeSlice = [].slice;
	var max$1 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH$3 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject(this);
	    var length = toLength(O.length);
	    var k = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject(Constructor)) {
	        Constructor = Constructor[SPECIES$3];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === Array || Constructor === undefined) {
	        return nativeSlice.call(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var hijackFn = function hijackFn(obj, fn, cb, impl) {
	  impl || (impl = function impl() {
	    console.log('hijacked ', obj.toString(), fn);
	  });
	  var orig = obj[fn];

	  try {
	    obj[fn] = impl;
	    cb();
	  } finally {
	    obj[fn] = orig;
	  }
	};
	var parseQuery = function parseQuery(query) {
	  var obj = {};
	  query = trimTo(query || '', '?');

	  while (query) {
	    query = mergeNextQueryPair(query, obj);
	  }

	  return obj;
	};

	var mergeNextQueryPair = function mergeNextQueryPair(query, obj) {
	  var nextNameVal = divString(query, '=');
	  var name = decodeURIComponent(nextNameVal[0]);
	  var valAndRemainder = divString(nextNameVal[1], '&');
	  var val = decodeURIComponent(valAndRemainder[0]);
	  var remainder = valAndRemainder[1];
	  obj[name] = val;
	  return remainder;
	};

	var trimTo = function trimTo(str, char) {
	  var start = str.indexOf(char);

	  if (start > 0) {
	    return str.slice(start + 1);
	  }

	  return str;
	};

	var divString = function divString(str, char) {
	  var divIndex = str.indexOf(char);

	  if (divIndex > 0) {
	    return [str.slice(0, divIndex), str.slice(divIndex + 1)];
	  }

	  return [str, null];
	};

	defaults({
	  contactPickerButton: {
	    label: 'Add from Contacts',
	    title: 'Invite people directly from your address book.'
	  },
	  // suppresses the email form fields
	  displayEmailForm: false,
	  toField: {
	    name: 'to',
	    placeholder: 'To: (enter your friend&#39;s email)',
	    hint: 'Separate multiple emails with commas.'
	  },
	  messageField: {
	    name: 'customMessage',
	    default: '',
	    placeholder: 'Message: (enter a message here from you to your friends. ' + 'We&#39;ll include it at the top of the email that we send them with your referral link)'
	  },
	  subject: {
	    name: 'subject',
	    default: 'default subj'
	  },
	  sendButton: {
	    label: 'Send the Invitation'
	  },
	  referralLink: window.location,
	  selector: '.better-sharing' // mailto: true | 'delay' | 'delayNoMailto',

	});

	var betterSharing = function betterSharing(opts) {
	  if (opts === void 0) {
	    opts = {};
	  }

	  // apply the options
	  opts = Object.assign({
	    css: css_248z
	  }, options(opts)); // did they pass in an element to populate?

	  var element = opts.element; // attempt to find the default element

	  if (!element) {
	    element = document.querySelector(opts.selector);
	  }

	  if (!opts.displayEmailForm) {
	    // trigger automatically at the end of the contact selection
	    addressBookConnector_min.setOptions({
	      onUpdateContacts: function onUpdateContacts() {
	        var form = document.querySelector('.better-sharing-default > form[data-addressBookConnector-js]');
	        form && form.dispatchEvent(new Event('submit'));
	      }
	    });
	  }

	  if (opts.mailto) {
	    if (element) {
	      var href = element.href && element.href.startsWith('mailto:') && element.href || element.dataset.href && element.dataset.href.startsWith('mailto:') && element.dataset.href;

	      if (href) {
	        // infer the message and subject fields from the mailto destination
	        var mailtoParams = parseQuery(href);

	        if (mailtoParams.subject) {
	          opts.subject = mailtoParams.subject;
	        }

	        if (mailtoParams.body) {
	          opts.body = mailtoParams.body;
	        }

	        opts.autoClear = true;
	        options(opts);
	      }

	      element.insertAdjacentHTML('afterend', templateMailto(opts));
	      element.addEventListener('click', function (e) {
	        if (e._executingDelay) {
	          return;
	        }

	        if (window.cloudsponge) {
	          // we always don't launch the link
	          e.preventDefault(); // optionally we stop the propagation if there's another thing happening

	          if (opts.mailto.toString().startsWith('delay')) {
	            e.stopPropagation();
	            options({
	              afterSuccess: function afterSuccess() {
	                var completeClick = function completeClick() {
	                  e._executingDelay = true;
	                  element.dispatchEvent(e);
	                }; // hack to make it so that the call to window.open fails


	                opts.mailto == 'delayNoMailto' ? hijackFn(window, 'open', completeClick) : completeClick();
	              }
	            });
	          } // contact picker is GO


	          cloudsponge.launch();
	        }
	      });
	    }

	    return;
	  }

	  var template = !opts.displayEmailForm ? buttonOnlyTemplate : opts.contactPickerButton.deepLinks ? emailFormTemplateDeep : emailFormTemplate; // do something if there is an element passed in

	  if (element) {
	    element.innerHTML = template(opts); // initialize the addressBookConnectoer after we add the HTML on the page

	    addressBookConnector_min.initialize();
	  }
	}; // allow the options to be assigned this way


	betterSharing.options = options; // everything is set up, attempt to attach to the selector

	betterSharing();

	return betterSharing;

}());
