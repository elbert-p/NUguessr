// utils/updateTotalGames.js

import { createClient } from "../../lib/supabase/client"; // Update this path if needed

export const updateTotalGamesPlayed = async (userId: string): Promise<void> => {
  const supabaseClient = createClient();

  // Fetch the user's current total_games count
  const { data: userRecord, error: fetchError } = await supabaseClient
    .from("users")
    .select("total_games")
    .eq("id", userId)
    .single();

  if (fetchError) {
    console.error("Error fetching user data:", fetchError);
    return;
  }

  console.log("Current total games:", userRecord?.total_games);

  const newTotalGames = (userRecord?.total_games || 0) + 1;

  // Attempt to update the total_games column
  const { error: updateError } = await supabaseClient
    .from("users")
    .update({ total_games: newTotalGames })
    .eq("id", userId);

  if (updateError) {
    console.error("Error updating total games:", updateError);
  } else {
    console.log(`Successfully updated total games to: ${newTotalGames}`);
  }
};
