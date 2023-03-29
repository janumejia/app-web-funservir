export default function addListingAction(state, payload) {
  console.log(state, payload);
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
