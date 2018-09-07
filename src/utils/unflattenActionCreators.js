import { DEFAULT_DIVIDER } from '../constants';
import isEmpty from './isEmpty';

export default function unflattenActionCreators(
  flatActionCreators,
  { divider = DEFAULT_DIVIDER, prefix } = {}
) {
  function unflatten(
    flatActionType,
    partialNestedActionCreators = {},
    partialFlatActionTypePath = []
  ) {
    const nextNamespace = partialFlatActionTypePath.shift();
    if (isEmpty(partialFlatActionTypePath)) {
      partialNestedActionCreators[nextNamespace] =
        flatActionCreators[flatActionType];
    } else {
      if (!partialNestedActionCreators[nextNamespace]) {
        partialNestedActionCreators[nextNamespace] = {};
      }
      unflatten(
        flatActionType,
        partialNestedActionCreators[nextNamespace],
        partialFlatActionTypePath
      );
    }
  }

  const nestedActionCreators = {};
  Object.getOwnPropertyNames(flatActionCreators).forEach(type => {
    const unprefixedType = prefix
      ? type.replace(`${prefix}${divider}`, '')
      : type;
    return unflatten(type, nestedActionCreators, unprefixedType.split(divider));
  });

  return nestedActionCreators;
}
