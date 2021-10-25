export const initialState = JSON.parse(localStorage.getItem("user"));
//State here refers to the user object that is set in the local storage - returns null if no user is set

export const userReducer = (state, action) => {
  switch (action.type) {
    case "USER":
      return action.payload;
    case "CLEAR":
      return null;
    case "UPDATE":
      return {
        ...state,
        followers: action.payload.followers,
        following: action.payload.following,
      };
    case "UPDATEPIC":
      return {
        ...state,
        picture: action.payload,
      };
    default:
      return state;
  }
};

// export const reducer = (state, action) => {
//   if (action.type === "USER") {
//     return action.payload;
//   }
//   if (action.type === "CLEAR") {
//     return null;
//   }
//   if (action.type === "UPDATE") {
//     return {
//       ...state,
//       followers: action.payload.followers,
//       following: action.payload.following,
//     };
//   }
//   if (action.type === "UPDATEPIC") {
//     return {
//       ...state,
//       profilePhoto: action.payload,
//     };
//   }
//   return state;
// };
