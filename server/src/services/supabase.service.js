import { createClient } from "@supabase/supabase-js"

const supabase = createClient('https://pzybqwtuuqvkkvxijrxw.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eWJxd3R1dXF2a2t2eGlqcnh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUxNzk2NDMsImV4cCI6MjA0MDc1NTY0M30.AOEyk6uUzZBIDB2G4jrdqBn19pQl06rbccqdluBVHC8')

export async function storeCodeVerifier(codeVerifier, expiresAt, state) {
    const { data, error } = await supabase.from('code_verifiers').insert([{ code_verifier: codeVerifier, expires_at: expiresAt, state: state }])

    if (error) {
        console.error('Error storing code verifier:', error);
        throw error;
    }

    return
}

export async function getCodeVerifier(state) {
    const { data, error } = await supabase
        .from('code_verifiers')
        .select('code_verifier')
        .eq('state', state)
        .single()

    if (error) {
        console.error('Error retrieving code verifier:', error);
        throw error;
    }

    return data ? data.code_verifier : null;
}