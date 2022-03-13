import { getAuth } from "firebase/auth";
import { onValue } from "firebase/database";
import { getNodeRef } from "../../../actions/FirebaseActions";
import firebaseApp from "../../../firebase";
import { getUpdateUserProfile } from "../../../store/action-objects";

const userNodeListener = (dispatch) => {
  const auth = getAuth(firebaseApp);
  const user = auth.currentUser;

  if (user) {
    try {
      const userNodeRef = getNodeRef(["users", user.uid, "profile"]);
      onValue(userNodeRef, async (snapshot) => {
        const userDetails = snapshot.val();
        dispatch(getUpdateUserProfile(userDetails));
        // set isSyncEnabled in window so that it can be used in storageService
        window.isSyncEnabled = userDetails.isSyncEnabled || null;
      });
    } catch (e) {}
  }
};

export default userNodeListener;
