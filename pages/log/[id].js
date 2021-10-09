import Update from "components/Update";
import { supabase } from "utils/supabaseClient";
import formatDate from "utils/formatDate";

const Log = ({ userInfo, updates }) => {
  return (
    <div className="bg-gray-200 min-h-screen pt-32 pb-16">
      <main className="w-full px-8 sm:px-16 max-w-3xl mx-auto space-y-8">
        {updates.map((update) => {
          const date = formatDate(new Date(update.created_at));
          return (
            <Update
              key={update.id}
              username={userInfo.username}
              description={update.description}
              emoji={update.emoji}
              date={date}
            />
          );
        })}
      </main>
    </div>
  );
};

export default Log;

export const getServerSideProps = async ({ params }) => {
  const { data: userInfo } = await supabase
    .from("profiles")
    .select("id, username")
    .eq("id", params.id)
    .single();
  if (userInfo == null) {
    return {
      notFound: true,
    };
  }
  const { data: updates } = await supabase
    .from("updates")
    .select("emoji, description, id, created_at")
    .order("created_at", { ascending: false })
    .eq("user_id", params.id);
  return {
    props: {
      userInfo,
      updates,
    },
  };
};