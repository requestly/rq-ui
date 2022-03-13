import ProtectedRoute from "components/authentication/ProtectedRoute";
import AndroidInterceptorIndexView from "../../../components/features/androidInterceptor";

const AndroidInterceptor = () => {
  return <ProtectedRoute component={AndroidInterceptorIndexView} />;
};

export default AndroidInterceptor;
