import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const envPath = path.join(root, ".env");
const env = {};

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
  }
}

const supabaseUrl = env.VITE_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const accounts = [
  { role: "superadmin", name: "Alex Rivera", email: "super@epros.com", password: "demo1234" },
  { role: "admin", name: "Priya Sharma", email: "admin@epros.com", password: "demo1234" },
  { role: "admin", name: "Rahul Verma", email: "admin2@epros.com", password: "demo1234" },
  { role: "client", name: "Dr. Arjun Mehta", email: "client@epros.com", password: "demo1234" },
  { role: "team", name: "Sarah Chen", email: "team@epros.com", password: "demo1234" },
  { role: "consultant", name: "Dr. James Liu", email: "consultant@epros.com", password: "demo1234" },
];

function initials(name) {
  return name.split(" ").filter(Boolean).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "U";
}

async function findUserByEmail(email) {
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const found = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < 100) return null;
    page += 1;
  }
}

for (const account of accounts) {
  const existing = await findUserByEmail(account.email);
  const userResult = existing
    ? await admin.auth.admin.updateUserById(existing.id, {
        password: account.password,
        email_confirm: true,
        user_metadata: { name: account.name, role: account.role },
      })
    : await admin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: { name: account.name, role: account.role },
      });

  if (userResult.error) throw userResult.error;
  const user = userResult.data.user;

  const { error: profileError } = await admin.from("portal_profiles").upsert({
    id: user.id,
    email: account.email,
    name: account.name,
    role: account.role,
    avatar: initials(account.name),
    active: true,
    updated_at: new Date().toISOString(),
  });

  if (profileError) {
    console.warn(`Profile skipped for ${account.email}: ${profileError.message}`);
  } else {
    console.log(`Seeded ${account.email} (${account.role})`);
  }
}
