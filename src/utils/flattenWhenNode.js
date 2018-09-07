import { DEFAULT_DIVIDER, ACTION_TYPE_DELIMITER } from '../constants';
import isMap from './isMap';
import ownKeys from './ownKeys';

function get(key, x) {
  return isMap(x) ? x.get(key) : x[key];
}

export default predicate =>
  function flatten(
    map,
    { divider = DEFAULT_DIVIDER, prefix } = {},
    partialFlatMap = {},
    partialFlatActionType = ''
  ) {
    function connectNamespace(type) {
      if (!partialFlatActionType) return type;
      const types = type.toString().split(ACTION_TYPE_DELIMITER);
      const partials = partialFlatActionType.split(ACTION_TYPE_DELIMITER);
      return []
        .concat(...partials.map(p => types.map(t => `${p}${divider}${t}`)))
        .join(ACTION_TYPE_DELIMITER);
    }

    function connectPrefix(type) {
      if (partialFlatActionType || !prefix) {
        return type;
      }

      return `${prefix}${divider}${type}`;
    }

    ownKeys(map).forEach(type => {
      const nextNamespace = connectPrefix(connectNamespace(type));
      const mapValue = get(type, map);

      if (predicate(mapValue)) {
        flatten(mapValue, { divider, prefix }, partialFlatMap, nextNamespace);
      } else {
        partialFlatMap[nextNamespace] = mapValue;
      }
    });

    return partialFlatMap;
  };
