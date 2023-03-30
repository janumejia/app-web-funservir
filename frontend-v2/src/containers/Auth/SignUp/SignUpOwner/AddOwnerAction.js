export default function addDataAction(state, payload) {
  return {
    ...state,
    data: {
      ...state.data,
      ...payload,
    },
  };
}

export function addDataResetAction() {
  return {
    data: {},
  };
}
