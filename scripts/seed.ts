import { supabaseAdmin } from "../src/lib/supabaseAdmin.js";

async function run() {
  await supabaseAdmin.from("projects").insert([
    { title: "European Market Movers", slug: "european-market-movers", status: "published", cover_bg: "#0b122b" },
    { title: "Million Slots Billboard", slug: "billboard", status: "published", cover_bg: "#0b122b" },
  ]);
  await supabaseAdmin.from("articles").insert([
    { title: "The swamp", slug: "the-swamp", summary: "Equities", content_html: "<p>ssssssssssssssssssssssssssss</p>", published_at: new Date().toISOString() }
  ]);
  await supabaseAdmin.from("about").insert([{ body_html: "<p>Write your about text in the editor. This is a placeholder.</p>" }]);
  console.log("Seeded");
}

run().catch((e) => { console.error(e); process.exit(1); });
