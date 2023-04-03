export default function addDataAction(state, payload) {
  return {
    ...state,
    data2: {
      ...state.data2,
      ...payload,
    },
  };
}

export function addDataResetAction() {
  return {
    data2: {},
  };
}
