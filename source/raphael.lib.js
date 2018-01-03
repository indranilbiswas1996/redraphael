/* eslint require-jsdoc: 'error', valid-jsdoc: 'error' */
let UNDEF,
    arrayToStr = '[object Array]',
    objectToStr = '[object Object]',
    checkCyclicRef = function (obj, parentArr) {
        var i = parentArr.length,
            bIndex = -1;

        while (i--) {
            if (obj === parentArr[i]) {
                bIndex = i;
                return bIndex;
            }
        }

        return bIndex;
    },
    merge = function (obj1, obj2, skipUndef, tgtArr, srcArr) {
        var item,
            srcVal,
            tgtVal,
            str,
            cRef;
        // check whether obj2 is an array
        // if array then iterate through it's index
        //* *** MOOTOOLS precution
        if (!srcArr) {
            tgtArr = [obj1];
            srcArr = [obj2];
        } else {
            tgtArr.push(obj1);
            srcArr.push(obj2);
        }

        if (obj2 instanceof Array) {
            for (item = 0; item < obj2.length; item += 1) {
                try {
                    srcVal = obj1[item];
                    tgtVal = obj2[item];
                } catch (e) {
                    continue;
                }

                if (typeof tgtVal !== 'object') {
                    if (!(skipUndef && tgtVal === UNDEF)) {
                        obj1[item] = tgtVal;
                    }
                } else {
                    if (srcVal === null || typeof srcVal !== 'object') {
                        srcVal = obj1[item] = tgtVal instanceof Array ? [] : {};
                    }
                    cRef = checkCyclicRef(tgtVal, srcArr);
                    if (cRef !== -1) {
                        srcVal = obj1[item] = tgtArr[cRef];
                    } else {
                        merge(srcVal, tgtVal, skipUndef, tgtArr, srcArr);
                    }
                }
            }
        } else {
            for (item in obj2) {
                try {
                    srcVal = obj1[item];
                    tgtVal = obj2[item];
                } catch (e) {
                    continue;
                }

                if (tgtVal !== null && typeof tgtVal === 'object') {
                    // Fix for issue BUG: FWXT-602
                    // IE < 9 Object.prototype.toString.call(null) gives
                    // '[object Object]' instead of '[object Null]'
                    // that's why null value becomes Object in IE < 9
                    str = Object.prototype.toString.call(tgtVal);
                    if (str === objectToStr) {
                        if (srcVal === null || typeof srcVal !== 'object') {
                            srcVal = obj1[item] = {};
                        }
                        cRef = checkCyclicRef(tgtVal, srcArr);
                        if (cRef !== -1) {
                            srcVal = obj1[item] = tgtArr[cRef];
                        } else {
                            merge(srcVal, tgtVal, skipUndef, tgtArr, srcArr);
                        }
                    } else if (str === arrayToStr) {
                        if (srcVal === null || !(srcVal instanceof Array)) {
                            srcVal = obj1[item] = [];
                        }
                        cRef = checkCyclicRef(tgtVal, srcArr);
                        if (cRef !== -1) {
                            srcVal = obj1[item] = tgtArr[cRef];
                        } else {
                            merge(srcVal, tgtVal, skipUndef, tgtArr, srcArr);
                        }
                    } else {
                        obj1[item] = tgtVal;
                    }
                } else {
                    obj1[item] = tgtVal;
                }
            }
        }
        return obj1;
    };
/**
 * Function extend one object's properties with another one
 * @param    {Object} obj1 The object that will be extend
 * @param    {Objcet} obj2 The object, properties of which will be extended into the first one.
 * @param    {boolean} skipUndef Whether to skip the properties with undefined value
 * @param    {boolean} shallow whether it will be a shallow copy or deep copy
 * @return {Object} return the extend object
 */
export default function (obj1, obj2, skipUndef, shallow) {
    var item;
    // if none of the arguments are object then return back
    if (typeof obj1 !== 'object' && typeof obj2 !== 'object') {
        return null;
    }

    if (typeof obj2 !== 'object' || obj2 === null) {
        return obj1;
    }

    if (typeof obj1 === 'undefined') {
        obj1 = obj2 instanceof Array ? [] : {};
    }
    if (shallow) {
        // Copy all methods and properties of the object passed in parameter
        // to the object to which this function is attached.
        for (item in obj2) {
            obj1[item] = obj2[item];
        }
    } else {
        merge(obj1, obj2, skipUndef);
    }
    return obj1;
}

export {merge};