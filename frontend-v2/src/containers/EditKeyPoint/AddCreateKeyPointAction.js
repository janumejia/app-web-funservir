export default function editDataAction(state, payload) {
  return {
    ...state,
    dataEditKeyPoint: {
      ...state.dataEditKeyPoint,
      ...payload,
    },
  };
}

export function editDataResetAction() {
  return {
    dataEditKeyPoint: {},
  };
}
