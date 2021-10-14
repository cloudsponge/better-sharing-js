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

	var addressBookConnector_min = createCommonjsModule(function (module, exports) {
	!function(t,e){module.exports=e();}(commonjsGlobal,function(){var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof commonjsGlobal?commonjsGlobal:"undefined"!=typeof self?self:{};function e(t,e,n){return t(n={path:e,exports:{},require:function(t,e){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==e&&n.path)}},n.exports),n.exports}function l(t){try{return !!t()}catch(t){return !0}}function r(t,e){return {enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}function o(t){return b.call(t).slice(8,-1)}function f(t){if(null==t)throw TypeError("Can't call method on "+t);return t}function a(t){return E(f(t))}function s(t){return "object"==typeof t?null!==t:"function"==typeof t}function i(t,e){if(!s(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!s(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!s(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!s(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}function p(t,e){return x.call(t,e)}function n(t){return O?w.createElement(t):{}}function v(t){if(!s(t))throw TypeError(String(t)+" is not an object");return t}function d(e,n){try{P(g,e,n);}catch(t){g[e]=n;}return n}var u=function(t){return t&&t.Math==Math&&t},g=u("object"==typeof globalThis&&globalThis)||u("object"==typeof window&&window)||u("object"==typeof self&&self)||u("object"==typeof t&&t)||Function("return this")(),h=!l(function(){return 7!=Object.defineProperty({},1,{get:function(){return 7}})[1]}),c={}.propertyIsEnumerable,y=Object.getOwnPropertyDescriptor,m={f:y&&!c.call({1:2},1)?function(t){t=y(this,t);return !!t&&t.enumerable}:c},b={}.toString,S="".split,E=l(function(){return !Object("z").propertyIsEnumerable(0)})?function(t){return "String"==o(t)?S.call(t,""):Object(t)}:Object,x={}.hasOwnProperty,w=g.document,O=s(w)&&s(w.createElement),j=!h&&!l(function(){return 7!=Object.defineProperty(n("div"),"a",{get:function(){return 7}}).a}),_=Object.getOwnPropertyDescriptor,R={f:h?_:function(t,e){if(t=a(t),e=i(e,!0),j)try{return _(t,e)}catch(t){}if(p(t,e))return r(!m.f.call(t,e),t[e])}},T=Object.defineProperty,A={f:h?T:function(t,e,n){if(v(t),e=i(e,!0),v(n),j)try{return T(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported");return "value"in n&&(t[e]=n.value),t}},P=h?function(t,e,n){return A.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t},L="__core-js_shared__",C=g[L]||d(L,{}),I=Function.toString;"function"!=typeof C.inspectSource&&(C.inspectSource=function(t){return I.call(t)});function N(t){return "Symbol("+String(void 0===t?"":t)+")_"+(++K+W).toString(36)}var k,M,D,q,F,U,G,V,B=C.inspectSource,$=g.WeakMap,H="function"==typeof $&&/native code/.test(B($)),z=e(function(t){(t.exports=function(t,e){return C[t]||(C[t]=void 0!==e?e:{})})("versions",[]).push({version:"3.6.5",mode:"global",copyright:"© 2020 Denis Pushkarev (zloirock.ru)"});}),K=0,W=Math.random(),Y=z("keys"),J=function(t){return Y[t]||(Y[t]=N(t))},X={},u=g.WeakMap;G=H?(k=new u,M=k.get,D=k.has,q=k.set,F=function(t,e){return q.call(k,t,e),e},U=function(t){return M.call(k,t)||{}},function(t){return D.call(k,t)}):(V=J("state"),X[V]=!0,F=function(t,e){return P(t,V,e),e},U=function(t){return p(t,V)?t[V]:{}},function(t){return p(t,V)});function Q(t){return "function"==typeof t?t:void 0}function Z(t,e){return arguments.length<2?Q(ut[t])||Q(g[t]):ut[t]&&ut[t][e]||g[t]&&g[t][e]}function tt(t){return isNaN(t=+t)?0:(0<t?at:ct)(t)}function et(t){return 0<t?lt(tt(t),9007199254740991):0}function nt(t,e){var n,r=a(t),o=0,i=[];for(n in r)!p(X,n)&&p(r,n)&&i.push(n);for(;e.length>o;)p(r,n=e[o++])&&(~pt(i,n)||i.push(n));return i}function rt(t){return Object(f(t))}var ot={set:F,get:U,has:G,enforce:function(t){return G(t)?U(t):F(t,{})},getterFor:function(n){return function(t){var e;if(!s(t)||(e=U(t)).type!==n)throw TypeError("Incompatible receiver, "+n+" required");return e}}},it=e(function(t){var e=ot.get,u=ot.enforce,c=String(String).split("String");(t.exports=function(t,e,n,r){var o=!!r&&!!r.unsafe,i=!!r&&!!r.enumerable,r=!!r&&!!r.noTargetGet;"function"==typeof n&&("string"!=typeof e||p(n,"name")||P(n,"name",e),u(n).source=c.join("string"==typeof e?e:"")),t!==g?(o?!r&&t[e]&&(i=!0):delete t[e],i?t[e]=n:P(t,e,n)):i?t[e]=n:d(e,n);})(Function.prototype,"toString",function(){return "function"==typeof this&&e(this).source||B(this)});}),ut=g,ct=Math.ceil,at=Math.floor,lt=Math.min,ft=Math.max,st=Math.min,t=function(c){return function(t,e,n){var r,o=a(t),i=et(o.length),u=function(t,e){t=tt(t);return t<0?ft(t+e,0):st(t,e)}(n,i);if(c&&e!=e){for(;u<i;)if((r=o[u++])!=r)return !0}else for(;u<i;u++)if((c||u in o)&&o[u]===e)return c||u||0;return !c&&-1}},pt={includes:t(!0),indexOf:t(!1)}.indexOf,dt=["constructor","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toLocaleString","toString","valueOf"],gt=dt.concat("length","prototype"),ht={f:Object.getOwnPropertyNames||function(t){return nt(t,gt)}},yt={f:Object.getOwnPropertySymbols},mt=Z("Reflect","ownKeys")||function(t){var e=ht.f(v(t)),n=yt.f;return n?e.concat(n(t)):e},vt=/#|\.prototype\./,c=function(t,e){t=St[bt(t)];return t==xt||t!=Et&&("function"==typeof e?l(e):!!e)},bt=c.normalize=function(t){return String(t).replace(vt,".").toLowerCase()},St=c.data={},Et=c.NATIVE="N",xt=c.POLYFILL="P",wt=c,Ot=R.f,L=function(t,e){var n,r,o,i=t.target,u=t.global,c=t.stat,a=u?g:c?g[i]||d(i,{}):(g[i]||{}).prototype;if(a)for(n in e){if(r=e[n],o=t.noTargetGet?(o=Ot(a,n))&&o.value:a[n],!wt(u?n:i+(c?".":"#")+n,t.forced)&&void 0!==o){if(typeof r==typeof o)continue;!function(t,e){for(var n=mt(e),r=A.f,o=R.f,i=0;i<n.length;i++){var u=n[i];p(t,u)||r(t,u,o(e,u));}}(r,o);}(t.sham||o&&o.sham)&&P(r,"sham",!0),it(a,n,r,t);}},jt=Object.keys||function(t){return nt(t,dt)},_t=Object.assign,Rt=Object.defineProperty,$=!_t||l(function(){if(h&&1!==_t({b:1},_t(Rt({},"a",{enumerable:!0,get:function(){Rt(this,"b",{value:3,enumerable:!1});}}),{b:2})).b)return 1;var t={},e={},n=Symbol(),r="abcdefghijklmnopqrst";return t[n]=7,r.split("").forEach(function(t){e[t]=t;}),7!=_t({},t)[n]||jt(_t({},e)).join("")!=r})?function(t){for(var e=rt(t),n=arguments.length,r=1,o=yt.f,i=m.f;r<n;)for(var u,c=E(arguments[r++]),a=o?jt(c).concat(o(c)):jt(c),l=a.length,f=0;f<l;)u=a[f++],h&&!i.call(c,u)||(e[u]=c[u]);return e}:_t;L({target:"Object",stat:!0,forced:Object.assign!==$},{assign:$});function Tt(t){if("function"!=typeof t)throw TypeError(String(t)+" is not a function");return t}function At(t){return p(Ut,t)||(Ft&&p(Gt,t)?Ut[t]=Gt[t]:Ut[t]=Vt("Symbol."+t)),Ut[t]}function Pt(t,e){var n;return qt(t)&&("function"==typeof(n=t.constructor)&&(n===Array||qt(n.prototype))||s(n)&&null===(n=n[Bt]))&&(n=void 0),new(void 0===n?Array:n)(0===e?0:e)}function Lt(t){throw t}var Ct,It,Nt={cloudspongeOptions:{}},kt="addressBookConnector",Mt=kt+"JsonData",Dt="cloudsponge-widget-script",qt=Array.isArray||function(t){return "Array"==o(t)},Ft=!!Object.getOwnPropertySymbols&&!l(function(){return !String(Symbol())}),H=Ft&&!Symbol.sham&&"symbol"==typeof Symbol.iterator,Ut=z("wks"),Gt=g.Symbol,Vt=H?Gt:Gt&&Gt.withoutSetter||N,Bt=At("species"),$t=[].push,u=function(p){var d=1==p,g=2==p,h=3==p,y=4==p,m=6==p,v=5==p||m;return function(t,e,n,r){for(var o,i,u=rt(t),c=E(u),a=function(r,o,t){if(Tt(r),void 0===o)return r;switch(t){case 0:return function(){return r.call(o)};case 1:return function(t){return r.call(o,t)};case 2:return function(t,e){return r.call(o,t,e)};case 3:return function(t,e,n){return r.call(o,t,e,n)}}return function(){return r.apply(o,arguments)}}(e,n,3),l=et(c.length),f=0,r=r||Pt,s=d?r(t,l):g?r(t,0):void 0;f<l;f++)if((v||f in c)&&(i=a(o=c[f],f,u),p))if(d)s[f]=i;else if(i)switch(p){case 3:return !0;case 5:return o;case 6:return f;case 2:$t.call(s,o);}else if(y)return !1;return m?-1:h||y?y:s}},t={forEach:u(0),map:u(1),filter:u(2),some:u(3),every:u(4),find:u(5),findIndex:u(6)},Ht=Object.defineProperty,zt={},c=function(t,e){if(p(zt,t))return zt[t];var n=[][t],r=!!p(e=e||{},"ACCESSORS")&&e.ACCESSORS,o=p(e,0)?e[0]:Lt,i=p(e,1)?e[1]:void 0;return zt[t]=!!n&&!l(function(){if(r&&!h)return 1;var t={length:-1};r?Ht(t,1,{enumerable:!0,get:Lt}):t[1]=1,n.call(t,o,i);})},Kt=t.forEach,$=!!(It=[]["forEach"])&&l(function(){It.call(null,Ct||function(){throw 1},1);}),z=c("forEach"),Wt=$&&z?[].forEach:function(t,e){return Kt(this,t,1<arguments.length?e:void 0)};L({target:"Array",proto:!0,forced:[].forEach!=Wt},{forEach:Wt});var H=A.f,u=Function.prototype,Yt=u.toString,Jt=/^\s*function ([^ (]*)/;!h||"name"in u||H(u,"name",{configurable:!0,get:function(){try{return Yt.call(this).match(Jt)[1]}catch(t){return ""}}});function Xt(t){var e;return s(t)&&(void 0!==(e=t[te])?!!e:"RegExp"==o(t))}function Qt(){var t=v(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.dotAll&&(e+="s"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}var Zt=Object.setPrototypeOf||("__proto__"in{}?function(){var n,r=!1,t={};try{(n=Object.getOwnPropertyDescriptor(Object.prototype,"__proto__").set).call(t,[]),r=t instanceof Array;}catch(t){}return function(t,e){return v(t),function(t){if(!s(t)&&null!==t)throw TypeError("Can't set "+String(t)+" as a prototype")}(e),r?n.call(t,e):t.__proto__=e,t}}():void 0),te=At("match");function ee(t,e){return RegExp(t,e)}var ne,re,$={UNSUPPORTED_Y:l(function(){var t=ee("a","y");return t.lastIndex=2,null!=t.exec("abcd")}),BROKEN_CARET:l(function(){var t=ee("^r","gy");return t.lastIndex=2,null!=t.exec("str")})},oe=At("species"),ie=A.f,z=ht.f,ue=ot.set,ce=At("match"),ae=g.RegExp,le=ae.prototype,fe=/a/g,se=/a/g,pe=new ae(fe)!==fe,de=$.UNSUPPORTED_Y;if(h&&wt("RegExp",!pe||de||l(function(){return se[ce]=!1,ae(fe)!=fe||ae(se)==se||"/a/i"!=ae(fe,"i")}))){for(var ge=function(t,e){var n,r=this instanceof ge,o=Xt(t),i=void 0===e;if(!r&&o&&t.constructor===ge&&i)return t;pe?o&&!i&&(t=t.source):t instanceof ge&&(i&&(e=Qt.call(t)),t=t.source),de&&(n=!!e&&-1<e.indexOf("y"))&&(e=e.replace(/y/g,""));var u,c,t=(t=pe?new ae(t,e):ae(t,e),e=r?this:le,r=ge,Zt&&"function"==typeof(u=e.constructor)&&u!==r&&s(c=u.prototype)&&c!==r.prototype&&Zt(t,c),t);return de&&n&&ue(t,{sticky:n}),t},he=z(ae),ye=0;he.length>ye;)!function(e){e in ge||ie(ge,e,{configurable:!0,get:function(){return ae[e]},set:function(t){ae[e]=t;}});}(he[ye++]);(le.constructor=ge).prototype=le,it(g,"RegExp",ge);}re=Z(ne="RegExp"),ne=A.f,h&&re&&!re[oe]&&ne(re,oe,{configurable:!0,get:function(){return this}});var me=RegExp.prototype.exec,ve=String.prototype.replace,H=me,be=(u=/a/,z=/b*/g,me.call(u,"a"),me.call(z,"a"),0!==u.lastIndex||0!==z.lastIndex),Se=$.UNSUPPORTED_Y||$.BROKEN_CARET,Ee=void 0!==/()??/.exec("")[1];(be||Ee||Se)&&(H=function(t){var e,n,r,o,i=this,u=Se&&i.sticky,c=Qt.call(i),a=i.source,l=0,f=t;return u&&(-1===(c=c.replace("y","")).indexOf("g")&&(c+="g"),f=String(t).slice(i.lastIndex),0<i.lastIndex&&(!i.multiline||i.multiline&&"\n"!==t[i.lastIndex-1])&&(a="(?: "+a+")",f=" "+f,l++),n=new RegExp("^(?:"+a+")",c)),Ee&&(n=new RegExp("^"+a+"$(?!\\s)",c)),be&&(e=i.lastIndex),r=me.call(u?n:i,f),u?r?(r.input=r.input.slice(l),r[0]=r[0].slice(l),r.index=i.lastIndex,i.lastIndex+=r[0].length):i.lastIndex=0:be&&r&&(i.lastIndex=i.global?r.index+r[0].length:e),Ee&&r&&1<r.length&&ve.call(r[0],n,function(){for(o=1;o<arguments.length-2;o++)void 0===arguments[o]&&(r[o]=void 0);}),r});var xe=H;L({target:"RegExp",proto:!0,forced:/./.exec!==xe},{exec:xe});var z="toString",we=RegExp.prototype,Oe=we[z],$=l(function(){return "/a/b"!=Oe.call({source:"a",flags:"b"})}),H=Oe.name!=z;($||H)&&it(RegExp.prototype,z,function(){var t=v(this),e=String(t.source),n=t.flags;return "/"+e+"/"+String(void 0===n&&t instanceof RegExp&&!("flags"in we)?Qt.call(t):n)},{unsafe:!0});function je(t,e,n){return e+(n?Ce(t,e).length:1)}function _e(t,e){var n=t.exec;if("function"==typeof n){n=n.call(t,e);if("object"!=typeof n)throw TypeError("RegExp exec method returned something other than an Object or null");return n}if("RegExp"!==o(t))throw TypeError("RegExp#exec called on incompatible receiver");return xe.call(t,e)}var Re=At("species"),Te=!l(function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")}),Ae="$0"==="a".replace(/./,"$0"),$=At("replace"),Pe=!!/./[$]&&""===/./[$]("a","$0"),Le=!l(function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};t="ab".split(t);return 2!==t.length||"a"!==t[0]||"b"!==t[1]}),H=function(n,t,e,r){var i,o,u=At(n),c=!l(function(){var t={};return t[u]=function(){return 7},7!=""[n](t)}),a=c&&!l(function(){var t=!1,e=/a/;return "split"===n&&((e={constructor:{}}).constructor[Re]=function(){return e},e.flags="",e[u]=/./[u]),e.exec=function(){return t=!0,null},e[u](""),!t});c&&a&&("replace"!==n||Te&&Ae&&!Pe)&&("split"!==n||Le)||(i=/./[u],e=(a=e(u,""[n],function(t,e,n,r,o){return e.exec===xe?c&&!o?{done:!0,value:i.call(e,n,r)}:{done:!0,value:t.call(n,e,r)}:{done:!1}},{REPLACE_KEEPS_$0:Ae,REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE:Pe}))[0],o=a[1],it(String.prototype,n,e),it(RegExp.prototype,u,2==t?function(t,e){return o.call(t,this,e)}:function(t){return o.call(t,this)})),r&&P(RegExp.prototype[u],"sham",!0);},z=function(i){return function(t,e){var n,r=String(f(t)),o=tt(e),t=r.length;return o<0||t<=o?i?"":void 0:(e=r.charCodeAt(o))<55296||56319<e||o+1===t||(n=r.charCodeAt(o+1))<56320||57343<n?i?r.charAt(o):e:i?r.slice(o,o+2):n-56320+(e-55296<<10)+65536}},Ce={codeAt:z(!1),charAt:z(!0)}.charAt;H("match",1,function(r,a,l){return [function(t){var e=f(this),n=null==t?void 0:t[r];return void 0!==n?n.call(t,e):new RegExp(t)[r](String(e))},function(t){var e=l(a,t,this);if(e.done)return e.value;var n=v(t),r=String(this);if(!n.global)return _e(n,r);for(var o=n.unicode,i=[],u=n.lastIndex=0;null!==(c=_e(n,r));){var c=String(c[0]);""===(i[u]=c)&&(n.lastIndex=je(r,et(n.lastIndex),o)),u++;}return 0===u?null:i}]});for(var Ie in {CSSRuleList:0,CSSStyleDeclaration:0,CSSValueList:0,ClientRectList:0,DOMRectList:0,DOMStringList:0,DOMTokenList:1,DataTransferItemList:0,FileList:0,HTMLAllCollection:0,HTMLCollection:0,HTMLFormElement:0,HTMLSelectElement:0,MediaList:0,MimeTypeArray:0,NamedNodeMap:0,NodeList:1,PaintRequestList:0,Plugin:0,PluginArray:0,SVGLengthList:0,SVGNumberList:0,SVGPathSegList:0,SVGPointList:0,SVGStringList:0,SVGTransformList:0,SourceBufferList:0,StyleSheetList:0,TextTrackCueList:0,TextTrackList:0,TouchList:0}){var Ne=g[Ie],ke=Ne&&Ne.prototype;if(ke&&ke.forEach!==Wt)try{P(ke,"forEach",Wt);}catch(t){ke.forEach=Wt;}}function Me(){return document.querySelector("[data-"+kt+"-js]")}function De(t){var e=Me();return e&&e.querySelector("[name="+t+"],[data-"+kt+"-name="+t+"]")}function qe(){return De("owner")}function Fe(){var t=Me();return t&&t.querySelector(".cloudsponge-contacts,[data-"+kt+"-name=contacts]")}function Ue(t,e){return void 0===e&&(e=[]),t.dataset&&t.dataset[Mt]?JSON.parse(t.dataset[Mt]):e}function Ge(t,e){t&&(t.dataset[Mt]=JSON.stringify(e));}function Ve(t){return e=t,n=new RegExp("\\bcloudsponge-contacts\\b"),e.className&&e.className.match(n)?"contacts":t.dataset&&t.dataset[kt+"Name"]||t.name||t.id;var e,n;}$=Z("navigator","userAgent")||"",z=g.process,z=z&&z.versions,z=z&&z.v8;z?We=(Ke=z.split("."))[0]+Ke[1]:$&&(!(Ke=$.match(/Edge\/(\d+)/))||74<=Ke[1])&&(Ke=$.match(/Chrome\/(\d+)/))&&(We=Ke[1]);var Be,$e=We&&+We,He=At("species"),ze=t.map,Ke=(Be="map",51<=$e||!l(function(){var t=[];return (t.constructor={})[He]=function(){return {foo:1}},1!==t[Be](Boolean).foo})),We=c("map");L({target:"Array",proto:!0,forced:!Ke||!We},{map:function(t,e){return ze(this,t,1<arguments.length?e:void 0)}});var Ye=At("species"),Je=[].push,Xe=Math.min,Qe=4294967295,Ze=!l(function(){return !RegExp(Qe,"y")});H("split",2,function(o,h,y){var m="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1).length||2!="ab".split(/(?:ab)*/).length||4!=".".split(/(.?)(.?)/).length||1<".".split(/()()/).length||"".split(/.?/).length?function(t,e){var n=String(f(this)),r=void 0===e?Qe:e>>>0;if(0==r)return [];if(void 0===t)return [n];if(!Xt(t))return h.call(n,t,r);for(var o,i,u,c=[],e=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),a=0,l=new RegExp(t.source,e+"g");(o=xe.call(l,n))&&!(a<(i=l.lastIndex)&&(c.push(n.slice(a,o.index)),1<o.length&&o.index<n.length&&Je.apply(c,o.slice(1)),u=o[0].length,a=i,c.length>=r));)l.lastIndex===o.index&&l.lastIndex++;return a===n.length?!u&&l.test("")||c.push(""):c.push(n.slice(a)),c.length>r?c.slice(0,r):c}:"0".split(void 0,0).length?function(t,e){return void 0===t&&0===e?[]:h.call(this,t,e)}:h;return [function(t,e){var n=f(this),r=null==t?void 0:t[o];return void 0!==r?r.call(t,n,e):m.call(String(n),t,e)},function(t,e){var n=y(m,t,this,e,m!==h);if(n.done)return n.value;var r=v(t),o=String(this),t=(n=r,t=RegExp,void 0===(n=v(n).constructor)||null==(u=v(n)[Ye])?t:Tt(u)),i=r.unicode,u=(r.ignoreCase?"i":"")+(r.multiline?"m":"")+(r.unicode?"u":"")+(Ze?"y":"g"),c=new t(Ze?r:"^(?:"+r.source+")",u),a=void 0===e?Qe:e>>>0;if(0==a)return [];if(0===o.length)return null===_e(c,o)?[o]:[];for(var l=0,f=0,s=[];f<o.length;){c.lastIndex=Ze?f:0;var p,d=_e(c,Ze?o:o.slice(f));if(null===d||(p=Xe(et(c.lastIndex+(Ze?0:f)),o.length))===l)f=je(o,f,i);else {if(s.push(o.slice(l,f)),s.length===a)return s;for(var g=1;g<=d.length-1;g++)if(s.push(d[g]),s.length===a)return s;f=l=p;}}return s.push(o.slice(l)),s}]},!Ze);function tn(){}function en(t){return "<script>"+t+"</"+cn+">"}var nn,rn=h?Object.defineProperties:function(t,e){v(t);for(var n,r=jt(e),o=r.length,i=0;i<o;)A.f(t,n=r[i++],e[n]);return t},on=Z("document","documentElement"),un="prototype",cn="script",an=J("IE_PROTO"),ln=function(){try{nn=document.domain&&new ActiveXObject("htmlfile");}catch(t){}var t;ln=nn?function(t){t.write(en("")),t.close();var e=t.parentWindow.Object;return t=null,e}(nn):((t=n("iframe")).style.display="none",on.appendChild(t),t.src=String("javascript:"),(t=t.contentWindow.document).open(),t.write(en("document.F=Object")),t.close(),t.F);for(var e=dt.length;e--;)delete ln[un][dt[e]];return ln()};X[an]=!0;var J=Object.create||function(t,e){var n;return null!==t?(tn[un]=v(t),n=new tn,tn[un]=null,n[an]=t):n=ln(),void 0===e?n:rn(n,e)},fn=At("unscopables"),sn=Array.prototype;null==sn[fn]&&A.f(sn,fn,{configurable:!0,value:J(null)});var pn,dn=t.find,t="find",gn=!0,c=c(t);t in[]&&Array(1)[t](function(){gn=!1;}),L({target:"Array",proto:!0,forced:gn||!c},{find:function(t,e){return dn(this,t,1<arguments.length?e:void 0)}}),pn=t,sn[fn][pn]=!0;var hn,yn="\t\n\v\f\r                　\u2028\u2029\ufeff",t="["+yn+"]",mn=RegExp("^"+t+t+"*"),vn=RegExp(t+t+"*$"),t=function(e){return function(t){t=String(f(t));return 1&e&&(t=t.replace(mn,"")),2&e&&(t=t.replace(vn,"")),t}},t={start:t(1),end:t(2),trim:t(3)},bn=t.trim;function Sn(t,e){return t.find(function(t){return t.email==e||t.__selectedMail__==e})}function En(t,e){void 0===e&&(e={}),t=t||{};var n={email:Array.isArray(t.email)?t.email[0].address:t.email};if(n.first_name=t.first_name||"",n.last_name=t.last_name||"",e.owner){var r=(n.first_name+" "+n.last_name).trim();return n.sender_name=r||Nt.defaultSenderName||"",Nt.senderEmail&&(n.sender_email=Nt.senderEmail),n.from_name=n.sender_name,n.reply_to_name=r||Nt.defaultReplyToName||Nt.defaultSenderName||"",n.reply_to_email=Nt.replyToEmail||n.email||Nt.defaultReplyToEmail||"",n}return e.subject&&(n.subject=e.subject,t.first_name?n.personal_subject=(t.first_name+" "+e.subject).trim():n.personal_subject=e.subject),n.to=function(t){if(t.first_name||t.last_name){return (((t.first_name||"")+" "+(t.last_name||"")).trim()+" <"+t.email+">").trim()}return t.email}(t),n.greeting=((Nt.greeting||"Hi")+" "+(t.first_name||Nt.greetingPlaceholder||"")).trim(),n}L({target:"String",proto:!0,forced:(hn="trim",l(function(){return yn[hn]()||"​᠎"!="​᠎"[hn]()||yn[hn].name!==hn}))},{trim:function(){return bn(this)}});function xn(t,r,o,i){return t.map(function(t){return e=o,n=i,En(Sn(r,t=t)||Sn(e,t)||{email:t},n);var e,n;})}function wn(t){var e={};e.subject=Nt.subject,e.subject||(r=De("subject"),e.subject=r&&r.value);var n,r,o=Fe();o&&(n=o.value.split(/[,\s]+/),r=Ue(o),e=xn(n,r,t,e),Ge(o,e));}function On(t,e,n){Ge(qe(),En(n,{owner:!0}));}function jn(t){t.preventDefault(),wn([]),(t=function(){var t=Me();if(t){var e={};return t.querySelectorAll("input,textarea,select").forEach(function(t){e[Ve(t)]=Ue(t,t.value);}),e}return null}())&&Ln(t);}function _n(){var t=Nt.cloudspongeOptions||{},e=Me();e&&(qe()&&(t.beforeDisplayContacts=On),Fe()&&(t.afterSubmitContacts=wn),e.addEventListener("submit",jn)),Pn(t);}function Rn(t){var e,n;t.key&&(e="http"+((n=t).insecure?"":"s")+"://"+(n.host||"api.cloudsponge.com")+"/widget/"+n.key+".js",t=_n,window.cloudsponge||document.querySelector("#"+Dt)?t&&t():((n=document.createElement("script")).id=Dt,n.src=e,n.onload=t,Cn.parentElement.appendChild(n)));}function Tn(t){return "object"==typeof t&&!Nn(t)&&!In(t)}function An(t){Object.assign(Nt,t),t.key&&Rn(t),On();}var Pn=function(t){window.cloudsponge.init(t);},Ln=function(t){return window.cloudsponge.trigger(t).then(function(){Nt.success&&Nt.success();}).catch(function(t){Nt.failure&&Nt.failure(t);})},Cn=document.currentScript||document.querySelector("script[data-id=cloudsponge-"+kt+'],script[src*="address-book-connector.js"]')||{parentElement:document.head},In=function(t){return null===t},Nn=function(t){return Array.isArray(t)},L=function(){Tn(Cn)&&Tn(Cn.dataset)&&"string"==typeof Cn.dataset.key&&An(Cn.dataset);};return L(),{initialize:L,setOptions:An}});
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

	var success = function success() {
	  var contacts = document.querySelector('[data-addressBookConnector-js] .cloudsponge-contacts') || document.createElement('input');
	  var emails = contacts.value;
	  var alertElement = document.getElementById('better-sharing-status-message');

	  if (alertElement) {
	    alertElement.innerHTML = '<div class="better-sharing-alert better-sharing-alert-success">' + ("We sent an email to " + emails + ".</div>");
	  } // clear the contacts field


	  contacts.value = '';
	};

	var failure = function failure(data) {
	  console.error('[betterSharing] There was a problem sending the email: ', data);
	  var alertElement = document.getElementById('better-sharing-status-message');

	  if (alertElement) {
	    alertElement.innerHTML = '<div class="better-sharing-alert better-sharing-alert-warning">We failed to send any email: ' + (data.xhr.responseText || 'This may have been a duplicate email or another unknown error occurred.') + '.</div>';
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

	var emailFormTemplate = (function (_) {
	  return "<div class=\"better-sharing-email-form\"><style>" + _.css + "</style><div class=\"better-sharing-row\"><div class=\"better-sharing-col-12\" id=\"better-sharing-status-message\"></div></div><form action=\"#\" accept-charset=\"UTF-8\" method=\"post\" data-addressbookconnector-js=\"true\"><input type=\"hidden\" name=\"owner\" id=\"owner\" value=\"\"> <input type=\"hidden\" name=\"subject\" value=\"" + _.subject.default + "\"> <input type=\"hidden\" name=\"referralLink\" id=\"referralLink\" value=\"" + _.referralLink + "\"><div class=\"better-sharing-row\"><div class=\"better-sharing-col-8\"><input type=\"text\" name=\"" + _.toField.name + "\" class=\"cloudsponge-contacts better-sharing-input\" placeholder=\"" + _.toField.placeholder + "\" required=\"required\" title=\"To:\" aria-describedby=\"#better-sharing-email-help\"><div id=\"better-sharing-email-help\" class=\"better-sharing-input-help\">" + _.toField.hint + "</div></div><div class=\"better-sharing-col-4\"><a class=\"cloudsponge-launch better-sharing-button better-sharing-contact-button\" title=\"" + _.contactPickerButton.label + "\">" + _.contactPickerButton.label + "</a></div></div><div class=\"better-sharing-row\"><div class=\"better-sharing-col-8\"><textarea title=\"Message Body\" name=\"" + _.messageField.name + "\" class=\"better-sharing-input\" rows=\"3\" placeholder=\"" + _.messageField.placeholder + "\">" + _.messageField.default + "</textarea></div></div><div class=\"better-sharing-row\"><div class=\"better-sharing-col-4\"><button class=\"better-sharing-button better-sharing-send-button\" title=\"" + _.send.label + "\" type=\"submit\">" + _.send.label + "</button></div></div></form></div>";
	});

	var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

	var css = ".better-sharing-email-form *, .better-sharing-email-form ::after, .better-sharing-email-form ::before {\n  box-sizing: border-box; }\n\n.better-sharing-alert {\n  position: relative;\n  padding: .75rem 1.25rem;\n  margin-bottom: 1rem;\n  border: 1px solid transparent;\n  border-radius: .25rem; }\n\n.better-sharing-alert-warning {\n  color: #856404;\n  background-color: #fff3cd;\n  border-color: #ffeeba; }\n\n.better-sharing-alert-success {\n  color: #155724;\n  background-color: #d4edda;\n  border-color: #c3e6cb; }\n\n/* Clear floats after the columns */\n.better-sharing-row {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n  flex-wrap: wrap;\n  margin-right: -15px;\n  margin-left: -15px;\n  margin-bottom: .5rem; }\n\n.better-sharing-col-4 {\n  position: relative;\n  width: 100%;\n  padding-right: 15px;\n  padding-left: 15px; }\n  @media (min-width: 768px) {\n    .better-sharing-col-4 {\n      -ms-flex: 0 0 33.333333%;\n      flex: 0 0 33.333333%;\n      max-width: 33.333333%; } }\n\n.better-sharing-col-8 {\n  position: relative;\n  width: 100%;\n  padding-right: 15px;\n  padding-left: 15px; }\n  @media (min-width: 768px) {\n    .better-sharing-col-8 {\n      -ms-flex: 0 0 66.666667%;\n      flex: 0 0 66.666667%;\n      max-width: 66.666667%; } }\n\n.better-sharing-col-12 {\n  position: relative;\n  width: 100%;\n  padding-right: 15px;\n  padding-left: 15px;\n  -ms-flex: 0 0 100%;\n  flex: 0 0 100%;\n  max-width: 100%; }\n\n.better-sharing-input {\n  box-sizing: border-box;\n  margin: 0;\n  font-family: inherit;\n  display: block;\n  width: 100%;\n  height: calc(1.5em + .75rem + 2px);\n  padding: .375rem .75rem;\n  color: #495057;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ced4da;\n  border-radius: .25rem; }\n\ntextarea.better-sharing-input {\n  overflow: auto;\n  resize: vertical;\n  height: auto; }\n\n.better-sharing-input-help {\n  display: block;\n  margin-top: .25rem;\n  font-size: 75%; }\n\n.better-sharing-button {\n  width: 100%;\n  cursor: pointer;\n  display: inline-block;\n  text-align: center;\n  vertical-align: middle;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  background-color: transparent;\n  border: 1px solid transparent;\n  padding: .375rem .75rem;\n  border-radius: .25rem;\n  font-family: inherit;\n  font-size: 100%; }\n\n.better-sharing-contact-button {\n  color: #fff;\n  background-color: #6c757d;\n  border-color: #6c757d; }\n\n.better-sharing-send-button {\n  color: #fff;\n  background-color: #007bff;\n  border-color: #007bff; }\n";
	n(css, {});

	defaults({
	  contactPickerButton: {
	    label: 'Add from Contacts'
	  },
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
	  referralLink: window.location,
	  send: {
	    label: 'Send the Invitation'
	  },
	  selector: '.better-sharing-inline-email-form'
	});

	var betterSharing = function betterSharing(element, opts) {
	  if (element === void 0) {
	    element = null;
	  }

	  if (opts === void 0) {
	    opts = {};
	  }

	  // apply the options
	  var renderOpts = Object.assign({
	    css: css
	  }, options(), opts); // attempt to find the default element

	  if (!element) {
	    element = document.querySelector(options().selector);
	  } // do something if there is an element passed in


	  if (element) {
	    element.innerHTML = emailFormTemplate(renderOpts);
	  }
	}; // allow the options to be assigned this way


	betterSharing.options = options; // everything is set up, attempt to attach to the selector

	betterSharing();

	return betterSharing;

}());
