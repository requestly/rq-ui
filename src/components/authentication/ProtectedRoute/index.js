import React, { useContext, useState, useEffect } from "react";
// STORE
import { store } from "../../../store";
// UTILS
import { getUserAuthDetails } from "../../../utils/GlobalStoreUtils";
// SUB COMPONENTS
import LoginRequiredCTA from "../LoginRequiredCTA";
import PremiumRequiredCTA from "../../payments/PremiumRequiredCTA";

const ProtectedRoute = ({
  component: Component,
  premiumRequired,
  premiumMessage,
  routeSrc,
  hardRedirect = false,
  ...rest
}) => {
  // Global State
  const globalState = useContext(store);
  const { state } = globalState;
  const user = getUserAuthDetails(state);
  // Component State
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    if (!isPremiumUser) {
      setIsPremiumUser(user.details?.isPremium);
    }
  }, [user, isPremiumUser]);

  return (
    <React.Fragment>
      {user.loggedIn ? (
        premiumRequired && !isPremiumUser ? (
          <PremiumRequiredCTA message={premiumMessage} />
        ) : (
          <Component {...rest} />
        )
      ) : (
        <LoginRequiredCTA src={routeSrc} hardRedirect={hardRedirect} />
      )}
    </React.Fragment>
  );
};

export default ProtectedRoute;
