export default function addListingAction(state, payload) {
  console.log("pasa por aqui")
  console.log("state: ", state, " payload: ", payload);
  return {
    ...state,
    data: {
      ...state.data,
      ...payload,
    },
  };
}

export function addListingResetAction() {
  return {
    data: { guest: 0, bed: 0 },
  };
}
