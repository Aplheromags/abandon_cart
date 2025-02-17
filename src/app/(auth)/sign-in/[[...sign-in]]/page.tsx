import { ClerkLoaded, SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { DASHBOARD_REDIRECT } from "@routes";
import { redirect } from "next/navigation";

const SignIpPage = async () => {
  const { userId } = await auth();
  if (userId) {
    redirect(DASHBOARD_REDIRECT);
  }
  return (
    <div className="min-h-screen bg-[#F8F9FA] py-20">
      <div className="MuiBox-root css-1mwmt1e">
        <div className="MuiBox-root css-lx7ul2"></div>
        <div className="MuiBox-root css-v15yn9"></div>
      </div>
      <div className="flex h-full items-center justify-center">
        <ClerkLoaded>
          <SignIn />
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default SignIpPage;
