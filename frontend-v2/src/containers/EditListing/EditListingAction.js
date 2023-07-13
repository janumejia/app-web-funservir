export default function EditDataAction(state, payload) {
  return {
    ...state,
    dataEditSite: {
      ...state.dataEditSite,
      ...payload,
    },
  };
}

export function EditDataResetAction() {
  return {
    dataEditSite: {},
  };
}
