export default function addDataAction(state, payload) {
  return {
    ...state,
    dataAddKeyPoint: {
      ...state.dataAddKeyPoint,
      ...payload,
    },
  };
}

export function addDataResetAction() {
  return {
    dataAddKeyPoint: {},
  };
}
