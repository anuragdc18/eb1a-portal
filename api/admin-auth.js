const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const normalizedSupabaseUrl = supabaseUrl?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");

function initials(name) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!normalizedSupabaseUrl || !serviceRoleKey) return res.status(500).json({ error: "Supabase admin env is not configured." });

  const admin = createClient(normalizedSupabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (!token) return res.status(401).json({ error: "Missing auth token" });

  const { data: requester, error: requesterError } = await admin.auth.getUser(token);
  if (requesterError || !requester.user) return res.status(401).json({ error: "Invalid auth token" });

  const { data: profile } = await admin.from("portal_profiles").select("role,active").eq("id", requester.user.id).maybeSingle();
  const metaRole = requester.user.user_metadata?.role;
  const requesterRole = profile?.role ?? metaRole;
  if (!["superadmin", "admin"].includes(requesterRole) || profile?.active === false) {
    return res.status(403).json({ error: "Only admins can manage accounts." });
  }

  const { action, account, id, updates } = req.body ?? {};

  if (action === "create") {
    if (requesterRole !== "superadmin") {
      return res.status(403).json({ error: "Only super admins can create accounts." });
    }
    const email = String(account?.email ?? "").trim().toLowerCase();
    const password = String(account?.password ?? "");
    const name = String(account?.name ?? "").trim();
    const role = String(account?.role ?? "client");
    if (!email || !password || !name) return res.status(400).json({ error: "Name, email, and password are required." });

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role },
    });
    if (error || !data.user) return res.status(400).json({ error: error?.message ?? "Could not create user." });

    await admin.from("portal_profiles").upsert({
      id: data.user.id,
      email,
      name,
      role,
      avatar: initials(name),
      active: account?.active ?? true,
      updated_at: new Date().toISOString(),
    });

    return res.status(200).json({ ok: true, id: data.user.id });
  }

  if (action === "update") {
    const { data: targetProfile } = await admin.from("portal_profiles").select("role").eq("id", String(id)).maybeSingle();
    if (!targetProfile) return res.status(404).json({ error: "Account not found." });
    if (requesterRole === "admin") {
      if (targetProfile.role === "superadmin") {
        return res.status(403).json({ error: "Admins cannot edit super admin accounts." });
      }
      const requestedKeys = Object.keys(updates ?? {});
      const adminAllowed = requestedKeys.every((key) => ["name", "avatar"].includes(key));
      if (!adminAllowed) {
        return res.status(403).json({ error: "Admins can only update account names." });
      }
    }

    const authUpdates = {};
    if (updates?.email) authUpdates.email = String(updates.email).trim().toLowerCase();
    if (updates?.password) authUpdates.password = String(updates.password);
    if (updates?.name || updates?.role) {
      authUpdates.user_metadata = {
        ...(updates?.name ? { name: String(updates.name).trim() } : {}),
        ...(updates?.role ? { role: String(updates.role) } : {}),
      };
    }
    if (Object.keys(authUpdates).length) {
      const { error } = await admin.auth.admin.updateUserById(String(id), authUpdates);
      if (error) return res.status(400).json({ error: error.message });
    }

    const profileUpdates = { updated_at: new Date().toISOString() };
    if (updates?.email) profileUpdates.email = String(updates.email).trim().toLowerCase();
    if (updates?.name) {
      profileUpdates.name = String(updates.name).trim();
      profileUpdates.avatar = initials(profileUpdates.name);
    }
    if (updates?.role) profileUpdates.role = String(updates.role);
    if (typeof updates?.active === "boolean") profileUpdates.active = updates.active;
    await admin.from("portal_profiles").update(profileUpdates).eq("id", String(id));

    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ error: "Unknown action." });
};
