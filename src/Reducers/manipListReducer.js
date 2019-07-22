const manipListReducer = (state = [], action) => {
  switch (action.type) {
    case 'ADD_MANIP_LIST':
      return [...state, action.payload]
     default:
      return state;
  }
}

export default manipListReducer;