import Link from "next/link";
export default function Landing() {
  return (
    <>
      <div className="header">
        <div className="h-14 bg-emerald-800 display flex flex-row justify-between items-center px-3">
          <Link href="/"><div className="name text-2xl font-bold">KNN Recommendation system</div></Link>
          <div className="options flex flex-row gap-4">
            <Link href="/authentication/Login"><div className="Login">Login</div></Link>
            <Link href="/authentication/SignUp"><div className="SignUp">Sign Up</div></Link>
          </div>
        </div>
      </div>
      <main className="p-6">
        <div className="font-gmono text-5xl">What is KNN?</div>
        <p className="font-gmono text-justify mt-5">K-Nearest Neighbors (KNN) is a simple and powerful machine learning algorithm that makes predictions by finding the “K” most similar data points to a given input and using their information to decide the output. In a restaurant recommendation system, KNN can be used to suggest restaurants based on a user’s preferences, past ratings, location, or ordering history. For example, if a user likes Italian cuisine and highly rates budget-friendly places, the system can find other users with similar tastes and recommend restaurants they enjoyed. By measuring similarity (such as cuisine type, price range, and ratings), KNN helps deliver personalized and relevant restaurant suggestions, improving user experience and satisfaction.</p>
      </main>
      <footer className="text-center absolute bottom-0 w-full p-8 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} KNN Recommendation System. All rights reserved.
      </footer>
    </>
  );
}
