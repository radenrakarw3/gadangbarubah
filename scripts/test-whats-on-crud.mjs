const base = "http://localhost:3000";
let cookie = "";

function absorbCookies(res) {
  const setCookies = res.headers.getSetCookie?.() ?? [];
  for (const raw of setCookies) {
    const part = raw.split(";")[0];
    const name = part.split("=")[0];
    if (cookie.includes(`${name}=`)) {
      cookie = cookie
        .split("; ")
        .filter((c) => !c.startsWith(`${name}=`))
        .concat(part)
        .join("; ");
    } else {
      cookie = cookie ? `${cookie}; ${part}` : part;
    }
  }
}

async function req(method, path, body, { formData, auth = false } = {}) {
  const headers = {};
  if (auth && cookie) headers.Cookie = cookie;
  let payload;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(`${base}${path}`, { method, headers, body: payload });
  if (auth) absorbCookies(res);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text.slice(0, 200) };
  }
  return { status: res.status, json, text };
}

const steps = [];

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

try {
  const login = await req(
    "POST",
    "/api/auth/login",
    { username: "admin", password: "admin123", portal: "main" },
    { auth: true },
  );
  assert(login.status === 200 && login.json.success, `Login gagal: ${JSON.stringify(login.json)}`);
  steps.push("login OK");

  const adminBefore = await req("GET", "/api/admin/whats-on/articles", undefined, { auth: true });
  const publicBefore = await req("GET", "/api/whats-on/articles");
  assert(adminBefore.status === 200, "Admin list gagal");
  assert(publicBefore.status === 200, "Public list gagal");
  const publishedBefore = publicBefore.json.articles?.length ?? 0;
  steps.push("db→api list OK");

  const fd = new FormData();
  const slug = `test-artikel-${Date.now()}`;
  fd.append("slug", slug);
  fd.append("titleId", "Artikel Uji Coba");
  fd.append("titleEn", "Test Article");
  fd.append("excerptId", "Ringkasan uji coba.");
  fd.append("excerptEn", "Test excerpt.");
  fd.append("contentId", "Konten lengkap uji coba.");
  fd.append("contentEn", "Full test content.");
  fd.append("categoryId", "Uji");
  fd.append("categoryEn", "Test");
  fd.append("publishedAt", "2026-06-15");
  fd.append("isPublished", "true");
  fd.append("sortOrder", "0");

  const create = await req("POST", "/api/admin/whats-on/articles", undefined, { formData: fd, auth: true });
  assert(create.status === 200 && create.json.article?.id, `Create gagal: ${JSON.stringify(create.json)}`);
  const id = create.json.article.id;
  steps.push("api→db create OK");

  const publicAfterCreate = await req("GET", "/api/whats-on/articles");
  assert(
    publicAfterCreate.json.articles?.some((a) => a.slug === slug),
    "Artikel baru tidak muncul di list publik",
  );
  assert(
    (publicAfterCreate.json.articles?.length ?? 0) === publishedBefore + 1,
    "Jumlah artikel publik tidak sinkron",
  );
  steps.push("db→public list sync OK");

  const detail = await req("GET", `/api/whats-on/articles/${slug}`);
  assert(detail.status === 200 && detail.json.article?.slug === slug, `Detail route gagal`);
  steps.push("slug route OK");

  const newSlug = `${slug}-revised`;
  const edit = await req(
    "PATCH",
    `/api/admin/whats-on/articles/${id}`,
    { titleId: "Artikel Uji Coba Diubah", slug: newSlug },
    { auth: true },
  );
  assert(edit.status === 200 && edit.json.article?.slug === newSlug, `Edit gagal: ${JSON.stringify(edit.json)}`);
  steps.push("api→db edit OK");

  const oldSlugGone = await req("GET", `/api/whats-on/articles/${slug}`);
  const newSlugWorks = await req("GET", `/api/whats-on/articles/${newSlug}`);
  assert(oldSlugGone.status === 404, "Slug lama masih aktif setelah ubah");
  assert(newSlugWorks.status === 200, "Slug baru tidak ditemukan");
  steps.push("slug change sync OK");

  const adminBySlug = await req("GET", `/api/admin/whats-on/articles/by-slug/${newSlug}`, undefined, {
    auth: true,
  });
  assert(adminBySlug.status === 200 && adminBySlug.json.article?.id === id, "Admin by-slug gagal");
  steps.push("admin by-slug OK");

  const hide = await req(
    "PATCH",
    `/api/admin/whats-on/articles/${id}/publish`,
    { isPublished: false },
    { auth: true },
  );
  assert(hide.status === 200 && hide.json.article?.isPublished === false, `Hide gagal`);
  steps.push("hide OK");

  const publicHidden = await req("GET", `/api/whats-on/articles/${newSlug}`);
  const publicListHidden = await req("GET", "/api/whats-on/articles");
  assert(publicHidden.status === 404, `Draft masih publik di detail`);
  assert(!publicListHidden.json.articles?.some((a) => a.id === id), "Draft masih di list publik");
  steps.push("hide→public sync OK");

  const show = await req(
    "PATCH",
    `/api/admin/whats-on/articles/${id}/publish`,
    { isPublished: true },
    { auth: true },
  );
  assert(show.status === 200 && show.json.article?.isPublished === true, `Publish gagal`);
  steps.push("publish OK");

  const sitemap = await req("GET", "/sitemap.xml");
  assert(sitemap.status === 200 && sitemap.text.includes(`/whats-on/${newSlug}`), "Sitemap tidak ada slug artikel");
  steps.push("sitemap sync OK");

  const del = await req("DELETE", `/api/admin/whats-on/articles/${id}`, undefined, { auth: true });
  assert(del.status === 200 && del.json.success, `Delete gagal`);
  steps.push("delete OK");

  const afterDelete = await req("GET", `/api/whats-on/articles/${newSlug}`);
  const adminAfter = await req("GET", "/api/admin/whats-on/articles", undefined, { auth: true });
  assert(afterDelete.status === 404, `Artikel masih ada setelah hapus`);
  assert(!adminAfter.json.articles?.some((a) => a.id === id), "Artikel masih di admin setelah hapus");
  steps.push("delete sync OK");

  console.log("ALL PASSED:", steps.join(" → "));
} catch (err) {
  console.error("FAILED at:", steps.join(" → "));
  console.error(err.message);
  process.exit(1);
}
