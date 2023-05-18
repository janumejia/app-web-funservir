export default function addDataAction(state, payload) {
  return {
    ...state,
    dataAddSite: {
      ...state.dataAddSite,
      ...payload,
    },
  };
}

export function addDataResetAction() {
  return {
    dataAddSite: {},
  };
}
