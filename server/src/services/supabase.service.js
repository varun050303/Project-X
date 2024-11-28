// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   "https://pzybqwtuuqvkkvxijrxw.supabase.co",
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eWJxd3R1dXF2a2t2eGlqcnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUxNzk2NDMsImV4cCI6MjA0MDc1NTY0M30.AOEyk6uUzZBIDB2G4jrdqBn19pQl06rbccqdluBVHC8"
// );

// export async function storeCodeVerifier(codeVerifier, state) {
//   const { error } = await supabase
//     .from("CodeVerifier")
//     .insert([{ code: codeVerifier, state: state }]);

//   if (error) {
//     console.error("Error storing code verifier:", error);
//     throw error;
//   }

//   return;
// }

// export async function getCodeVerifier(state) {
//   const { data, error } = await supabase
//     .from("CodeVerifier")
//     .select("code")
//     .eq("state", state)
//     .single();

//   if (error) {
//     console.error("Error retrieving code verifier:", error);
//     throw error;
//   }

//   return data ? data.code_verifier : null;
// }

// export async function cleanupAfterLogin(state) {
//   try {
//     // Delete the state entry from the oauth_states table
//     const { error: stateError } = await supabase
//       .from("CodeVerifier")
//       .delete()
//       .eq("state", state); // Match by state parameter

//     if (stateError) {
//       throw new Error(`Error deleting state: ${stateError.message}`);
//     }

//     // Delete the code verifier entry from the code_verifiers table
//     const { error: verifierError } = await supabase
//       .from("CodeVerifier")
//       .delete()
//       .eq("state", state); // Match by state parameter

//     if (verifierError) {
//       throw new Error(`Error deleting code verifier: ${verifierError.message}`);
//     }

//     console.log("Cleanup successful: State and Code Verifier deleted.");
//   } catch (error) {
//     console.error("Error during cleanup:", error.message);
//     throw error;
//   }
// }
